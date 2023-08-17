package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"       // For creating the enrollment web server
	log "github.com/sirupsen/logrus" // For logging
	"io"
	"net/http"
	"os"
	"strings"
)

func main() {
	// IMPORTANT CONSTANT VARIABLES. CHECK THESE BEFORE EVERY COMMIT.
	PROD := false
	VERSION := "V0.0.1" // this stays at 0.0.1 until production release v1.

	// initiate the logging
	logFile, err := os.OpenFile("NootBOX_logfile.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Failed to create or open the logfile. REASON: Unknown. ERROR: %s", err)
		fmt.Printf("Failed to create or open the logfile. REASON: Unknown. ERROR: %s\n", err)
		return
	}

	// set the logging output to a file.
	log.SetOutput(logFile)
	log.Info("==========================================================================")
	log.Info("NootBOX application has started.")
	log.Info("Set the logging output to a logfile.")
	log.SetLevel(log.InfoLevel)
	log.Info("Logging initiated!")

	// Modify some parts of the code accordingly if it is running in production or development mode
	if PROD { // running in prod
		log.Infof("This is NootBOX, PROD_%s.", VERSION)
		gin.SetMode(gin.ReleaseMode)
	} else { // running in dev
		log.Warning("WARNING: THIS CODE IS RUNNING IN DEVELOPMENT MODE!!!")
		log.Infof("This is NootBOX, DEV_%s.", VERSION)
	}

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
	log.Info("Printing text logo")

	// Check if we have a BoxID stored.
	// TODO: Pull BoxID from a file here
	// load box id file into memory

	var BoxID string // create var so we can acc access it after the below function.

	BoxIDFile, err := os.Open("./NootBOXID") // Likely only work on linux, however that is the only supported platform
	if err != nil { // if the file likely doesn't exist
		log.Warnf("Failed to open the Box ID storage file, Assuming BoxID = \"0\". REASON: Unknown. ERROR: %s", err)
		BoxID = "0"
	} else { // if the file exists
		// read first line of the BoxID file
		scanner := bufio.NewScanner(BoxIDFile)
		for scanner.Scan() {
			fmt.Println(scanner.Text())
			BoxID = scanner.Text() // pull the BoxID
		}
		log.Infof("BoxID appears to be \"%s\".", BoxID)

		// close file
		defer func(BoxIDFile *os.File) {
			err := BoxIDFile.Close()
			if err != nil {
				log.Errorf("Failed to close the Box ID storage file, Assuming BoxID = \"%s\". REASON: Unknown. ERROR: %s", BoxID, err)
			}
		}(BoxIDFile)
	}

	if BoxID == "0" { // if the boxID didn't exist:
		log.Info("This NootBOX does not seem to be enrolled.")
		log.Info("Starting the enrollment webserver.")
		ginEnrollmentServer()
	} else {
		// Yes, there is already a box id.
		// TODO: Here, you want to see if the box ID is valid, if so, attempt to login and broadcast data.
	}

	// No box id? Start enroll procedure with a small gin webserver that says your temporary code


	// Try to login
	// login failed? Start enroll procedure with gin webserver

	// login success? continue
}


// TODO: Make a function to send warnings/alerts to NootWeb NOTE: WAIT FOR ENDPOINT TO BE CREATED.
func sendAlert() {}


