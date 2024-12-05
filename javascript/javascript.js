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
        "!": (num1) => Math.sqrt(num1)
    },


    // perform calculation by calling method
    calculate: function (op, num1, num2) {

        return this.method[op](num1, num2)
    }
}


// function to check if input is calculable
function checkAndInspect(text) {

    // regex for checking only calculable character and number
    const onlyCalculable = /^(?:[\d\s+\-*/^%!()])+$/;
    // regex for checking character or number after ( is valid
    const correctOpenParen = /^(?:[\d^(])+$/
    // regex for checking character or number after ) is valid
    const correctCloseParen = /^(?:[\d^)])+$/
    // regex for checking character is +-*/%
    const correctOpera = /[+\-*/%^]/;


    // check if it only include calculable character and number
    if (!onlyCalculable.test(text)) {
        return console.log("Not Calculable")
    }


    // delete all white space, split when it isn't number and filter to remove empty array item 
    toCalculate = text.replaceAll(" ", "").split(/([^\d])/).filter(Boolean);
    console.log(toCalculate)

    length = toCalculate.length - 1;

    // check array element is number and change string to number if it is
    toCalculate = toCalculate.map((element) => {
        number = parseFloat(element);

        return isNaN(number) ? element : number;
    })

    // check and inspect parentheses for calculation
    const parenAndOpera = toCalculate.reduce((parenAndOpera, current, index, array) => {


        if (current == "(") {
            parenAndOpera.parenOpen += 1;
            parenAndOpera.struct += "(";

            // check character after ( is valid
            if (!correctOpenParen.test(array[index + 1]) && index < length) {

                parenAndOpera.place = false;
            }

        }

        else if (current == ")") {
            parenAndOpera.parenClose += 1;
            parenAndOpera.struct += ")";

            // check character after ( is valid
            if (!correctCloseParen.test(array[index - 1]) && index < 0) {

                parenAndOpera.place = false;
            }

            // check if ) come before (
            else if (parenAndOpera.close > parenAndOpera.open) {
                parenAndOpera.place = false;
            }
        }

        else if (correctOpera.test(current)) {

            if (index === 0 || index === length) {

                parenAndOpera.place = false;
            }

            else if(correctOpera.test(array[index + 1])) {
                parenAndOpera.place = false;

            }
        }

        else if (current === "!") {
            if (index == length) {
                parenAndOpera.place = false;
            }

            else if(correctOpera.test(array[index + 1])) {
                parenAndOpera.place = false;

            }
        }

        return parenAndOpera;
    }, {
        parenOpen: 0,
        parenClose: 0,
        place: true,
        struct: ""

    })

    if (parenAndOpera.place == false || !(parenAndOpera.parenOpen === parenAndOpera.parenClose)) {

        return console.log("Not Calculable")
    }

    return [toCalculate, parenAndOpera.struct]

}





