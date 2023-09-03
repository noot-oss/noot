package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"tinygo.org/x/drivers/net/http"
)

// TODO: Make a function to send warnings/alerts to NootWeb
func sendAlert() {}


func sendMeasurements(co2Val int32, tempVal float32, humVal int32, BoxToken string) {
	// send a post request to NootWEB, that will submit the recorded data.
	println("Attempting to send recorded measurements to NootWEB...")
	postURL := "https://api.noot.site/push" // the url to send the post req to
	jsonStr := fmt.Sprintf(
		"{\"co2\": %d, \"temp\":%d, \"humidity\": %d, \"token\": \"%s\"}",
		co2Val, tempVal, humVal, BoxToken,
	) // create a var to hold the JSON we will send
	req, err := http.Post(postURL, "application/json", bytes.NewBuffer([]byte(jsonStr)))
	println("Status code of the request: " + string(rune(req.StatusCode)))
	if err != nil {
		println("Failed to send recorded measurements to NootWEB. REASON: UNKNOWN. ERROR: %s", err)
		println("These latest measurements will NOT be sent to NootWEB... skipping...")
		return
	}

	body, _ := io.ReadAll(req.Body) // body of the communication with NootWEB
	println("NootWEB responded with: " + string(body))

	// parse the body of the communication with NootWEB and get the "success" json value
	var bodyJsonData map[string]interface{}
	_ = json.Unmarshal([]byte(string(body)), &bodyJsonData)
	success := bodyJsonData["success"].(bool)
	if success { // it worked!! (yay :33)
		// if success, log that the interaction was a success with below statement
		println("Sent recorded measurements to NootWEB. Recorded values were CO2: " +
			string(rune(co2Val)) + ", Temperature: " + string(rune(tempVal)) + ", Humidity: " + string(rune(humVal)) + "." +
			" BoxToken: " + asteriskExceptLastFive(BoxToken) + ".",
		)
	} else { // it didn't work :(
		// if failed, log that the interaction failed with below statement
		println("Failed to send recorded measurements to NootWEB. REASON: NootWEB replied with \"false\" to the \"success\" JSON variable. ERROR: %s", err)
		println("These measurements will NOT be sent to NootWEB... skipping...")

	}

	defer func(Body io.ReadCloser) { // close our connection once we are done with it.
		err := Body.Close()
		if err != nil {
			println("Failed to send recorded measurements to NootWEB. REASON: Couldn't defer 'Body'. ERROR: %s", err)
			return
		}
	}(req.Body)
}