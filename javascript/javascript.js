// object to perform calculation
const calculation = {

    // add method that perform calculation
    method: {
        "+": (num1, num2) => num1 + num2,
        "-": (num1, num2) => num1 - num2,
        "*": (num1, num2) => num1 * num2,
        "/": (num1, num2) => num1 / num2,
        "^": (num1, num2) => num1 ** num2,
        "%": (num1, num2) => num1 % num2,
        "√": (num1) => Math.sqrt(num1)

    },

    // perform calculation by calling method
    calculate: function (op, num1, num2) {

        return this.method[op](num1, num2)
    }
}


// function to check if input is calculable
function checkAndInspect(text) {

    // regex for checking only calculable character and number
    const onlyCalculable = /^(?:[\d\s+\-*/^%√().])+$/;
    // regex for checking character or number after ( is valid
    const correctOpenParen = /^(?:[\d^(√]|\d\.\d)+$/
    // regex for checking character or number after ) is valid
    const correctCloseParen = /^(?:[\d^)]|\d\.\d)+$/
    // regex for checking character is +-*/%
    const correctOpera = /[+\-*/%^]/;
    // regex for checking character before √ valid
    const correctOperaSqr = /[\d)]|\d\.\d/;


    // check if it only include calculable character and number
    if (!onlyCalculable.test(text)) {
        return "Not Calculable";
    }


    // delete all white space, split when it isn't number and filter to remove empty array item 
    toCalculate = text.replaceAll(" ", "").split(/([^\d.])/).filter(Boolean);

    // get length and reduce by  1 to check last index
    length = toCalculate.length - 1;

    // check array element is number and change string to number if it is
    toCalculate = toCalculate.map((element) => {
        number = parseFloat(element);

        return isNaN(number) ? element : number;
    })

    // check and inspect parentheses for calculation
    const parenAndOpera = toCalculate.reduce((parenAndOperaAcc, current, index, array) => {

        if (current == "(") {
            parenAndOperaAcc.parenOpen += 1;

            // check character after ( is valid
            if (!correctOpenParen.test(array[index + 1]) && index < length) {

                parenAndOperaAcc.place = false;
            }
        }

        else if (current == ")") {
            parenAndOperaAcc.parenClose += 1;

            // check character after ( is valid
            if (!correctCloseParen.test(array[index - 1]) && index < 0) {

                parenAndOperaAcc.place = false;
            }

            // check if ) come before (
            else if (parenAndOperaAcc.close > parenAndOperaAcc.open) {
                parenAndOperaAcc.place = false;
            }
        }

        else if (correctOpera.test(current)) {

            if (index === 0 || index === length) {

                parenAndOperaAcc.place = false;
            }

            else if (correctOpera.test(array[index + 1])) {
                parenAndOperaAcc.place = false;

            }
        }

        else if (current === "√") {
            if (index == length) {
                parenAndOperaAcc.place = false;
            }

            else if (correctOpera.test(array[index + 1])) {
                parenAndOperaAcc.place = false;

            }

            else if (index > 0 && correctOperaSqr.test(array[index - 1])) {

                parenAndOperaAcc.place = false;

            }

        }

        return parenAndOperaAcc;
    }, {
        parenOpen: 0,
        parenClose: 0,
        place: true
    })

    if (parenAndOpera.place == false || !(parenAndOpera.parenOpen === parenAndOpera.parenClose)) {

        return "Not Calculable";
    }

    return toCalculate;

}

