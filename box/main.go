package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/aldernero/scd4x"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"os"
	"periph.io/x/conn/v3/i2c"
	"periph.io/x/conn/v3/i2c/i2creg"
	"strings"
	"time"

	"machine"
	"tinygo.org/x/drivers/net"
	"tinygo.org/x/drivers/net/http"
	"tinygo.org/x/drivers/wifinina"
)

// TODO: SPLIT PROJECT INTO MULTIPLE FILES.
// TODO: CORRECT ALL ERROR MESSAGES TO BE MORE SIMPLISTIC AND EASY TO UNDERSTAND.
// TODO: WHERE NECESSARY, SEND ALERTS TO NOOTWEB.
// TODO: MAKE SCRIPT STORE IMPORTANT VALUES IN EEPROM
// TODO: ADD A FUNCTION TO CONNECT TO THE INTERNET.

// IMPORTANT VARIABLES USED THROUGHOUT THIS CODE
var BoxID string
var BoxToken string
var wifiSSID string     // Name of the Wi-Fi network
var wifiPassword string // Password of the Wi-Fi network

// Connect to the internet.
// These are the default pins for the Arduino Nano33 IoT.
// Change these to connect to a different UART or pins for the ESP8266/ESP32
var (
	// These are the default pins for the Arduino Nano33 IoT.
	spi = machine.NINA_SPI

	// This is the ESP chip that has the WIFININA firmware flashed on it
	adaptor *wifinina.Device
)

var buf [0x400]byte

var lastRequestTime time.Time
var conn net.Conn

func main() {
	// IMPORTANT CONSTANT VARIABLES. CHECK THESE BEFORE EVERY COMMIT.
	VERSION := "V0.2.0"

	// initiate the logging
	logFile, err := os.OpenFile("NootBOX_logfile.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		fmt.Printf("Failed to create or open the logfile. REASON: Unknown. ERROR: %s\n", err)
		return
	}

	// set the logging output to a file.
	log.SetOutput(logFile)
	fmt.Println("==========================================================================")
	fmt.Println("NootBOX application has started.")
	fmt.Println("Set the logging output to a logfile.")
	fmt.Println("Logging initiated!")

	// Modify some parts of the code accordingly if it is running in production or development mode
	fmt.Printf("This is NootBOX, Version %s.\n", VERSION)
	gin.SetMode(gin.ReleaseMode)

	// Print the text logo
	fmt.Printf(`|=Your NootBOX is starting up!===================================|
| ███╗   ██╗ ██████╗  ██████╗ ████████╗██████╗  ██████╗ ██╗  ██╗ |
| ████╗  ██║██╔═══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔═══██╗╚██╗██╔╝ |
| ██╔██╗ ██║██║   ██║██║   ██║   ██║   ██████╔╝██║   ██║ ╚███╔╝  |
| ██║╚██╗██║██║   ██║██║   ██║   ██║   ██╔══██╗██║   ██║ ██╔██╗  |
| ██║ ╚████║╚██████╔╝╚██████╔╝   ██║   ██████╔╝╚██████╔╝██╔╝ ██╗ |
| ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ |
|===Your NootBOX is starting up!===VERSION: %s===============|
`, VERSION)

	fmt.Println("Attempting to connect to the internet...")
	// idk what this shit does, but It's supposed to work.
	setupWifi()
	http.SetBuf(buf[:])
	waitSerial()
	connectToAP()
	displayIP()

	fmt.Println("Checking if \"boxInfo.noot\" file already exists.")
	// Check if we have a BoxID stored.
	BoxIDFile, err := os.Open("boxInfo.noot") // Likely only work on linux, however that is the only supported platform
	if err != nil {                           // if the file doesn't exist or won't open for some reason, assume un-enrolled.
		fmt.Printf("Failed to open the Box ID storage file, Assuming BoxID = \"0\". REASON: Unknown. ERROR: %s\n", err)
		BoxID = "0"
	} else {
		// if the file exists
		var fileData string                    // var for file content
		scanner := bufio.NewScanner(BoxIDFile) // read first line of the file
		for scanner.Scan() {
			fmt.Println(scanner.Text())
			fileData = scanner.Text() // pull the BoxID
		}

		// parse boxID from fileText
		var fileDataJson map[string]interface{}
		err := json.Unmarshal([]byte(fileData), &fileDataJson)
		if err != nil {
			fmt.Printf("Failed to parse the Box ID storage file. REASON: Unknown. ERROR: %s\n", err)
		}

		BoxID, ok := fileDataJson["boxid"].(string)
		if !ok {
			fmt.Printf("Failed to parse the Box ID storage file. REASON: Unknown. ERROR: %s\n", err)
		}
		BoxToken, ok := fileDataJson["boxtoken"].(string)
		if !ok {
			fmt.Printf("Failed to parse the Box ID storage file. REASON: Unknown. ERROR: %s\n", err)
		}

		// log the boxID
		fmt.Printf("BoxID appears to be \"%s\".\n", BoxID)
		fmt.Printf("BoxToken appears to be \"%s\".\n", asteriskExceptLastFive(BoxToken))

		// close file
		defer func(BoxIDFile *os.File) {
			err := BoxIDFile.Close()
			if err != nil {
				fmt.Printf("Failed to close the Box ID storage file, Assuming BoxID = \"%s\". REASON: Unknown. ERROR: %s\n", BoxID, err)
			}
		}(BoxIDFile)

	}

	if BoxID == "0" { // if the boxID didn't exist:
		fmt.Println("This NootBOX does not seem to be enrolled.")
		fmt.Println("Starting the enrollment webserver.")
		ginEnrollmentServer()
	} else {
		// Yes, there is already a box id.
		// Start the broadcast data function loop
		fmt.Println("This NootBOX appears to be enrolled.")
		fmt.Println("Starting the broadcast data function loop.")
		delay := 30 // delay between measurements in seconds
		broadcastDataLoop(BoxToken, delay)
	}

}

