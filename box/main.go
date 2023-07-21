package main

import (
	"fmt"
	log "github.com/sirupsen/logrus" // for logging
	"os"
)

func main() {
	// initiate the logging library
	// set it so the logger only outputs to stdout instead of the default stderr
	log.SetOutput(os.Stdout)
	log.SetLevel(log.InfoLevel)
	log.Info("Logging initiated!")


	// THIS BIT IS COMMENTED OUT FOR A POTENTIAL FUTURE FEATURE.

	/*// This chunk of code goes to the url below and requests the message to print when the nootBOX starts up
	// The message could be an ascii art, just some text, possibly an important update or something silly, like a
	// greeting that says "Happy Christmas" around december.

	resp, err := http.Get("https://msgsrvnoot.fluffywolff.repl.co/box/startupmessage/ml")

	// if there is an error connecting to get the startup message, then say there's an error and use the one built in
	if err != nil {
		// log.Error("Failed to get startup message. REASON: Connection failed. ERROR: %s", err)
		log.Info("Falling back to default startup message.")

		fmt.Printf(`
 ███╗   ██╗ ██████╗  ██████╗ ████████╗██████╗  ██████╗ ██╗  ██╗
 ████╗  ██║██╔═══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔═══██╗╚██╗██╔╝
 ██╔██╗ ██║██║   ██║██║   ██║   ██║   ██████╔╝██║   ██║ ╚███╔╝ 
 ██║╚██╗██║██║   ██║██║   ██║   ██║   ██╔══██╗██║   ██║ ██╔██╗ 
 ██║ ╚████║╚██████╔╝╚██████╔╝   ██║   ██████╔╝╚██████╔╝██╔╝ ██╗
 ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
`)
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
	// No box id? start enroll procedure with a small gin webserver that says your temporary code
	// Yes, there is a box id? Continue
	// Try to login
	// login failed? start enroll procedure with gin webserver



	}

// }
