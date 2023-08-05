package main

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"   // For creating the enrollment web server
	log "github.com/sirupsen/logrus" // For logging
	"io"
	"net/http"
)

func main() {
	// initiate the logging library
	log.SetLevel(log.InfoLevel)
	log.Info("Logging initiated!")

	// Is this code running in production or development mode?
	prod := false
	version := "V0.0.1"

	if prod {
		log.Infof("This is NootBOX, PROD_%s.", version)
		gin.SetMode(gin.ReleaseMode)
	} else {
		log.Warning("WARNING: THIS CODE IS RUNNING IN DEVELOPMENT MODE!!!")
		log.Infof("This is NootBOX, DEV_%s.", version)
	}

	// TODO: fix the annoying thing where gin says "you trusted all proxies meeeeeeeehhhhhhhhhhhhhh". make it only trust all in dev.


	// Print the text logo
	fmt.Printf(`|==================Your NootBOX is starting up!==================|
| ███╗   ██╗ ██████╗  ██████╗ ████████╗██████╗  ██████╗ ██╗  ██╗ |
| ████╗  ██║██╔═══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔═══██╗╚██╗██╔╝ |
| ██╔██╗ ██║██║   ██║██║   ██║   ██║   ██████╔╝██║   ██║ ╚███╔╝  |
| ██║╚██╗██║██║   ██║██║   ██║   ██║   ██╔══██╗██║   ██║ ██╔██╗  |
| ██║ ╚████║╚██████╔╝╚██████╔╝   ██║   ██████╔╝╚██████╔╝██╔╝ ██╗ |
| ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ |
|==================Your NootBOX is starting up!==================|
`)



	// Check if we have a BoxID stored.
	// TODO: Pull BoxID from storage location here
	// For now, lets use the example of us not having a box id.
	var BoxID = 0 // if a boxID doesn't exist, set it to 0.
	if BoxID == 0 { // if the boxID doesn't exist:
		log.Info("BoxID is equal to 0.")
		log.Info("This NootBOX does not seem to be enrolled... Starting the enrollment webserver!")
		// start enrollment server.
		ginEnrollmentServer()
	} else {
		// TODO: Here, you want to see if the box ID is valid, if so, attempt to login and broadcast data.
	}

	// No box id? Start enroll procedure with a small gin webserver that says your temporary code

	// Yes, there is a box id? Continue
	// Try to login
	// login failed? Start enroll procedure with gin webserver


}


// This function is used when you want to create a webserver for the user to enroll their box onto.
func ginEnrollmentServer() {
	// Create a variable so we can control and add stuff to the gin server.
	gws := gin.Default()

	// Webserver URL routes go here
	// TODO: Make this return a HTML file
	gws.GET("/", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, gin.H{
			"message": "Hello!, this is the webserver for NootBOX.",
		})
	})

	// TODO: edit this example to make it actually work.
	gws.POST("/api/enrollwithcode/", func(c *gin.Context) {
		// this variable temporarily stores the code the user has sent through the GWS.
		var code int

		// write the given code to the "code" variable.
		if err := c.BindJSON(&code); err != nil {
			log.Error("Failed to write user-given code to variable. REASON: Unknown. ERROR: %s", err)
			return
		}

		// send a post request to NootWEB, to register this box.
		postURL := "https://noot.site/api/box/enrollwithcode"
		var jsonStr = []byte(`{"boxcode": `+string(rune(code))+`}`) // create a var to hold the JSON
		req, err := http.NewRequest("POST", postURL, bytes.NewBuffer(jsonStr)) // create the request here.
		req.Header.Set("Content-Type", "application/json") // tell the server we are sending JSON

		client := &http.Client{} // initiate http client
		resp, err := client.Do(req) // do the request we build earlier in the function
		if err != nil {
			log.Error("Failed to send box code to NootWEB. REASON: Couldn't initiate http.Client. ERROR: %s", err)
			return
		}

		defer func(Body io.ReadCloser) { // close our connection once data is sent.
			err := Body.Close()
			if err != nil {
				log.Error("Failed to send box code to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s", err)
			}
		}(resp.Body)
		// body, _ := io.ReadAll(resp.Body) // body of the communication with NootWEB

		// say on the GWS that the box has been registered.
		c.IndentedJSON(http.StatusCreated, gin.H{
			"message": "This NootBOX has been registered as box id \"nb-ru-8302-2746\"!",
			"yoursentcode": code,
		})
	})


	// run the webserver
	err := gws.Run("0.0.0.0:3000") // this runs gws on ip 0.0.0.0 and port 3000
	if err != nil {
		log.Error("Failed to start the Gin enrollment webserver. REASON: Webserver startup failed.. ERROR: %s", err)
		return
	}
}