// TODO: Power optimise this at some point (maybe) (probably not) (but maybe) БЛЯТЬ!!!!!!!!!!!
func broadcastDataLoop(BoxToken string, delay int) {
	// create vars for the measurements
	var co2Val uint16
	var tempVal float64
	var humVal float64

	// TODO: Add error corrections to this function

	// create a loop that will run forever
	for {
		// take a measurement
		co2Val, tempVal, humVal = takeMeasurement()

		// send the measurements to NootWEB
		sendMeasurements(int(co2Val), int(tempVal), int(humVal), BoxToken)

		// wait for a bit
		time.Sleep(time.Duration(delay) * time.Second)
	}
}

// takeMeasurement takes a measurement from the sensor and returns the CO2, Temperature and Humidity values.
func takeMeasurement() (uint16, float64, float64) {
	bus, err := i2creg.Open("") // test opening the bus
	if err != nil {
		fmt.Printf("Failed while opening bus: %v\n", err)
	}
	defer func(bus i2c.BusCloser) {
		err := bus.Close()
		if err != nil {
			fmt.Printf("Failed while closing bus: %v\n", err)
		}
	}(bus) // close the bus

	// initiate the sensor
	sensor, err := scd4x.SensorInit(bus, false) // DO NOT use Fahrenheit, all temps are stored in Celsius and translated with mathematical equation.
	if err != nil {
		fmt.Printf("Failed while initializing sensor: %v\n", err)
	}
	sensorData, err := sensor.ReadMeasurement()
	if err != nil {
		fmt.Printf("Failed while reading measurement: %v\n", err)
	}

	return sensorData.CO2, sensorData.Temp, sensorData.Rh
}

// TODO: Make a function to send warnings/alerts to NootWeb
func sendAlert() {}

func sendMeasurements(co2Val int, tempVal int, humVal int, BoxToken string) {
	// send a post request to NootWEB, that will submit the recorded data.
	fmt.Println("Attempting to send recorded measurements to NootWEB...")
	postURL := "https://api.noot.site/push" // the url to send the post req to
	jsonStr := fmt.Sprintf(
		"{\"co2\": %d, \"temp\":%d, \"humidity\": %d, \"token\": \"%s\"}",
		co2Val, tempVal, humVal, BoxToken,
	) // create a var to hold the JSON we will send
	req, err := http.NewRequest("POST", postURL, bytes.NewBuffer([]byte(jsonStr))) // create the request here.
	req.Header.Set("Content-Type", "application/json")                             // tell the server we are sending JSON
	client := &http.Client{}                                                       // initiate http client
	resp, err := client.Do(req)                                                    // send the request we just built
	if err != nil {
		fmt.Printf("Failed to send recorded measurements to NootWEB. REASON: UNKNOWN. ERROR: %s\n", err)
		fmt.Println("These measurements will NOT be sent to NootWEB... skipping...")
		return
	}

	defer func(Body io.ReadCloser) { // close our connection once data is sent.
		err := Body.Close()
		if err != nil {
			fmt.Printf("Failed to send recorded measurements to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s\n", err)
		}
	}(resp.Body)

	body, _ := io.ReadAll(resp.Body) // body of the communication with NootWEB
	fmt.Println("NootWEB responded with: " + string(body))

	// parse the body of the communication with NootWEB and get the "success" json value
	var bodyJsonData map[string]interface{}
	_ = json.Unmarshal([]byte(string(body)), &bodyJsonData)
	success := bodyJsonData["success"].(bool)
	if success { // it worked!! (yay :33)
		// if success, log that the interaction was a success with below statement
		fmt.Printf("Sent recorded measurements to NootWEB. Recorded values were CO2: " +
			string(rune(co2Val)) + ", Temperature: " + string(rune(tempVal)) + ", Humidity: " + string(rune(humVal)) + ". BoxToken: " + asteriskExceptLastFive(BoxToken) + ".\n",
		)
	} else { // it didn't work :(
		// if failed, log that the interaction failed with below statement
		fmt.Printf("Failed to send recorded measurements to NootWEB. REASON: NootWEB replied with \"false\" to the \"success\" JSON variable. ERROR: %s\n", err)
		fmt.Println("These measurements will NOT be sent to NootWEB... skipping...")
	}
}

