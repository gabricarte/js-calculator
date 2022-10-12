class CalcController {

    constructor() {

        // Declaração de atributos 
        this.locale = 'pt-BR' // Atributo que é utilizado em várias partes do código. 
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        //Chamada de métodos
        this.initialize();
        this.initButtonsEvents();

    }

    // Tudo que eu quiser que aconteça assim que começar o construtor:
    initialize() {

        this.setDisplayDateTime()

        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

    }

    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }


    // Método EventListener que suporta vários eventos do mouse

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        })
    }


    // Eventos do mouse

    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g"); //Pega todos elementos g que são filhos do id button e filhos de parts


        //para cada botão(btn) que o forEach encontrar na lista de botãos(buttons), ele executa o código da arrow function. A função retorna no console somente o nome da classe, sem o "btn"  

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {
                console.log(btn.className.baseVal.replace("btn-", ""));

            })

            // Para modificar o cursor e indicar que é clicável:
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer"
            });
        });



    };


    //Getters and setters. Métodos acessores que retornam atributos privados

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }


    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }


    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}