func sendMeasurements(co2Val int, tempVal int, humVal int, BoxToken string) {
	// send a post request to NootWEB, that will submit the recorded data.
	log.Info("Attempting to send recorded measurements to NootWEB...")
	postURL := "https://api.noot.site/push" // the url to send the post req to
	jsonStr := fmt.Sprintf(
		"{\"co2\": %d, \"temp\":%d, \"humidity\": %d, \"token\": \"%s\"}",
		co2Val, tempVal, humVal, BoxToken,
	) // create a var to hold the JSON we will send
	req, err := http.NewRequest("POST", postURL, bytes.NewBuffer([]byte(jsonStr))) // create the request here.
	req.Header.Set("Content-Type", "application/json") // tell the server we are sending JSON
	client := &http.Client{} // initiate http client
	resp, err := client.Do(req) // send the request we just built
	if err != nil {
		log.Errorf("Failed to send recorded measurements to NootWEB. REASON: UNKNOWN. ERROR: %s", err)
		log.Warnf("These measurements will NOT be sent to NootWEB... skipping...")
		return
	}

	defer func(Body io.ReadCloser) { // close our connection once data is sent.
		err := Body.Close()
		if err != nil {
			log.Errorf("Failed to send recorded measurements to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s", err)
		}
	}(resp.Body)

	body, _ := io.ReadAll(resp.Body) // body of the communication with NootWEB
	log.Info("NootWEB responded with: " + string(body))

	// parse the body of the communication with NootWEB and get the "success" json value
	var bodyJsonData map[string]interface{}
	_ = json.Unmarshal([]byte(string(body)), &bodyJsonData)
	success := bodyJsonData["success"].(bool)
	if success { // it worked!! (yay :33)
		// if success, log that the interaction was a success with below statement
		log.Info("Sent recorded measurements to NootWEB. Recorded values were CO2: " +
			string(rune(co2Val)) + ", Temperature: " + string(rune(tempVal)) + ", Humidity: " + string(rune(humVal)) + "." +
			" BoxToken: " + asteriskExceptLastFive(BoxToken) + ".",
		)
	} else { // it didn't work :(
		// if failed, log that the interaction failed with below statement
		log.Errorf("Failed to send recorded measurements to NootWEB. REASON: NootWEB replied with \"false\" to the \"success\" JSON variable. ERROR: %s", err)
		log.Warnf("These measurements will NOT be sent to NootWEB... skipping...")

	}
}


// TODO: Make a function to take measurements from the device sensors
func takeMeasurements() {}


// This function is used when you want to create a webserver for the user to enroll their box onto.
func ginEnrollmentServer() {
	// Create a variable so we can control and add stuff to the gin server.
	gws := gin.Default()

	// Webserver URL routes go here
	// TODO: Make this return a HTML file
	gws.GET("/", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, gin.H{
			"message": "Hello!, this is the webserver for NootBOX.",
			"endpoints": gin.H{
				"Enroll a NootBOX": gin.H{
					"method": "POST",
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
			log.Fatalf("Failed to write user-given code to variable. REASON: Unknown. ERROR: %s", err)
			c.IndentedJSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: " + err.Error(),
				"error": 1,
			})
		}

		// send a post request to NootWEB, to register this box.
		postURL := "https://api.noot.site/verify" // the url to send the post req to
		jsonStr := fmt.Sprintf("{\"code\": \"%d\"}", code) // create a var to hold the JSON we will send
		req, err := http.NewRequest("POST", postURL, bytes.NewBuffer([]byte(jsonStr))) // create the request here.
		req.Header.Set("Content-Type", "application/json") // tell the server we are sending JSON
		client := &http.Client{} // initiate http client
		resp, err := client.Do(req) // send the request we just built
		if err != nil {
			log.Error("Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: %s", err)
			c.IndentedJSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to send box code to NootWEB. REASON: UNKNOWN. ERROR: " + err.Error(),
				"error": 1,
			})
		}

		defer func(Body io.ReadCloser) { // close our connection once data is sent.
			err := Body.Close()
			if err != nil {
				log.Errorf("Failed to send box code to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s", err)
			}
		}(resp.Body)


		// TODO: Parse the NootWEB communication and see if it was a success, if so, send the below indented JSON, otherwise, send something telling the user the interaction has failed.
		body, _ := io.ReadAll(resp.Body) // body of the communication with NootWEB
		log.Info("NootWEB responded with: " + string(body))
		fmt.Println(string(body)) // Debug: print the body of the communication with NootWEB
		//var bodyJson map[string]any
		//err = json.Unmarshal([]byte(body), &bodyJson)
		//if err != nil {
		//	log.Errorf("Failed to send box code to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s", err)
		//}

		// TODO: edit the below response to the NBFrontend to be better or smth idfk.

		// say on the GWS that the box has been registered.
		//TODO: change boxid value in below json
		c.IndentedJSON(http.StatusCreated, gin.H{
			"message":  "This NootBOX has been registered as box id: \"nb-ru-8302-2746\"!",
			"sentCode": code,
			"error":    0, // there is no error, hence the number 0.
		})
	})

	// run the webserver
	err := gws.Run("0.0.0.0:17002") // this runs gws publicly on devices private ip and port 17002
	if err != nil {
		log.Fatalf("Failed to start the Gin enrollment webserver. REASON: Webserver startup failed.. ERROR: %s", err)
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

	return hiddenString
}
