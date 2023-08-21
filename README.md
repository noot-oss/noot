# NootBOX/NootWEB/NootAPI.

---

### About Noot
Noot aims to be a simple way to record CO2, humidity and temperature with basic off-the-shelf components.

The data collected from your NootBox is then sent to our server and is relayed back to you with a simplistic and easy-to-use dashboard that is packed with features.

### Noot's Hardware
This project currently can be run on most microcontrollers that supports the following:
 - The [Adafruit SCD41 or SCD40](https://learn.adafruit.com/adafruit-scd-40-and-scd-41) temperature/humidity/CO2 sensor.
 - The ability to run/compile go programs.

The recommended choice of device(s) to run Noot on is a [Raspberry Pi zero 2](https://thepihut.com/products/raspberry-pi-zero-2)(Best choice: Cheapest, easiest, smallest.), [Raspberry Pi 3b](https://thepihut.com/products/raspberry-pi-3-model-b), or a [Raspberry Pi 4b](https://thepihut.com/products/raspberry-pi-4-model-b)

Noot does not currently support any arduino based devices, and support for arduino-based boards is currently TBC.

### Noot's software
The software that is run on a NootBox is open source, and currently collects no analytical data that is sent to us (the developers of Noot.)

It was programmed in Go, and anyone is free to modify for themselves and continue to use our service, with the modified program (as per the mit license) - (Noot TOS is TBC).

The NootBox program currently only supports two sensors. These are the [Adafruit SCD41 and SCD40](https://learn.adafruit.com/adafruit-scd-40-and-scd-41). We plan to support more sensors in the future based on highest demand.

An executable version of the NootBox program will be created and distributed with every NootBox application update/release. However, some users may choose to compile it themselves, that is also supported and will have very similar installation instructions.

### Noot's API
Noot currently does not a public API, and it is not currently open for all to use besides the endpoints for:
 - pushing data to NootWeb(`POST "https://api.noot.site/push"`)
 - creating/enrolling a NootBox(`POST "https://api.noot.site/verify"`)

### Commit Checklist
The following checkboxes must all be true before committing to Noot.
 - [ ] Do you need to update documentation?
 - [ ] Have you modified your application version?
 - [ ] Have you modified your code for production use?
 - [ ] Have you hard-coded any errors in non-english?
 - [ ] Are you committing too many/too fewer changes at once?
 - [ ] Have you properly tested your code? If not, commit to the "dev" branch.
 - [ ] Are you using an appropriate commit message?


---
##### Created by [Ashley Caramel](https://github.com/fwuffyboi) & [JoltCode](https://github.com/JoltCode)
