package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/voice", handleVoice)
	fmt.Println("Server listening on port 8081")
	http.ListenAndServe(":8081", nil)
}

func handleVoice(w http.ResponseWriter, r *http.Request) {
	// This is where you would put your TwiML logic
	// For now, we'll just return a simple message
	fmt.Fprint(w, "<Response><Say>Hello from your Go server!</Say></Response>")
}
