package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"machine" // This errors on ALL PLATFORMS. You can ignore it. This is due to tinygo not supporting the "machine" package on non-microcontroller platforms.
	"os"
	"time"

	"tinygo.org/x/drivers/scd4x"    // Tinygo driver for the SCD4X sensor.
	"tinygo.org/x/drivers/wifinina" // Tinygo internet driver interaction.
)

// TODO: COMPLETELY CHANGE ALL LOGGING TO HAVE BETTER SYNTAX, TO EASILY UNDERSTAND WHAT IS SENDING WHAT.
// TODO: CORRECT ALL ERROR MESSAGES TO BE MORE SIMPLISTIC AND EASY TO UNDERSTAND.
// TODO: WHERE NECESSARY, SEND ALERTS TO NOOTWEB.
// TODO: MAKE SCRIPT STORE IMPORTANT VALUES IN EEPROM.
// TODO: CHANGE GIN TO https://github.com/tinygo-org/drivers/blob/v0.25.0/examples/wifinina/webserver/main.go
// TODO: HASH THE STORED BOXTOKEN, SO IT ISN'T STORED IN PLAINTEXT.
// TODO: DETECT IF RUNNING ON x64_86 OR ARM.
// TODO: REMOVE EVERYTHING THAT IS UNUSED (After through testing).
// TODO: Add average noise level measurement.

// IMPORTANT VARIABLES USED THROUGHOUT THIS CODE

var BoxID string        // ID of the box
var BoxToken string     // Token of the box
var wifiSSID string     // Name of the Wi-Fi network
var wifiPassword string // Password of the Wi-Fi network
var scd *scd4x.Device   // SCD4X sensor

var spi = machine.NINA_SPI   // These are the default pins for the Arduino Nano33 IoT.
var adaptor *wifinina.Device // This is the ESP chip that has the WIFININA firmware flashed on it

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

// Modules for Wi-Fi setup
func failMessageWifi(msg string) {
	for {
		println(msg)
		time.Sleep(1 * time.Second)
	}
}

func connectToAP() {
	time.Sleep(2 * time.Second)
	var err error
	retriesBeforeFailureWifi := 3
	for i := 0; i < retriesBeforeFailureWifi; i++ {
		println("Connecting to " + wifiSSID)
		err = adaptor.ConnectToAccessPoint(wifiSSID, wifiPassword, 10*time.Second)
		if err == nil {
			println("Connected.")
			return
		}
	}
	// error connecting to AP
	failMessageWifi(err.Error())
}

