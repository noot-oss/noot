package main

import (
	"fmt"
	"tinygo.org/x/drivers/net/http"
	"tinygo.org/x/drivers/wifinina"
)

func enrollServerMain(adaptor *wifinina.Device) error {
	http.UseDriver(adaptor) // create server on the wifi adaptor

	http.HandleFunc("/", root)
	http.HandleFunc("/api/v1/enroll", enrollV1)

	return http.ListenAndServe(":17002", nil)
}

func root(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, err := fmt.Fprint(w, `
<html>
	<head>
	    <title>NootBox HTTP Server</title>
	</head>
	<body>
		<h1>Heya! This is the NootBox HTTP Server!</h1>
		<p>Currently running on IP Address `+r.Host+`.</p>

		<br></br><br></br>
		<h2>Debug information</h2>
		<p>Your local IP Address: `+r.RemoteAddr+`</p>
		<p>Request Method: `+r.Method+`</p>
		<p>Request URL: `+r.URL.String()+`</p>
		<p>Request Protocol: `+r.Proto+`</p>
	</body>
</html>
    `)
	if err != nil {
		println("Error writing response: " + err.Error())
		return
	}
}

func enrollV1(w http.ResponseWriter, r *http.Request) {
	// TODO: FINISH THIS ENDPOINT.
	err := r.ParseForm()
	if err != nil {
		println("Error parsing form: " + err.Error())
		return
	}
	if r.Method == "POST" {
		// send enroll request to nootweb
	} else { // Method was not POST.
		// Change status code
		w.WriteHeader(http.StatusMethodNotAllowed)
		// Add response body.
		_, err := fmt.Fprintf(w, "This endpoint only accepts POST requests.")
		if err != nil {
			println("Error writing response: " + err.Error())
			return
		}
		return
	}

	w.Header().Set(`Content-Type`, `application/json`)
	_, err = fmt.Fprintf(w, `{"msg": "Hello, World!"}`)
	if err != nil {
		println("Error writing response: " + err.Error())
		return
	}
}
