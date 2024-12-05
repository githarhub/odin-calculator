// object to perform calculation
const calculation = {

    // add method that perform calculation
    method: {
        "+": (num1, num2) => num1 + num2,
        "-": (num1, num2) => num1 - num2,
        "*": (num1, num2) => num1 * num2,
        "/": (num1, num2) => num1 / num2,
        "**": (num1, num2) => num1 ** num2,
        "^": (num1) => Math.sqrt(num1)
    },


    // perform calculation by calling method
    calculate: function (op, num1, num2) {

        return this.method[op](num1, num2)
    }
}


// function to check if input is calculable
function checkAndInspect(text) {

    // regex for checking only calculable character and number
    const onlyCalculable = /^(?:[\d\s+\-*/^()]|\*\*)+$/;
    // regex for checking character or number after ( is valid
    const correctOpenParen = /^(?:[\d^(])+$/
    // regex for checking character or number after ) is valid
    const correctCloseParen = /^(?:[\d^)])+$/


    // check if it only include calculable character and number
    if (!onlyCalculable.test(text)) {
        return console.log("Not Calculable")
    }


    // delete all white space, split when it isn't number and filter to remove empty array item 
    toCalculate = text.replaceAll(" ", "").split(/([^\d])/).filter(Boolean);
    console.log(toCalculate)

    length = toCalculate.length;

    // check array element is number and change string to number if it is
    toCalculate = toCalculate.map((element) => {
        number = parseFloat(element);

        return isNaN(number) ? element : number;
    })

    // check and inspect parentheses for calculation
    paren = toCalculate.reduce((paren, current, index, array) => {


        if (current == "(") {
            paren.open += 1;
            paren.struct += "(";

            // check character after ( is valid
            if (!correctOpenParen.test(array[index + 1]) && index < length) {

                paren.place = false;
            }

        }

        else if (current == ")") {
            paren.close += 1;
            paren.struct += ")";

            // check character after ( is valid
            if (!correctCloseParen.test(array[index - 1]) && index < 0) {

                paren.place = false;
            }

            // check if ) come before (
            else if (paren.close > paren.open) {
                paren.place = false;
            }
        }

        return paren;
    }, {
        open: 0,
        close: 0,
        place: true,
        struct: ""

    })

    if (paren.place === false || !(paren.open === paren.close)) {

        return console.log("Not Calculable")
    }

    return [toCalculate, paren.struct]

}



