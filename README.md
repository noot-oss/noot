# NootBOX/NootWEB/NootAPI/The Noot CLI Tool

### About Noot
TODO: Write this section.

Noot aims to be a simple way to record CO2, humidity and temperature with basic off-the-shelf components.

The data collected from your NootBox is then sent to our server and is relayed back to you with a simplistic and easy-to-use dashboard that is packed with features.

### Noot's Hardware
TODO: Write this section.

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
Noot utilises Prisma and hono to produce an API which run's on the edge.

TODO: Write this section.


---
### Credits:
For full credits for the Noot project, please visit [docs.noot.site/credits](https://docs.noot.site/credits)

[![Deploy Website, API, and box serve](https://github.com/noot-oss/noot/actions/workflows/deploy-prod.yml/badge.svg)](https://github.com/noot-oss/noot/actions/workflows/deploy-prod.yml)