func main() {
	println("WIFI:  >>Waiting for serial connection...")
	waitSerialWifi()
	// IMPORTANT CONSTANT VARIABLES. CHECK THESE BEFORE EVERY COMMIT.
	VERSION := "V0.2.8"
	println("Application start at " + time.Now().String() + ".")
	println("Waiting 3 seconds...")
	time.Sleep(3 * time.Second)

	// TODO: DEBUG
	println("for loop goes: \n1: write, 2: read, 3: erase")
	for {
		writeAllStorage("This is test: " + time.Now().String())
		println(readAllStorage())
		eraseAllBlocks()
		println(readAllStorage())
		time.Sleep(500 * time.Millisecond)
	}

	println("FLSH:  Storage information: ")
	storageInfo()

	println("WIFI:  Initialising the Wi-Fi module...")
	println("WIFI:  >Setting up the Wi-Fi module...")
	setupWifi()

	// TODO: LOGGING TO FILE/NOOTWEB
	// initiate the logging
	//logFile, err := os.OpenFile("NootBOX_logfile.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	//if err != nil {
	//	fmt.Printf("Failed to create or open the logfile. REASON: Unknown. ERROR: %s\n", err)
	//	return
	//}

	println("The NootBox application has started.")

	println("This is NootBOX, Version %s.\n", VERSION)
	println("Starting up...")
	println("Initializing the device...")
	machine.InitADC()

	// println("Initializing the SCD4X sensor...")

	//TODO: see if this commented code is necessary, delete after testing.
	//
	// i2cPort.Configure(i2c.I2CConfig{Frequency: 400000, SDA: machine., SCL: machine.SCL})})
	//i2c.Configure(machine.I2CConfig{})
	//if err := sensor.Configure(); err != nil { // reset sensor.
	//	println("Failed to configure SCD4x: ", err) // whoopsie, we did a fucky wucky :33
	//	return
	//}

	println("Attempting to connect to the internet...")
	// Connect to the internet with Wi-Fi.
	// TODO: PULL CREDS FROM STORAGE HERE. IF NONE, USE THE VALUES CURRENTLY IN THE VARIABLES.
	// pulling all of storage
	storedData := readAllStorage()
	if storedData == "" { // TODO: change to what an empty value would be
		// if empty, use the values from current variables
		println("WIFI:  >>>Connecting to \"" + wifiSSID + "\"...")
		connectToAP()
		println("WIFI:  >>>>Displaying IP address...")
		displayIP(adaptor)
	} else {
		// not empty, use these variables.
		// parse the data to get ssid and password
		// TODO: find what the data will look like and parse it.

		wifiSSID = ""
		wifiPassword = ""

		// connect
		println("WIFI:  >>>Connecting to \"" + wifiSSID + "\"...")
		connectToAP()

		println("WIFI:  >>>>Displaying IP address...")
		displayIP(adaptor)
	}

	// TODO: Change this to use the correct method of reading data.
	// Check if already a nootbox
	println("Checking if box information already exists...")

	// Check if we have a BoxID stored.
	BoxIDFile, err := os.Open("boxInfo.noot")
	if err != nil { // if the file doesn't exist or won't open for some reason, assume un-enrolled.
		println("Failed to open the Box ID storage file, Assuming BoxID = \"0\". REASON: Unknown. ERROR: %s\n", err)
		BoxID = "0"
	} else {
		// if the file exists
		var fileData string                    // var for file content
		scanner := bufio.NewScanner(BoxIDFile) // read first line of the file
		for scanner.Scan() {
			println(scanner.Text())   // DEBUG: print the line from file
			fileData = scanner.Text() // pull the BoxID
		}

		// parse boxID from fileText
		var fileDataJson map[string]interface{}
		err := json.Unmarshal([]byte(fileData), &fileDataJson)
		if err != nil {
			println("Failed to parse the Box ID storage file. REASON: Unknown. ERROR: %s\n", err)
			return
		}

		BoxID, ok := fileDataJson["boxid"].(string)
		if !ok {
			println("Failed to parse the Box ID storage file. REASON: Unknown. ERROR: %s\n", err)
			return
		}
		BoxToken, ok := fileDataJson["boxtoken"].(string)
		if !ok {
			println("Failed to parse the Box ID storage file. REASON: Unknown. ERROR: %s\n", err)
			return
		}

		// log the boxID
		println("BoxID appears to be \"%s\".\n", BoxID)
		println("BoxToken appears to be \"%s\".\n", asteriskExceptLastFive(BoxToken))

		// close file
		defer func(BoxIDFile *os.File) {
			err := BoxIDFile.Close()
			if err != nil {
				fmt.Printf("Failed to close the Box ID storage file, Assuming BoxID = \"%s\". REASON: Unknown. ERROR: %s\n", BoxID, err)
			}
		}(BoxIDFile)

	}

	if BoxID == "0" { // if the boxID didn't exist:
		println("This NootBOX does not seem to be enrolled.")
		println("Starting the enrollment webserver.")
		err := enrollServerMain(adaptor)
		if err != nil {
			println("Failed to start the enrollment webserver: " + err.Error())
			return
		}
	} else {
		// Yes, there is already a box id.
		// Start the broadcast data function loop
		println("This NootBOX appears to be enrolled.")
		println("Starting the broadcast data function loop.")
		broadcastDataLoop(BoxToken)
	}

}

