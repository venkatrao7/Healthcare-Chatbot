// CHATBOT DATASET

let dataset = {};

// LOAD DATASET

fetch('dataset.json')
    .then(response => response.json())
    .then(data => {

        dataset = data;

        console.log("Dataset loaded successfully");

    })
    .catch(error => {

        console.error("Dataset loading error:", error);

        addBotMessage(
            "⚠️ Failed to load healthcare dataset."
        );
    });

/* PAGE LOAD */

window.addEventListener("load", () => {

    // WELCOME MESSAGE

    setTimeout(() => {

        addBotMessage(
            "Hello 👋<br>I’m your Cognitive Wellness Assistant.<br>How can I help you today?"
        );

    },500);

    // LOAD SAVED THEME

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "light"){

        document.body.classList.add("light-mode");

        themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
    }
});

/* ELEMENTS */

const sendButton =
document.getElementById("send-button");

const userInput =
document.getElementById("user-message");

const chatBox =
document.getElementById("chat-box");

const themeToggle =
document.getElementById("themeToggle");

/* SEND BUTTON */

sendButton.addEventListener("click", () => {

    handleUserInput();
});

/* ENTER KEY SUPPORT */

userInput.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        event.preventDefault();

        handleUserInput();
    }
});

/* HANDLE USER INPUT */

function handleUserInput(){

    const userMessage =
    userInput.value.trim();

    if(userMessage === "") return;

    addUserMessage(userMessage);

    userInput.value = "";

    showTyping();

    setTimeout(() => {

        try{

            removeTyping();

            const botResponse =
            getResponse(userMessage);

            addBotMessage(botResponse);

        }catch(error){

            console.error(error);

            removeTyping();

            addBotMessage(
                "⚠️ Sorry, I couldn't understand that properly. Please try another health-related question."
            );
        }

    },1000);
}

/* USER MESSAGE */

function addUserMessage(message){

    const userDiv =
    document.createElement("div");

    userDiv.classList.add(
        "message",
        "user-message"
    );

    userDiv.innerHTML = message;

    chatBox.appendChild(userDiv);

    scrollToBottom();
}

/* BOT MESSAGE */

function addBotMessage(message){

    const botDiv =
    document.createElement("div");

    botDiv.classList.add(
        "message",
        "bot-message"
    );

    botDiv.innerHTML = message;

    chatBox.appendChild(botDiv);

    scrollToBottom();
}

/* TYPING ANIMATION */

function showTyping(){

    const typingDiv =
    document.createElement("div");

    typingDiv.classList.add(
        "message",
        "bot-message"
    );

    typingDiv.id = "typing";

    typingDiv.innerHTML =
    "Typing<span class='dots'>...</span>";

    chatBox.appendChild(typingDiv);

    scrollToBottom();
}

/* REMOVE TYPING */

function removeTyping(){

    const typing =
    document.getElementById("typing");

    if(typing){
        typing.remove();
    }
}

/* AUTO SCROLL */

function scrollToBottom(){

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

/* BOT RESPONSE */

function getResponse(userMessage){

    if(!dataset || !dataset.health_conditions){

        return "Dataset is still loading. Please wait...";
    }

    const normalizedMessage =
    userMessage.toLowerCase();

    /* PREDEFINED RESPONSES */

    const predefinedResponses = {

        greetings: [
            "hello",
            "hi",
            "hey",
            "good morning",
            "good afternoon"
        ],

        goodbyes: [
            "bye",
            "goodbye",
            "take care"
        ],

        thanks: [
            "thanks",
            "thank you"
        ],

        about_you: [
            "who are you",
            "what do you do"
        ]
    };

    /* GREETINGS */

    if(predefinedResponses.greetings.some(
        greet => normalizedMessage.includes(greet)
    )){
        return "Hello 👋 How can I assist you today?";
    }

    /* GOODBYE */

    if(predefinedResponses.goodbyes.some(
        bye => normalizedMessage.includes(bye)
    )){
        return "Goodbye 🌟 Stay healthy and take care!";
    }

    /* THANKS */

    if(predefinedResponses.thanks.some(
        thank => normalizedMessage.includes(thank)
    )){
        return "You're welcome 😊";
    }

    /* ABOUT BOT */

    if(predefinedResponses.about_you.some(
        about => normalizedMessage.includes(about)
    )){
        return "I'm your AI healthcare assistant 🤖";
    }

    /* RANDOM INPUT */

    if(!/^[a-zA-Z0-9 ?!.,'-]+$/.test(userMessage)){

        return "Please ask a healthcare-related question.";
    }

    /* SEARCH DATASET */

    let foundCondition = null;

    for(let category of dataset.health_conditions){

        for(let condition of category.conditions){

            for(let symptom of condition.symptoms){

                if(
                    normalizedMessage.includes(
                        symptom.toLowerCase()
                    )
                ){

                    foundCondition = condition;

                    break;
                }
            }

            if(foundCondition) break;
        }

        if(foundCondition) break;
    }

    /* RESPONSE */

    if(foundCondition){

        const appointmentLink =
        foundCondition.appointment_booking
        ? foundCondition.appointment_booking.redirect_url
        : "#";

        return `
        <strong>Disease:</strong> ${foundCondition.name}<br><br>

        <strong>Description:</strong>
        ${foundCondition.description}<br><br>

        <strong>Symptoms:</strong>
        ${foundCondition.symptoms.join(", ")}<br><br>

        <strong>Treatments:</strong>
        ${foundCondition.treatments.join(", ")}<br><br>

        <strong>Book Appointment:</strong>
        <a href="${appointmentLink}"
        target="_blank">
        Click Here
        </a>
        `;
    }

    /* DEFAULT */

    return "I'm not sure about that. Try asking about symptoms, diseases, or treatments.";
}

/* DARK MODE */

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("light-mode");

    if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

        themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }else{

        localStorage.setItem("theme","dark");

        themeToggle.innerHTML =
        '<i class="fa-solid fa-moon"></i>';
    }
});

/* LOGOUT */

function logout(){

    const confirmLogout =
    confirm("Are you sure you want to logout?");

    if(confirmLogout){

        window.location.href = "/logout";
    }
}