// This function is used when you want to create a webserver for the user to enroll their box onto.
func ginEnrollmentServer() {
	// Create a variable so we can control and add stuff to the gin server.
	gws := gin.Default()
	gws.LoadHTMLGlob("html/*")

	// Webserver URL routes go here
	// TODO: Make this return an HTML file
	gws.GET("/", func(c *gin.Context) {
		// get the user's language preference
		prefLang := parseAcceptLanguage(c.GetHeader("Accept-Language"))
		indexLangFile := strings.ToLower(prefLang) + ".index.html"

		// return the index file
		c.HTML(http.StatusOK, indexLangFile, gin.H{})
	})

	// This returns the routes usable for NootBox web ui.
	gws.GET("/routes", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, gin.H{
			"message": "Hello! This is the NootBOX enrollment webserver!",
			"endpoints": gin.H{
				"Enroll a NootBOX": gin.H{
					"method":   "POST",
					"endpoint": "/api/v1/enroll/",
				},
			},
		})
	})

	gws.POST("/api/v1/enroll/", func(c *gin.Context) {
		// this variable temporarily stores the code the user has sent through the GWS.
		var code int

		// write the given code to the "code" variable.
		if err := c.BindJSON(&code); err != nil {
			fmt.Printf("Failed to write user-given code to variable. REASON: Unknown. ERROR: %s\n", err)
			c.IndentedJSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: " + err.Error(),
			})
			return
		}

		// send a post request to NootWEB, to register this box.
		postURL := "https://api.noot.site/verify"                                      // the url to send the post req to
		jsonStr := fmt.Sprintf("{\"code\": \"%d\"}", code)                             // create a var to hold the JSON we will send
		req, err := http.NewRequest("POST", postURL, bytes.NewBuffer([]byte(jsonStr))) // create the request here.
		req.Header.Set("Content-Type", "application/json")                             // tell the server we are sending JSON
		client := &http.Client{}                                                       // initiate http client
		resp, err := client.Do(req)                                                    // send the request we just built
		if err != nil {
			fmt.Printf("Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: %s\n", err)
			c.IndentedJSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: " + err.Error(),
			})
			return
		}

		defer func(Body io.ReadCloser) { // close our connection once data is sent.
			err := Body.Close()
			if err != nil {
				fmt.Printf("Failed to send box code to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s\n", err)
				c.IndentedJSON(http.StatusInternalServerError, gin.H{
					"message": "Failed to send box code to NootWeb. REASON: UNKNOWN. ERROR: " + err.Error(),
				})
				return
			}
		}(resp.Body)

		body, _ := io.ReadAll(resp.Body) // body of the communication with NootWEB
		fmt.Println("NootWEB responded with: " + string(body))

		fmt.Println("Attempting to parse what NootWeb responded with.")
		nwStatusCodeOK := resp.StatusCode >= 200 && resp.StatusCode < 300
		if nwStatusCodeOK { // there is no error in the response (LETS FUCKING GOOOOO :33)
			// parse and get the BoxID and BoxToken.
			var nwRespJson map[string]interface{}
			err = json.Unmarshal([]byte(string(body)), &nwRespJson)
			if err != nil {
				fmt.Printf("Failed to parse NootWeb response. REASON: UNKNOWN. ERROR: %s\n", err)
				c.IndentedJSON(http.StatusInternalServerError, gin.H{
					"message": "Failed to parse the NootWeb server's response.",
				})
				return
			}

			// write these to file
			NBBoxInfoFile, err := os.OpenFile("boxInfo.noot", os.O_RDWR|os.O_CREATE, 0666)
			if err != nil {
				fmt.Printf("Failed to create or open the \"boxInfo.noot\" file. REASON: Unknown. ERROR: %s\n", err)
				c.IndentedJSON(http.StatusInternalServerError, gin.H{
					"message": "Failed to create or open the \"boxInfo.noot\" file. REASON: Unknown. ERROR: " + err.Error(),
				})
				return
			}

			jsonToWrite := fmt.Sprintf(`{"boxid": "%s", "boxtoken": "%s"}`, nwRespJson["id"].(string), nwRespJson["token"].(string))
			_, err = NBBoxInfoFile.WriteString(jsonToWrite)
			if err != nil {
				c.IndentedJSON(http.StatusInternalServerError, gin.H{
					"message": "Failed to write to the \"boxInfo.noot\" file. REASON: Unknown. ERROR: " + err.Error(),
				})
				return
			}
			c.IndentedJSON(http.StatusCreated, gin.H{
				"message": "NootBox created! The details have been written to local storage. " +
					"Just restart the application, and this box will connect!",
			})
			return

		} else { // there was a non 2** status code :((
			var nwRepErr map[string]interface{}
			err = json.Unmarshal([]byte(string(body)), &nwRepErr)
			if err != nil {
				c.IndentedJSON(http.StatusInternalServerError, gin.H{
					"message": "Failed to parse what NootWeb responded with. REASON: Unknown. ERROR: " + err.Error(),
				})
				return
			}
			nwRepErrMsg := nwRepErr["error"].(string)
			if nwRepErrMsg == "Invalid code" {
				c.IndentedJSON(http.StatusUnauthorized, gin.H{
					"message": "It seems like the code you entered is invalid. Please try again.",
				})
			} else {
				c.IndentedJSON(http.StatusInternalServerError, gin.H{
					"message": "NootWeb could not enroll this NootBox. REASON: UNKNOWN. ERROR: " + string(nwRepErrMsg),
				})
				return
			}
		}
	})

	// run the webserver
	fmt.Println("Gin webserver running on http://0.0.0.0:17002")
	err := gws.Run("0.0.0.0:17002") // this runs gws publicly on devices private IP and port 17002
	if err != nil {
		fmt.Printf("Failed to start the Gin enrollment webserver. REASON: Webserver startup failed.. ERROR: %s\n", err)
		return
	}
}

