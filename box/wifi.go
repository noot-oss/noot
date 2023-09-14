package main

import (
	"machine"
	"time"
	"tinygo.org/x/drivers/wifinina"
)

// Wait for user to open serial console
func waitSerialWifi() {
	for !machine.Serial.DTR() {
		time.Sleep(100 * time.Millisecond)
	}
}

func displayIP(adaptor *wifinina.Device) {
	ip, _, _, err := adaptor.GetIP()
	for ; err != nil; ip, _, _, err = adaptor.GetIP() {
		wifiMessage(err.Error())
		time.Sleep(1 * time.Second)
	}
	wifiMessage("IP address: " + ip.String())
}

func wifiMessage(msg string) {
	println(msg, "\r")
}
