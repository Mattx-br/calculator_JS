class CalcController {
    constructor() {
        // if an var beggins with an undeline '_' is supposed to be a private attribute

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate = new Date();

        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();

    }

    copyToClipBoard() {

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    pasteFromClipBoard() {

        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');
            // this.displayCalc = parseFloat(text);
            this.pushOperation(text);
            this.displayCalc = text;
        });


    }

    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();


        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {

                this.toggleAudio();
                // this._audioOnOff ? console.log('playing') : console.log('not playing');
            });
        });
    }

    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio() {
        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyBoard() {

        document.addEventListener('keyup', event => {

            this.playAudio();

            switch (event.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backscape':
                    this.cancelEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(event.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(event.key));
                    break;
                case 'c':
                    this.copyToClipBoard();
                    breakv
                case 'c':
                    this.pasteFromClipBoard();
                    break;
            }
        });
    }

    /**
     * This function aims to get an DOM element or an array of then add
     * events into it
     */
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    // ============= OPERATION METHODS =============

    clearAll() {
        this._operation = [];
        this._lastOperator = '';
        this._lastNumber = '';

        this.setLastNumberToDisplay();
    }
    cancelEntry() {
        this._operation.pop();

        this.setLastNumberToDisplay();

    }
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult() {
        try {
            return eval(this._operation.join(""));
        } catch (error) {

            setTimeout(() => {
                this.setError();
            }, 1);
        }
    }



    calc() {
        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {
            last = this._operation.pop();

            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }



    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem) {
            lastItem = isOperator ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (!this.isOperator(this._operation[i])) {
                lastNumber = this._operation[i];
                break;
            }

        }

        if (!lastNumber) lastNumber = 0;
        try {
            let formatting = lastNumber.length > 10 ? lastNumber.toExponential(2) : this.displayCalc = lastNumber;
            return formatting;
        } catch (e) {
            return;
        }
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) { //String 
            if (this.isOperator(value)) {

                this.setLastOperation(value);

            } else {

                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else { // Number

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                // update display
                this.setLastNumberToDisplay();
            }


        }

    }

    setError() {
        this.displayCalc = 'Error';
    }

    addDot() {
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === typeof 'string' && lastOperation.split('').indexOf('.') > -1) { return; }

        // When the last item is not a number and operator neither
        if (this.isOperator(lastOperation) || !lastOperation && lastOperation !== 0) {
            this.pushOperation('0.');
        } else {
            // if the last item is a number
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }


    // ============= END OF OPERATION METHODS =============

    execBtn(buttonValue) {

        this.playAudio();
        switch (buttonValue) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(buttonValue));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', (e) => {
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    setDisplayDateTime() {
        this.displayDate = this._currentDate.toLocaleDateString(this._locale, {
            // these can be changed to other formats
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }



    get displayTime() { return this._timeEl.innerHTML; }
    set displayTime(value) { return this._timeEl.innerHTML = value; }

    get displayDate() { return this._dateEl.innerHTML; }
    set displayDate(value) { return this._dateEl.innerHTML = value; }

    get displayCalc() { return this._displayCalcEl.innerHTML; }
    set displayCalc(value) {

        if (value.toString().length >= 10 || value == 2 / 0) {
            // this.roundToTwo(value);
            this.setError();
            // Number(value);
            // value.toExponential(2);
            return;
        }

        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() { return new Date(); }
    set currentDate(value) { this._currentDate = value; }


}