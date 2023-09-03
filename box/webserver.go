package main

import (
	"fmt"
	"tinygo.org/x/drivers/net/http"
	"tinygo.org/x/drivers/wifinina"
	"machine"
)


func enrollServerMain(adaptor *wifinina.Device) error {
	http.UseDriver(adaptor)

	http.HandleFunc("/", root)
	http.HandleFunc("/api/v1/enroll", enroll)

	return http.ListenAndServe(":17002", nil)
}


func root(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	// TODO: EDIT BELOW MESSAGE.
	_, err := fmt.Fprint(w, `
<html>
	<head>
	    <title>TinyGo HTTP Server</title>
	</head>
	<body>
		<h1>HELLLOOOOOOOOO, ЭТО БЛЯТЬ НОУТБОКС ВЕБСЕРВЕР!!!!!!!!!!!!!!111</h1>
	</body>
</html>
    `)
	if err != nil {
		println("Error writing response: " + err.Error())
		return
	}
}

func enroll(w http.ResponseWriter, r *http.Request) {
	// TODO: FINISH THIS ENDPOINT.
	err := r.ParseForm()
	if err != nil {
		println("Error parsing form: " + err.Error())
		return
	}
	if r.Method == "POST" {


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