func asteriskExceptLastFive(input string) string {
	// THIS FUNCTION WAS GENERATED USING CHAT-GPT

	// Get the last 5 characters of the input string
	lastFive := input[len(input)-5:]

	// Create a string of asterisks with the length of the input string except the last 5 characters
	asterisks := strings.Repeat("*", len(input)-5)

	// Combine the asterisks and the last five characters to create the hidden string
	hiddenString := asterisks + lastFive

	// Return the string
	return hiddenString
}

// parseAcceptLanguage parses the "Accept-Language" header to get the preferred language.
func parseAcceptLanguage(acceptLanguage string) string {
	// THIS FUNCTION WAS GENERATED USING CHAT-GPT
	// Split the header by commas to separate language preferences
	languages := strings.Split(acceptLanguage, ",")

	// Iterate through the language preferences and extract the language code
	for _, language := range languages {
		// Split each preference by semicolon to get the language code and quality
		parts := strings.Split(strings.TrimSpace(language), ";")

		// The language code is the first part (e.g., "en-US" in "en-US;q=0.8")
		languageCode := parts[0]

		// Remove any additional parameters (e.g., quality) and return the language code
		return languageCode[:2]
	}

	// Return a default language if no preference is found
	return "en" // Default to English if no preference is found
}

func setupWifi() {
	// Configure SPI for 8Mhz, Mode 0, MSB First
	spi.Configure(machine.SPIConfig{
		Frequency: 8 * 1e6,
		SDO:       machine.NINA_SDO,
		SDI:       machine.NINA_SDI,
		SCK:       machine.NINA_SCK,
	})

	adaptor = wifinina.New(spi,
		machine.NINA_CS,
		machine.NINA_ACK,
		machine.NINA_GPIO0,
		machine.NINA_RESETN)
	adaptor.Configure()
}

// Wait for the serial console to become available
func waitSerial() {
	for !machine.Serial.DTR() {
		time.Sleep(100 * time.Millisecond)
	}
}

// Connect to a WiFi access point
func connectToAP() {
	fmt.Printf("Connecting to %s...\n", wifiSSID)

	conn = wifi.Connect(adaptor, wifiSSID, wifiPassword)
	for conn == nil {
		fmt.Println("Connection failed. Retrying...")
		time.Sleep(2 * time.Second)
		conn = wifi.Connect(adaptor, wifiSSID, wifiPassword)
	}
}

// Display the device's IP address
func displayIP() {
	ip, err := conn.LocalIP()
	if err != nil {
		fmt.Printf("Failed to obtain IP address: %v\n", err)
		return
	}
	fmt.Printf("Connected to WiFi. IP address: %v\n", ip)
}
