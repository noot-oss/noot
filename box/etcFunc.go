package main

import "strings"


// asteriskExceptLastFive replaces all but the last five characters of a string with asterisks.
func asteriskExceptLastFive(input string) string {
	// THIS FUNCTION WAS GENERATED USING CHAT-GPT

	// Get the last 5 characters of the input string
	lastFive := input[len(input)-5:]

	// Create a string of asterisks with the length of the input string except the last 5 characters
	asterisks := strings.Repeat("*", len(input)-5)

	// Combine the asterisks and the last five characters to create the hidden string
	hiddenString := asterisks + lastFive

	// Return the string
	return hiddenString
}


// parseAcceptLanguage parses the "Accept-Language" header to get the preferred language.
func parseAcceptLanguage(acceptLanguage string) string {
	// THIS FUNCTION WAS GENERATED USING CHAT-GPT
	// Split the header by commas to separate language preferences
	languages := strings.Split(acceptLanguage, ",")

	// Iterate through the language preferences and extract the language code
	for _, language := range languages {
		// Split each preference by semicolon to get the language code and quality
		parts := strings.Split(strings.TrimSpace(language), ";")

		// The language code is the first part (e.g., "en-US" in "en-US;q=0.8")
		languageCode := parts[0]

		// Remove any additional parameters (e.g., quality) and return the language code
		return languageCode[:2]
	}

	// Return a default language if no preference is found
	return "en" // Default to English if no preference is found
}