function operation(toCalculate) {

    // check parameter isn't array 
    if (Array.isArray(toCalculate) == false) {

        // check and if it valid change to array
        toCalculate = checkAndInspect(toCalculate);

        // return if it isn't valid
        if (typeof toCalculate == "string") {
            return toCalculate;
        }
    }


    // loop until no parentheses
    while (toCalculate.includes("(")) {

        // get first index of closing parentheses
        const closePeraIndex = toCalculate.findIndex((element) => element == ")");

        // get last index of opening parentheses until first index of closing parentheses
        const openPeraIndex = toCalculate.findLastIndex((element, index) => element == "(" && index < closePeraIndex);

        // if parentheses exist start recursion
        if (openPeraIndex !== -1) {

            // get sliced array
            let slicedToCalculated = toCalculate.slice(openPeraIndex + 1, closePeraIndex)
            console.log(slicedToCalculated)

            // call recursion by passing sliced array 
            result = operation(slicedToCalculated)
            // splice parentheses, it's between and put result in spliced place
            toCalculate.splice(openPeraIndex, closePeraIndex - openPeraIndex + 1, result);
        }

    }


    //regex for checking + and -
    const checkAddAndSub = /[+\-]/;

    // calculate √ operators
    toCalculate = toCalculate.filter((element, index) => {

        if (element == "√") {

            // perform calculation by calling calculate in calculation and passing number element after current √ element
            toCalculate[index + 1] = calculation.calculate(element, toCalculate[index + 1]);

            // filter current √ element from array
            return false;

        }

        // do not filter any index beside index with √ element
        return true;
    })

    // calculate ^ operators
    toCalculate = toCalculate.filter((element, index) => {

        if (toCalculate[index + 1] == "^") {

            // filter element after current ^ element
            return false;
        }

        else if (element == "^") {

            // perform calculation by calling calculate in calculation and passing number elements before and after current ^ element
            toCalculate[index + 1] = calculation.calculate(element, toCalculate[index - 1], toCalculate[index + 1])

            // filter current ^ element
            return false;
        }

        // do not filter the rest of elements
        return true;
    })

    // calculate * operators
    toCalculate = toCalculate.filter((element, index) => {

        if (toCalculate[index + 1] == "*") {

            // filter element after current * element
            return false;
        }

        else if (element == "*") {

            // perform calculation by calling calculate in calculation and passing number elements before and after current * element
            toCalculate[index + 1] = calculation.calculate(element, toCalculate[index - 1], toCalculate[index + 1])
            return false;

        }

        return true;
    })

    // calculate % operators
    toCalculate = toCalculate.filter((element, index) => {

        if (toCalculate[index + 1] == "%") {

            // filter element after current % element
            return false;
        }

        else if (element == "%") {

            // perform calculation by calling calculate in calculation and passing number elements before and after current % element
            toCalculate[index + 1] = calculation.calculate(element, toCalculate[index - 1], toCalculate[index + 1])
            return false;

        }

        return true;
    })

    // calculate / operators
    toCalculate = toCalculate.filter((element, index) => {

        if (toCalculate[index + 1] == "/") {

            // filter element after current / element
            return false;
        }

        else if (element == "/") {

            // perform calculation by calling calculate in calculation and passing number elements before and after current / element
            toCalculate[index + 1] = calculation.calculate(element, toCalculate[index - 1], toCalculate[index + 1])
            return false;

        }

        return true;
    })

    // calculate + and - operators 
    calculatedNum = toCalculate.reduce((total, current, index) => {

        // check current element is + or -
        if (checkAddAndSub.test(current)) {

            // perform calculation by calling calculate in calculation and passing number elements before and after current + or - element
            total = calculation.calculate(current, toCalculate[index - 1], toCalculate[index + 1])

            // put total to index of after current + or - index
            toCalculate[index + 1] = total

        }

        // record current total
        return total;
    }, toCalculate[0])

    return calculatedNum;

}

function getUserInputAndReturnResult() {


    // get buttons for input buttons
    const numPadButtons = document.querySelectorAll(".cal-num-pad-button");

    // get button for clearing input
    const numPadButtonsAc = document.querySelector(".cal-num-pad-button-ac");

    // get button for deleting input
    const numPadButtonsDel = document.querySelector(".cal-num-pad-button-del");

    // get button for operation using input
    const operator = document.querySelector(".cal-num-pad-button-operation");

    // get input
    const userInput = document.querySelector(".cal-input-text");

    // to check if user type incalculable input
    let error = false;

    // focus on input
    userInput.focus();


    // add input buttons to EventListener
    numPadButtons.forEach((button) => {

        button.addEventListener("click", () => {

            // clear if previous input was incalculable
            if (error == true) {
                userInput.value = "";
                error = false;
            }

            const inputOfButton = button.textContent;

            // add text to value of userInput
            userInput.value += inputOfButton;
        })

    })

    // add = button to EventListener
    operator.addEventListener("click", () => {

        // get result from operation by passing input
        const result = operation(userInput.value);

        // assign result to value of userInput
        userInput.value = result;

        // check if result is error
        if (typeof result == "string") {

            // made error true
            error = true;

            // clear input when user focus on input box
            userInput.addEventListener("focus", () => {

                // check if error is true
                if (error == true) {

                    userInput.value = "";

                    // made error false since input was cleared
                    error = false;
                }
            })
        }
    })

    // add AC button to EventListener
    numPadButtonsAc.addEventListener("click", () => {

        // clear value of input
        userInput.value = "";

    })

    // add DEL button to EventListener
    numPadButtonsDel.addEventListener("click", () => {

        // remove last index value of input
        userInput.value = userInput.value.slice(0, -1);

    })
}

getUserInputAndReturnResult();