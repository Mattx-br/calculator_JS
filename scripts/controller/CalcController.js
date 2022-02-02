class CalcController {
    constructor() {
        // if an var beggins with an undeline '_' is supposed to be a private attribute
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate = new Date();

        this.initialize();
        this.initButtonsEvents();
        
    }

    initialize() {
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
    }

    /**
    * This function aims to get an DOM element or an array of then add
    * events into it
    * 
    * Made by Tony
    */
    addEventListenerAll(element, events, fn)
    {
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    }

    clearAll()
    {
        
    }

    execBtn(buttonValue)
    {   
        switch(buttonValue)
        {
            case 'ac':
                this.clearAll();
                break;
            
        }
    }

    initButtonsEvents()
    {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', (e) =>{
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e =>{
                btn.style.cursor = "pointer";
            });
        });
    }

    setDisplayDateTime()
    {
        this.displayDate = this._currentDate.toLocaleDateString(this._locale, { 
            // these can be changed to other formats
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric"});
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }



    get displayTime() { return this._timeEl.innerHTML; }
    set displayTime(value) { return this._timeEl.innerHTML = value; }

    get displayDate() { return this._dateEl.innerHTML; }
    set displayDate(value) { return this._dateEl.innerHTML = value; }

    get displayCalc() { return this._displayCalcEl.innerHTML; }
    set displayCalc(value) { this._displayCalcEl.innerHTML = value; }

    get currentDate() { return new Date(); }
    set currentDate(value) { this._currentDate = value; }


}