// TODO: Power optimise this at some point (maybe) (probably not) (but maybe) БЛЯТЬ!!!!!!!!!!!
func broadcastDataLoop(BoxToken string) {
	// TODO: Add error corrections to this function
	// TODO: Add logging to this function

	// create a loop that will run forever
	for {
		// Trigger a measurement
		// THE BELOW MEASUREMENT TAKES ABOUT 30 SECONDS TO COMPLETE.
		if err := scd.StartLowPowerPeriodicMeasurement(); err != nil {
			println("Failed to start measurement: ", err)
			return
		}

		// Wait for the measurement to complete
		time.Sleep(30 * time.Second)
		// Below function loops forever until measurements are ready,
		//this avoids missing a measurement due to it not being ready in time.
		for {
			ready, err := scd.DataReady()
			if err != nil {
				println("Failed to read measurement readiness: ", err)
				return
			}
			if ready {
				break
			}
			time.Sleep(200 * time.Millisecond)
		}

		// Read the recorded values
		co2Val, err := scd.ReadCO2()
		if err != nil {
			println("Failed to read measurement: ", err)
			return
		}
		tempVal := scd.ReadTempC()
		if err != nil {
			println("Failed to read measurement: ", err)
			return
		}
		humVal, err := scd.ReadHumidity()
		if err != nil {
			println("Failed to read measurement: ", err)
			return
		}

		// Stop continuous measurement
		if err := scd.StopPeriodicMeasurement(); err != nil {
			println("Failed to stop measurement: ", err)
			return
		}

		// send data to noot nya~~
		sendMeasurements(co2Val, tempVal, humVal, BoxToken)
	}
}

