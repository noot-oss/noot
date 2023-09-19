// This file is part of NootBox.
// NootBox is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
// NootBox is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License along with NootBox. If not, see <https://www.gnu.org/licenses/>.
#include <WiFiNINA.h>
#include <SPI.h>
#include <string>
#include <EEPROM.h>
#include <Arduino.h>
#include <SensirionI2CScd4x.h>
#include <Wire.h>
#include <Arduino_JSON.h>
#include <HttpClient.h>
#include <Ethernet.h>
#include <EthernetClient.h>

//wifi
// TODO: Find a way to keep WIFI_PASS private.
char WIFI_SSID[] = "default";     // network ssid (dug)
char WIFI_PASS[] = "default";     // network password (duh x2)
int wifiStatus = WL_IDLE_STATUS;  // wifi radio status
IPAddress localIP;                // stores local ip address

// enrollment server
WiFiServer server(17002);

// eeprom
byte eepromJson;  // stores the shit from eeprom

// sensererionion shit
SensirionI2CScd4x scd4x;  // scd4x thingy jkbnerklwgnfk fuck am i DOING FUCK
char scdErrMessage[256];
uint16_t scdError;


const char VERSION[] = "V0.1.0";  // version of this clusterfuck excuse of a piece of software


void setup() {
  // Setup serial; comms
  Serial.begin(115200);
  while (!Serial) {
    delay(50);  // wait for serial port to connect.
  }
  Wire.begin();
  Serial.println("[SERL]   Serial communications established.");

  // list weird copyright info and shit
  Serial.println(("[INFO]   This is NootBox. Version ", VERSION, "."));
  Serial.println("[INFO]   NootBox is the name of software used on a NootBox device, this device collects simple environmental data such as, but not limited to; Audio levels, temperature and humidity.");
  Serial.println("[INFO]   NootBox  Copyright (C) 2023  Noot-OSS");
  Serial.println(
    "[INFO]   This program comes with ABSOLUTELY NO WARRANTY; "
    "[INFO]   This is free software, and you are welcome to redistribute it under certain conditions."
    "[INFO]   For details visit https://github.com/Noot-OSS/Noot/blob/main/LICENSE."
  );

  // test if the wifi module is even fucking THERE
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("[WIFI]   WiFi module could not be contacted. Please try rebooting.");
    Serial.println("[WIFI]   If this issue persists, conduct additional testing, or contact product support.");
    Serial.println("[OTHE]   This application will now cease operation, to run again, restart your NootBox.");
    // don't continue
    while (true);
  }

  // test firmware version
  String wifiFirmwareVersion = WiFi.firmwareVersion();
  if (wifiFirmwareVersion < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("[WIFI]   Please upgade your WiFi chip's firmware.");
    Serial.println("[OTHE]   This application will now cease operation, to run again, restart your NootBox.");
    while (true);
  }

  // Get wifi credentials.
  Serial.println("[FLSH]   Attempting to read WiFi credentials from EEPROM...");
  EEPROM.begin(2048);         // how many bytes we will read
  int eepromReadAddress = 0;  // read from beginning of eeprom
  eepromJson = EEPROM.read(eepromReadAddress);
  // if eeprom data empty, continue, else, change wifi variables to eeprom values
  // TODO:
    // parse data
    // TODO:
  
  // Connect to Wi-Fi
  Serial.println(("[WIFI]   Attempting to connect to the '", WIFI_SSID, "' Wi-Fi network..."));
  WiFi.setHostname("NootBox");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (wifiStatus != WL_CONNECTED) {  // while not connected to network
    Serial.print(("[WIFI]   Attempting to connect to: ", WIFI_SSID, "..."));
    wifiStatus = WiFi.begin(WIFI_SSID, WIFI_PASS);

    // wait 10 seconds for connection
    delay(10 * 1000);
  }
  wifiStatus = WiFi.status();
  localIP = WiFi.localIP();
  Serial.println(("[WIFI]   Status:              ", wifiStatus));
  Serial.println(("[WIFI]   Connected to:        ", WIFI_SSID));
  Serial.println(("[WIFI]   Local IP-address is: ", localIP));

  // check if enrolled to NootWeb
  bool enrolled = false;
  Serial.println("[OTHE]   Assuming NootBox is unenrolled.");
  Serial.println("[OTHE]   Attempting to check if NootBox is enrolled...");
  
  // read from eeprom
  // TODO:
  // parse data to get NW creds
  // TODO:

  // we are not enrolled
  // ask nootweb if my device serial number exists on their database
  // TODO:

  // its on there: ?????

  // its not on there: enroll myself as a new box
  server.begin();  // start server

  while (!enrolled) {
    WiFiClient client = server.available();

    if (client) {  // Yay! uwu~ someone joined our servery wervery! nyaaaa~~
      Serial.println("[SERV]   A new client has connected.");

      String clientDataString = "";

      while (client.connected()) {  // this should be fucking obvious
        if (client.available()) {

          char c = client.read();
          Serial.write(c);
          
          if (c == "\n") {  // if byte is newline
            // if the current line is blank, you got two newline characters in a row.

            // that's the end of the client HTTP request, so send a response:

            if (clientDataString.length() == 0) {
              // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
              // and a content-type so the client knows what's coming, then a blank line:

              client.println("HTTP/1.1 200 OK");          // header and status code
              client.println("Content-type:text/html");   // content type smh
              client.println();                           // empty newline for seperation

              // TODO: finish html
              client.println("<h1>Hello! This is NootBox.</h1>"); // send html here.

              // send blank line to break response.
              client.println();

              // break out of loop
              break;
            } else {  // if you got a newline, clear clientDataString
              clientDataString = "";
            }
        

          } else if (c != "\r") {  // if got anything else but a carrige return character
            clientDataString += c; // add it to end
            Serial.println(clientDataString); // TODO: debug
          }

          // check for paths here.
          if (clientDataString.endsWith("POST /pinsubmit")) {  // api route
            // submit to nootweb
            Serial.println(("[SERV]   Sending recieved code (", clientDataString, ") to NootWeb."));

            // sending code
            // TODO: Send code to nootweb.

            client.println("");
          }
      }
    } 
  }

  // we are enrolled
  

  // stop potentially previously started measurement
  Serial.println("[SNSR]   Attempting to stop potential previous measurements...");
  scdError = scd4x.stopPeriodicMeasurement();
  if (scdError) {
    errorToString(scdError, scdErrMessage, 256);
    Serial.println(("[SNSR]   ", scdErrMessage));
  } else {
    Serial.println("[SNSR]   Done.");
  }
  
  // continue to loop()
}

void loop() {
  // take measurements from sensor

  // upload to nootweb

  // TODO: Attempt to grab OTA updates every 60 minutes (https://arduino-pico.readthedocs.io/en/latest/ota.html#http-server)
}
