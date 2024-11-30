package main

import (
    "net/http"
	"encoding/json"
)

// Todo struct to represent a single todo item
type Todo struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

//Empty list of todos
var todoList = []Todo{}



func main() {
    http.HandleFunc("/", ToDoListHandler)

    println("Server is running on http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	// Set headers
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    w.Header().Set("Content-Type", "application/json")

    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return
    }

	// Handle get requests
	if r.Method == http.MethodGet {
		// Return the list of todos
		json.NewEncoder(w).Encode(todoList)
		return
	}

	if r.Method == http.MethodPost {
		//Add a new todo to the list
        var newTodo Todo

        // Validate input
        if newTodo.Title == ""{
            http.Error(w, "Missing title field", http.StatusBadRequest)
            return
        }
		if newTodo.Description == ""{
			http.Error(w, "Missing description field", http.StatusBadRequest)
			return
		}

        // Add to the list
        todoList = append(todoList, newTodo)

        // Respond with updated list
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(newTodo)
        
	}
}