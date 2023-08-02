package main

import (
	"fmt"
	"github.com/gin-gonic/gin"   // For creating the enrollment web server
	log "github.com/sirupsen/logrus" // For logging
	"os"
)

func main() {
	// initiate the logging library
	// set it so the logger only outputs to stdout instead of the default stderr
	log.SetOutput(os.Stdout)
	log.SetLevel(log.InfoLevel)
	log.Info("Logging initiated!")

	/*// This chunk of code goes to the url below and requests the message to print when the nootBOX starts up

		resp, err := http.Get("https://msgsrvnoot.fluffywolff.repl.co/box/startupmessage/ml")

		// if there is an error connecting to get the startup message, then say there's an error and use the one built in
		if err != nil {
			// error log goes here or smth
		}

		// This closes the connection once it completes.
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil {
				log.Error("Failed to get startup message. REASON: Couldn't defer 'Body'. ERROR: %s", err)
			}
		}(resp.Body)

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}

		// if the response gave a status code of 200 (OK), then print what it gave us, otherwise? print the default message
		if resp.StatusCode == 200 {
			// print body of http GET request
			fmt.Println(string(body))
		} else {
			// if code was not 200 (OK), then use the default welcome banner thingy
			log.Error("Failed to get startup message. REASON: Status code was not '200'.")
			log.Info("Falling back to default startup message.")
	*/

	// Print this cool thing.
	fmt.Printf(`
 ███╗   ██╗ ██████╗  ██████╗ ████████╗██████╗  ██████╗ ██╗  ██╗
 ████╗  ██║██╔═══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔═══██╗╚██╗██╔╝
 ██╔██╗ ██║██║   ██║██║   ██║   ██║   ██████╔╝██║   ██║ ╚███╔╝ 
 ██║╚██╗██║██║   ██║██║   ██║   ██║   ██╔══██╗██║   ██║ ██╔██╗ 
 ██║ ╚████║╚██████╔╝╚██████╔╝   ██║   ██████╔╝╚██████╔╝██╔╝ ██╗
 ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
`)


	// Check if we have a BoxID stored.
	// TODO: Pull from storage location here

	// For now, lets use the example of us not having a box id.
	var BoxID = 0 // if a boxID doesn't exist, set it to 0.
	fmt.Printf("Your BoxID is %", BoxID) // TODO: fix the string format here.
	// No box id? Start enroll procedure with a small gin webserver that says your temporary code

	// Yes, there is a box id? Continue
	// Try to login
	// login failed? Start enroll procedure with gin webserver

}


// TODO: Explain this function w/ comments
func ginEnrollmentServer() {
	// Create a variable so we can control and add stuff to the gin server.
	gws := gin.Default()

	// Webserver URL routes go here
	// TODO: Make "/" path return a HTML file
	gws.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Привет!, Это Gin Webserver на ГоЛанг!!",
		})
	})


	// TODO: create an API route that enrolls a NootBox if the entered code on the "/" path is valid.



	// run the webserver
	err := gws.Run() // this runs gws on ip 0.0.0.0 and port 8080
	if err != nil {
		log.Error("Failed to start the Gin enrollment webserver. REASON: Webserver startup failed.. ERROR: %s", err)
		return
	}
}