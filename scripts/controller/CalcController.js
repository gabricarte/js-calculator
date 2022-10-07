class CalcController {

    constructor() {
        //this faz referência ao próprio objeto dentro da classe 
        this._displayCalc = "0";
        this._currentDate;
        this.initialize();
    }

    initialize() {

    }

    //Getters and setters

    get displayCalc() {
        return this._displayCalc;
    }

    set displayCalc(value) {
        this.displayCalc = value;
    }

    get currentDate() {
        return this.currentDate;
    }

    set currentDate(value) {
        this.currentDate = value;
    }
}