// This function is used when you want to create a webserver for the user to enroll their box onto.
//func ginEnrollmentServer() {
//	// TODO: REDO GIN COMPLETELY.
//	gws := gin.Default()
//	gws.LoadHTMLGlob("html/*")
//
//	// Webserver URL routes go here
//	// TODO: Make this return an HTML file
//	gws.GET("/", func(c *gin.Context) {
//		// get the user's language preference
//		prefLang := parseAcceptLanguage(c.GetHeader("Accept-Language"))
//		indexLangFile := strings.ToLower(prefLang) + ".index.html"
//
//		// return the index file
//		c.HTML(http.StatusOK, indexLangFile, gin.H{})
//	})
//
//	// This returns the routes usable for NootBox web ui.
//	gws.GET("/routes", func(c *gin.Context) {
//		c.IndentedJSON(http.StatusOK, gin.H{
//			"message": "Hello! This is the NootBOX enrollment webserver!",
//			"endpoints": gin.H{
//				"Enroll a NootBOX": gin.H{
//					"method":   "POST",
//					"endpoint": "/api/v1/enroll/",
//				},
//			},
//		})
//	})
//
//	gws.POST("/api/v1/enroll/", func(c *gin.Context) {
//		// this variable temporarily stores the code the user has sent through the GWS.
//		var code int
//
//		// write the given code to the "code" variable.
//		if err := c.BindJSON(&code); err != nil {
//			fmt.Printf("Failed to write user-given code to variable. REASON: Unknown. ERROR: %s\n", err)
//			c.IndentedJSON(http.StatusInternalServerError, gin.H{
//				"message": "Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: " + err.Error(),
//			})
//			return
//		}
//
//		// send a post request to NootWEB, to register this box.
//		postURL := "https://api.noot.site/verify"                                      // the url to send the post req to
//		jsonStr := fmt.Sprintf("{\"code\": \"%d\"}", code)                             // create a var to hold the JSON we will send
//		req, err := http.NewRequest("POST", postURL, bytes.NewBuffer([]byte(jsonStr))) // create the request here.
//		req.Header.Set("Content-Type", "application/json")                             // tell the server we are sending JSON
//		client := &http.Client{}                                                       // initiate http client
//		resp, err := client.Do(req)                                                    // send the request we just built
//		if err != nil {
//			fmt.Printf("Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: %s\n", err)
//			c.IndentedJSON(http.StatusInternalServerError, gin.H{
//				"message": "Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: " + err.Error(),
//			})
//			return
//		}
//
//		defer func(Body io.ReadCloser) { // close our connection once data is sent.
//			err := Body.Close()
//			if err != nil {
//				fmt.Printf("Failed to send box code to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s\n", err)
//				c.IndentedJSON(http.StatusInternalServerError, gin.H{
//					"message": "Failed to send box code to NootWeb. REASON: UNKNOWN. ERROR: " + err.Error(),
//				})
//				return
//			}
//		}(resp.Body)
//
//		body, _ := io.ReadAll(resp.Body) // body of the communication with NootWEB
//		println("NootWEB responded with: " + string(body))
//
//		println("Attempting to parse what NootWeb responded with.")
//		nwStatusCodeOK := resp.StatusCode >= 200 && resp.StatusCode < 300
//		if nwStatusCodeOK { // there is no error in the response (LETS FUCKING GOOOOO :33)
//			// parse and get the BoxID and BoxToken.
//			var nwRespJson map[string]interface{}
//			err = json.Unmarshal([]byte(string(body)), &nwRespJson)
//			if err != nil {
//				fmt.Printf("Failed to parse NootWeb response. REASON: UNKNOWN. ERROR: %s\n", err)
//				c.IndentedJSON(http.StatusInternalServerError, gin.H{
//					"message": "Failed to parse the NootWeb server's response.",
//				})
//				return
//			}
//
//			// write these to file
//			NBBoxInfoFile, err := os.OpenFile("boxInfo.noot", os.O_RDWR|os.O_CREATE, 0666)
//			if err != nil {
//				fmt.Printf("Failed to create or open the \"boxInfo.noot\" file. REASON: Unknown. ERROR: %s\n", err)
//				c.IndentedJSON(http.StatusInternalServerError, gin.H{
//					"message": "Failed to create or open the \"boxInfo.noot\" file. REASON: Unknown. ERROR: " + err.Error(),
//				})
//				return
//			}
//
//			jsonToWrite := fmt.Sprintf(`{"boxid": "%s", "boxtoken": "%s"}`, nwRespJson["id"].(string), nwRespJson["token"].(string))
//			_, err = NBBoxInfoFile.WriteString(jsonToWrite)
//			if err != nil {
//				c.IndentedJSON(http.StatusInternalServerError, gin.H{
//					"message": "Failed to write to the \"boxInfo.noot\" file. REASON: Unknown. ERROR: " + err.Error(),
//				})
//				return
//			}
//			c.IndentedJSON(http.StatusCreated, gin.H{
//				"message": "NootBox created! The details have been written to local storage. " +
//					"Just restart the application, and this box will connect!",
//			})
//			return
//
//		} else { // there was a non 2** status code :((
//			var nwRepErr map[string]interface{}
//			err = json.Unmarshal([]byte(string(body)), &nwRepErr)
//			if err != nil {
//				c.IndentedJSON(http.StatusInternalServerError, gin.H{
//					"message": "Failed to parse what NootWeb responded with. REASON: Unknown. ERROR: " + err.Error(),
//				})
//				return
//			}
//			nwRepErrMsg := nwRepErr["error"].(string)
//			if nwRepErrMsg == "Invalid code" {
//				c.IndentedJSON(http.StatusUnauthorized, gin.H{
//					"message": "It seems like the code you entered is invalid. Please try again.",
//				})
//			} else {
//				c.IndentedJSON(http.StatusInternalServerError, gin.H{
//					"message": "NootWeb could not enroll this NootBox. REASON: UNKNOWN. ERROR: " + string(nwRepErrMsg),
//				})
//				return
//			}
//		}
//	})

// Run the webserver
//	println("Gin webserver running on http://0.0.0.0:17002")
//	err := gws.Run("0.0.0.0:17002") // this runs gws publicly on devices private IP and port 17002
//	if err != nil {
//		fmt.Printf("Failed to start the Gin enrollment webserver. REASON: Webserver startup failed.. ERROR: %s\n", err)
//		return
//	}
//}
