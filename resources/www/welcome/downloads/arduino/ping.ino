#include <Arduino.h>

void setup() {
    Serial.begin(57600);
}

void loop() {
    String ping = Serial.readString();
    ping.trim();

    if(ping.equalsIgnoreCase("ping")) {
        Serial.println("pong");
    }

    delay(33);
}