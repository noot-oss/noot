package main

import (
	"machine"
	"time"
	"tinygo.org/x/drivers/wifinina"
)


func setupWifi(adaptor *wifinina.Device) {
	// Configure SPI for 8Mhz, Mode 0, MSB First
	spi := machine.NINA_SPI
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

// Wait for user to open serial console
func waitSerialWifi() {
	for !machine.Serial.DTR() {
		time.Sleep(100 * time.Millisecond)
	}
}

const retriesBeforeFailureWifi = 3

// Connect to access point
func connectToAP(ssid string, pass string, adaptor *wifinina.Device) {
	time.Sleep(2 * time.Second)
	var err error
	for i := 0; i < retriesBeforeFailureWifi; i++ {
		println("Connecting to " + ssid)
		err = adaptor.ConnectToAccessPoint(ssid, pass, 10*time.Second)
		if err == nil {
			ip, _, _, _ := adaptor.GetIP()
			println("Connected to " + ssid + ".\nYour IP address is " + ip.String() + ".")
			return
		}
	}

	// error connecting to AP
	failMessageWifi(err.Error())
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

func failMessageWifi(msg string) {
	for {
		println(msg)
		time.Sleep(1 * time.Second)
	}
}