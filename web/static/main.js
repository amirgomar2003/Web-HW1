// Get references to the input container, formula field, and result field
const inputContainer = document.getElementById('input-container');
const formula = document.getElementById('formula');
const result = document.getElementById('result');
const addInputButton = document.getElementById('add-input');
const operation = document.getElementById('operation');
const resultLabel = document.getElementById('result-label')
const mapOperationToFunction = {
    "formulae": formulae,
    "avg": average,
    "price": totalPrice,
    "variance": variance,
}
operation.addEventListener('change', () => {
    formula.value = ""
    calculateResult()
});

// Event listener of add new input button.
addInputButton.addEventListener('click', createInputGroup);

// Event listener of changing formulae field.
formula.addEventListener('input', calculateResult);

// Counter to generate unique input IDs
let inputCounter = 1;

// Function to check if an input name already exists (excluding the current input).
function isInputNameExists(name, currentInputNameElement) {
    const inputNames = document.querySelectorAll('.input-name');
    for (const inputName of inputNames) {
        if (inputName !== currentInputNameElement && inputName.textContent.trim() === name) {
            return true;
        }
    }
    return false;
}

function generateUniqueInputName() {
    let name = `input${inputCounter}`;
    while (isInputNameExists(name, null)) {
        inputCounter++;
        name = `input${inputCounter}`;
    }
    return name;
}

function newInputGroup(name){
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    // Create a wrapper for input-name and close-btn.
    const inputNameWrapper = document.createElement('div');
    inputNameWrapper.className = 'input-name-wrapper';

    const inputName = document.createElement('span');
    inputName.className = 'input-name';
    inputName.textContent = name;
    inputGroup.id = ("input_" + inputName.textContent)
    inputName.setAttribute('contenteditable', 'true');

    const closeButton = document.createElement('span');
    closeButton.className = 'close-btn';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
        inputContainer.removeChild(inputGroup);
        calculateResult();
    });

    inputNameWrapper.appendChild(inputName);
    inputNameWrapper.appendChild(closeButton);

    const inputValue = document.createElement('input');
    inputValue.type = 'number';
    inputValue.placeholder = 'Enter a number';
    inputValue.className = 'input-value';

    inputGroup.appendChild(inputNameWrapper);
    inputGroup.appendChild(inputValue);
    inputContainer.appendChild(inputGroup);

    // Increment counter for the next input
    inputCounter++;

    // this will let us edit a fields name if it is needed.
    inputName.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            let newName = inputName.textContent.trim();
            if (isInputNameExists(newName, inputName)) {
                newName = generateUniqueInputName();
                alert('Input name already exists. Please choose a different name.');
            }
            inputName.textContent = newName;
            inputGroup.id = ("input_" + newName);
            calculateResult();
        }
    });
    inputValue.addEventListener('input', calculateResult);
}

// creatInputGroup creates a new inputGroup instance.
function createInputGroup() {
    if (operation.value === "price"){
        alert("In the price operation, you are not allowed to edit input fields.")
        return
    }
    newInputGroup(generateUniqueInputName())
}

// Function to calculate the result based on the formula.
function calculateResult() {
    if (operation.value !== "formulae") {
        formula.value = operation.value;
        formula.readOnly = true;
    } else {
        formula.readOnly = false;
    }
    const inputGroups = document.querySelectorAll('.input-group');
    const inputNames = [];

    // Step 1: Extract inputName and inputValue pairs
    inputGroups.forEach((inputGroup) => {
        const inputName = inputGroup.querySelector('.input-name').textContent.trim();
        inputNames.push(inputName)
    });

    // Step 2: Replace variable names in the formula with their values
    let expression = formula.value;
    mapOperationToFunction[operation.value](inputNames, expression)
}

function average(inputNames){
    const values = []
    inputNames.forEach((inputName) => {
        const inputValue = parseFloat(document.getElementById(("input_" + inputName)).querySelector('.input-value').value) || 0;
        values.push(inputValue)
    })
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    result.value = mean.toFixed(2);
    result.style.backgroundColor = '#abe092';
    resultLabel.textContent = "Average"
}
function variance(inputNames){
    const values = []
    inputNames.forEach((inputName) => {
        const inputValue = parseFloat(document.getElementById(("input_" + inputName)).querySelector('.input-value').value) || 0;
        values.push(inputValue)
    })
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / values.length;
    result.value = variance.toFixed(2);
    result.style.backgroundColor = '#abe092';
    resultLabel.textContent = "Variance"
}
function formulae(inputNames, expression){
    inputNames.forEach((inputName) => {
        const regex = new RegExp(`\\b${inputName}\\b`, 'g');
        const inputValue = parseFloat(document.getElementById(("input_" + inputName)).querySelector('.input-value').value) || 0;
        expression = expression.replace(regex, inputValue);
    });

    // Step 3: Evaluate the expression and update the result
    try {
        const calculatedResult = eval(expression);
        result.value = calculatedResult.toFixed(2);
        result.style.backgroundColor = '#abe092';
        resultLabel.textContent = "Result"
    } catch (error) {
        result.value = 'Invalid Formula.';
        result.style.backgroundColor = '#df9898';
        resultLabel.textContent = "Result"
    }
}
function totalPrice(inputNames){
    let price = 0;
    let discount = 0;
    let count = 0;
    inputNames.forEach((inputName) => {
        const inputGroup = document.getElementById(("input_" + inputName))
        if (inputName !== "price" && inputName !== "discount" && inputName !== "count"){
            inputContainer.removeChild(inputGroup);
        }
    })
    try {
        price = parseFloat(document.getElementById(("input_price")).querySelector('.input-value').value) || 0;
    } catch (error) {
        newInputGroup("price")
    }
    try {
        discount = parseFloat(document.getElementById(("input_discount")).querySelector('.input-value').value) || 0;
    } catch (error) {
        newInputGroup("discount")
    }
    try {
        count = parseFloat(document.getElementById(("input_count")).querySelector('.input-value').value) || 0;
    } catch (error) {
        newInputGroup("count")
    }
    const totalPrice = (price * (100 - discount)/100) * count;
    result.value = totalPrice.toFixed(2);
    result.style.backgroundColor = '#abe092';
    resultLabel.textContent = "Total Price"
}

// Initialize with one input field
createInputGroup();
calculateResult();