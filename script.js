class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;
    }

    delete() {
        if (this.shouldResetDisplay) {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Division par zéro impossible!');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.currentOperand === '' ? '0' : this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Initialisation de la calculatrice
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-clear]');
const previousOperandTextElement = document.querySelector('#previous-operand');
const currentOperandTextElement = document.querySelector('#current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event listeners pour les boutons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        addButtonPressEffect(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
        addButtonPressEffect(button);
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    addButtonPressEffect(equalsButton);
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    addButtonPressEffect(allClearButton);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    addButtonPressEffect(deleteButton);
});

// Support du clavier
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Nombres et point décimal
    if ((key >= '0' && key <= '9') || key === '.') {
        calculator.appendNumber(key);
        calculator.updateDisplay();
        highlightKeyboardButton(key);
    }
    
    // Opérations
    if (key === '+' || key === '-') {
        calculator.chooseOperation(key);
        calculator.updateDisplay();
        highlightKeyboardButton(key);
    } else if (key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
        highlightKeyboardButton('×');
    } else if (key === '/') {
        event.preventDefault(); // Empêche la recherche rapide du navigateur
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
        highlightKeyboardButton('÷');
    } else if (key === '%') {
        calculator.chooseOperation('%');
        calculator.updateDisplay();
        highlightKeyboardButton('%');
    }
    
    // Égal
    if (key === 'Enter' || key === '=') {
        calculator.compute();
        calculator.updateDisplay();
        highlightKeyboardButton('=');
    }
    
    // Effacement
    if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        highlightKeyboardButton('⌫');
    }
    
    // Effacement total
    if (key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
        highlightKeyboardButton('AC');
    }
});

// Effet visuel pour les boutons pressés
function addButtonPressEffect(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 100);
}

// Surlignage des boutons lors de l'utilisation du clavier
function highlightKeyboardButton(key) {
    let targetButton = null;
    
    // Trouve le bouton correspondant
    if (key >= '0' && key <= '9' || key === '.') {
        targetButton = document.querySelector(`[data-number="${key}"]`);
    } else if (['+', '-', '×', '÷', '%'].includes(key)) {
        targetButton = document.querySelector(`[data-operator="${key}"]`);
    } else if (key === '=' || key === 'Enter') {
        targetButton = equalsButton;
    } else if (key === '⌫' || key === 'Backspace') {
        targetButton = deleteButton;
    } else if (key === 'AC' || key === 'Escape') {
        targetButton = allClearButton;
    }
    
    if (targetButton) {
        addButtonPressEffect(targetButton);
    }
}

// Initialisation de l'affichage
calculator.updateDisplay();

// Easter egg - Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (event) => {
    konamiCode.push(event.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        document.body.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'rainbowShift 2s ease infinite';
        
        // Ajouter l'animation CSS
        if (!document.querySelector('#rainbow-animation')) {
            const style = document.createElement('style');
            style.id = 'rainbow-animation';
            style.textContent = `
                @keyframes rainbowShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});