// Initialize dataset
let dataset = {};

// Load the dataset
fetch('dataset.json')
    .then(response => response.json())
    .then(data => {
        dataset = data;
        console.log("Dataset loaded successfully:", dataset);
    })
    .catch(error => {
        console.error("Error loading dataset:", error);
        alert("Failed to load dataset. Please check console logs.");
    });

// Event listener for send button and Enter key
document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-message");

    sendButton.addEventListener("click", function () {
        handleUserInput();
    });

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });
});

function handleUserInput() {
    const userInput = document.getElementById("user-message");
    let userMessage = userInput.value.trim();

    if (userMessage !== "") {
        console.log("User input received:", userMessage);
        sendMessage(userMessage);
    } else {
        alert("Please enter a valid message.");
    }
}

function sendMessage(userMessage) {
    // Display user message
    const chatBox = document.getElementById("chat-box");

    const userDiv = document.createElement("div");
    userDiv.classList.add("message", "user-message");
    userDiv.textContent = userMessage;
    chatBox.appendChild(userDiv);

    // Get bot response
    const botMessage = getResponse(userMessage);
    
    const botDiv = document.createElement("div");
    botDiv.classList.add("message", "bot-message");
    botDiv.innerHTML = botMessage;
    chatBox.appendChild(botDiv);

    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Clear input field
    document.getElementById("user-message").value = "";
}

function getResponse(userMessage) {
    if (!dataset || !dataset.health_conditions) {
        console.warn("Dataset is not loaded yet.");
        return "The dataset is still loading. Please try again in a moment.";
    }

    let normalizedMessage = userMessage.toLowerCase();

    // Predefined responses
    const predefinedResponses = {
        greetings: ["hello", "good morning", "good afternoon", "hi", "hey", "hola"],
        goodbyes: ["bye", "goodbye", "see you", "take care"],
        thanks: ["thanks", "thank you", "much appreciated"],
        about_you: ["who are you", "what is your name", "what do you do"]
    };

    // Check for predefined responses
    if (predefinedResponses.greetings.some(greet => normalizedMessage.includes(greet))) {
        return "Hello! 👋 How can I assist you today? 😊";
    }
    if (predefinedResponses.goodbyes.some(bye => normalizedMessage.includes(bye))) {
        return "Goodbye! Take care and stay healthy! 🌟";
    }
    if (predefinedResponses.thanks.some(thank => normalizedMessage.includes(thank))) {
        return "You're welcome! Let me know if you need anything else. 🤗";
    }
    if (predefinedResponses.about_you.some(about => normalizedMessage.includes(about))) {
        return "I'm your friendly AI healthcare assistant 🤖. Feel free to ask about symptoms, conditions, or treatments!";
    }

    // Detect random or meaningless input
    if (!/^[a-zA-Z0-9 ?!.,'-]+$/.test(userMessage)) {
        return "I can help with health-related queries. Try asking about symptoms or conditions.";
    }

    // Search dataset for matching condition
    let foundCondition = null;
    for (let category of dataset.health_conditions) {
        for (let condition of category.conditions) {
            for (let symptom of condition.symptoms) {
                if (normalizedMessage.includes(symptom.toLowerCase())) {
                    foundCondition = condition;
                    break;
                }
            }
            if (foundCondition) break;
        }
        if (foundCondition) break;
    }

    if (foundCondition) {
        const appointmentLink = foundCondition.appointment_booking ? foundCondition.appointment_booking.redirect_url : "#";
        return `<strong>Disease:</strong> ${foundCondition.name}<br>
                <strong>Description:</strong> ${foundCondition.description}<br>
                <strong>Symptoms:</strong> ${foundCondition.symptoms.join(", ")}<br>
                <strong>Treatments:</strong> ${foundCondition.treatments.join(", ")}<br>
                <strong>Book Appointment:</strong> <a href="${appointmentLink}" target="_blank">Click here</a>`;
    }

    // Default response
    return "I'm not sure how to respond to that. Try asking about symptoms, diseases, or treatments.";
}
