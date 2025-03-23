// Selecting required HTML elements
const typingText = document.querySelector('.typing-text p'); // The paragraph that will be typed
const input = document.querySelector('.wrapper .input-field'); // Input field where user types
const time = document.querySelector('.time span b'); // Timer display element
const mistakes = document.querySelector('.mistake span'); // Mistake count display element
const wpm = document.querySelector('.wpm span'); // Words Per Minute (WPM) display element
const cpm = document.querySelector('.cpm span'); // Characters Per Minute (CPM) display element
const btn = document.querySelector('button'); // Reset button

// Timer and tracking variables
let timer; // Stores the timer interval
let maxTime = 60; // Maximum time for the typing test (60 seconds)
let timeLeft = maxTime; // Remaining time counter
let charIndex = 0; // Tracks the currently typed character's position
let mistake = 0; // Stores the number of typing mistakes
let isTyping = false; // Tracks if typing has started

/**
 * Function to load a random paragraph for the typing test
 */
function loadParagraph() {
    // Array of paragraphs for the typing test
    const paragraph = [
        "Avoid daydreaming about the years to come.",
        "You are the most important person in your whole life.",
        "Always be true to who you are, and ignore what other people have to say about you.",
        "Always be true to who you are, and ignore what other people have to say about you.", // (Repeated line, consider removing duplicate)
        "Only demonstrate your strength when it’s really required."
    ];

    // Select a random paragraph from the array
    const randomIndex = Math.floor(Math.random() * paragraph.length);
    
    // Clear the previous paragraph from the display
    typingText.innerHTML = ''; 

    // Loop through the selected paragraph, wrapping each character in a `<span>` tag
    for (const char of paragraph[randomIndex]) {
        console.log(char); // Logs each character to the console for debugging
        typingText.innerHTML += `<span>${char}</span>`; // Append characters as spans
    }

    // Highlight the first character as "active" to indicate where typing should begin
    typingText.querySelectorAll('span')[0].classList.add('active');

    // Ensure the input field is focused when the user starts typing
    document.addEventListener('keydown', () => input.focus());
    typingText.addEventListener("click", () => input.focus());
}

/**
 * Function to track typing and detect errors
 */
function initTyping() {
    // Get all character elements in the paragraph
    const char = typingText.querySelectorAll('span');

    // Get the character currently being typed from the input field
    const typedChar = input.value.charAt(charIndex);

    // Ensure typing continues only if there is time left and characters are remaining
    if (charIndex < char.length && timeLeft > 0) {

        // Start the timer on the first key press
        if (!isTyping) {
            timer = setInterval(initTime, 1000); // Calls `initTime()` every second
            isTyping = true; // Mark typing as started
        }

        // Compare the typed character with the actual character in the paragraph
        if (char[charIndex].innerText === typedChar) {
            char[charIndex].classList.add('correct'); // Highlight correct character
            console.log("correct"); // Debugging log
        } else {
            mistake++; // Increment mistake count
            char[charIndex].classList.add('incorrect'); // Highlight incorrect character
            console.log("incorrect"); // Debugging log
        }

        // Move to the next character
        charIndex++;

        // Ensure that the next character is highlighted
        if (charIndex < char.length) {
            char[charIndex].classList.add('active');
        }

        // Update the mistake count in UI
        mistakes.innerText = mistake;

        // Update Characters Per Minute (CPM) (Total characters typed minus mistakes)
        cpm.innerText = charIndex - mistake;
    } else {
        // If time runs out or all characters are typed, stop the timer
        clearInterval(timer);
        input.value = ''; // Clear input field
    }
}

/**
 * Function to update the timer and calculate WPM
 */
function initTime() {
    if (timeLeft > 0) {
        timeLeft--; // Decrease the remaining time by 1 second
        time.innerText = timeLeft; // Update time display in UI

        // Calculate Words Per Minute (WPM)
        let wpmVal = Math.round(((charIndex - mistake) / 5) / ((maxTime - timeLeft) / 60));
        
        // Ensure WPM does not display negative values
        wpm.innerText = wpmVal > 0 ? wpmVal : 0;
    } else {
        // Stop the timer when time runs out
        clearInterval(timer);
    }
}

/**
 * Function to reset the typing test
 */
function reset() {
    loadParagraph(); // Load a new paragraph
    clearInterval(timer); // Stop the timer
    timeLeft = maxTime; // Reset time counter
    time.innerText = timeLeft; // Display full time
    input.value = ''; // Clear input field
    charIndex = 0; // Reset character index
    mistake = 0; // Reset mistake count
    isTyping = false; // Reset typing state

    // Reset displayed values in UI
    wpm.innerText = 0;
    cpm.innerText = 0;
    mistakes.innerText = 0;
}

// Event Listeners
input.addEventListener("input", initTyping); // Calls `initTyping()` when user types in input field
btn.addEventListener("click", reset); // Calls `reset()` when user clicks the reset button

// Load the first paragraph when the page loads
loadParagraph();
