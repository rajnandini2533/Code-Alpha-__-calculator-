const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentValue = "";
let previousValue = "";
let operation = null;
let resetScreen = false;


// -------------------------
// Number Input
// -------------------------

function appendNumber(number) {

    if (resetScreen) {
        currentValue = "";
        resetScreen = false;
    }

    // Prevent multiple decimal points
    if (number === "." && currentValue.includes(".")) {
        return;
    }

    // Prevent starting with multiple zeros
    if (currentValue === "0" && number !== ".") {
        currentValue = "";
    }

    // Limit very long numbers
    if (currentValue.length >= 15) {
        return;
    }

    currentValue += number;

    updateDisplay();
}


// -------------------------
// Operation
// -------------------------

function chooseOperation(selectedOperation) {

    if (currentValue === "" && previousValue === "") {
        return;
    }

    if (currentValue !== "" && previousValue !== "") {
        calculate();
    }

    if (currentValue !== "") {
        previousValue = currentValue;
    }

    operation = selectedOperation;
    currentValue = "";

    updateDisplay();
}


// -------------------------
// Calculation
// -------------------------

function calculate() {

    const previous = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    if (isNaN(previous) || isNaN(current)) {
        return;
    }

    let result;

    switch (operation) {

        case "add":
            result = previous + current;
            break;

        case "subtract":
            result = previous - current;
            break;

        case "multiply":
            result = previous * current;
            break;

        case "divide":

            if (current === 0) {
                currentDisplay.textContent = "Error";
                previousDisplay.textContent = "Cannot divide by 0";

                currentValue = "";
                previousValue = "";
                operation = null;

                return;
            }

            result = previous / current;
            break;

        default:
            return;
    }

    // Avoid unnecessary decimal digits
    result = Number(result.toFixed(10));

    currentValue = result.toString();
    previousValue = "";
    operation = null;
    resetScreen = true;

    updateDisplay();
}


// -------------------------
// Clear Calculator
// -------------------------

function clearCalculator() {

    currentValue = "";
    previousValue = "";
    operation = null;
    resetScreen = false;

    updateDisplay();
}


// -------------------------
// Delete Last Character
// -------------------------

function deleteNumber() {

    if (resetScreen) {
        return;
    }

    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}


// -------------------------
// Percentage
// -------------------------

function percentage() {

    if (currentValue === "") {
        return;
    }

    currentValue = (parseFloat(currentValue) / 100).toString();

    updateDisplay();
}


// -------------------------
// Update Display
// -------------------------

function updateDisplay() {

    currentDisplay.textContent =
        currentValue === "" ? "0" : currentValue;

    if (previousValue !== "" && operation) {

        let symbol;

        switch (operation) {
            case "add":
                symbol = "+";
                break;

            case "subtract":
                symbol = "−";
                break;

            case "multiply":
                symbol = "×";
                break;

            case "divide":
                symbol = "÷";
                break;
        }

        previousDisplay.textContent =
            `${previousValue} ${symbol}`;

    } else {
        previousDisplay.textContent = "";
    }
}


// -------------------------
// Button Click Events
// -------------------------

document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


document.querySelectorAll("[data-operation]").forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(button.dataset.operation);

    });

});


document.querySelector("[data-action='equals']")
    .addEventListener("click", () => {

        calculate();

    });


document.querySelector("[data-action='clear']")
    .addEventListener("click", () => {

        clearCalculator();

    });


document.querySelector("[data-action='delete']")
    .addEventListener("click", () => {

        deleteNumber();

    });


document.querySelector("[data-action='percent']")
    .addEventListener("click", () => {

        percentage();

    });


// -------------------------
// Keyboard Support
// -------------------------

document.addEventListener("keydown", event => {

    const key = event.key;

    // Numbers
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        appendNumber(key);
    }

    // Operations
    else if (key === "+") {
        chooseOperation("add");
    }

    else if (key === "-") {
        chooseOperation("subtract");
    }

    else if (key === "*") {
        chooseOperation("multiply");
    }

    else if (key === "/") {
        event.preventDefault();
        chooseOperation("divide");
    }

    // Equals
    else if (key === "Enter" || key === "=") {
        calculate();
    }

    // Clear
    else if (key === "Escape") {
        clearCalculator();
    }

    // Delete
    else if (key === "Backspace") {
        deleteNumber();
    }

    // Percentage
    else if (key === "%") {
        percentage();
    }

});
