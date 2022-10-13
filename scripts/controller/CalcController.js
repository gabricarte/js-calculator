class CalcController {

    constructor() {

        // Atributos 
        this.locale = 'pt-BR' // Atributo que é utilizado em várias partes do código. 
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._operation = []; // Guarda a expressão 

        //Métodos
        this.initialize();
        this.initButtonsEvents();

    }

    // Executar ao iniciar o construtor
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

    // Função do ac, apaga a expressão
    clearAll() {
        this._operation = [];
    }

    // função do ce, que apaga a última entrada
    cancelEntry() {
        this._operation.pop();
    }

    setError() {
        this.displayCalc = "Error";
    }

    // Busca o valor nesse array, se achar retorna o índice
    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1); // Retorna se é verdadeiro ou falso
    };

    // Altera o último termo do array
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }
    // Captura a última operação (o que está na última posição) do array 
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    // Calcula em pares, para mostrar o resultado no display 
    calc() {

        let last = this._operation.pop();

        let result = eval(this._operation.join(""));

        this._operation = [result, last];

        this.setLastNumberToDisplay();
    }


    //Adicionar a operação no array 
    pushOperation(value) {
        this._operation.push(value);


        if (this._operation.length > 3) {
            this.calc();

        }
    }

    //Adiciona o último número digitado no display
    setLastNumberToDisplay() {

        let lastNumber;

        //Percorre o array de trás para frente
        for (let i = this._operation.length - 1; i >= 0; i--) {

            // Se não for um operador, significa que achei o último número digitado
            if (!this.isOperator(this._operation[i])) {
                lastNumber = this._operation[i];
                break;
            }
        }

        this.displayCalc = lastNumber;

    }



    //Método para adicionar uma operação no array
    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            //String

            if (this.isOperator(value)) {
                this.setLastOperation(value);

            } else if (isNaN(value)) {
                console.log('Outra coisa', value);

            } else // Primeiro termo do array
            {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {

            // Number

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                // Atualizar display 
                this.setLastNumberToDisplay();
            }

        }
    }


    execBtn(value) {

        switch (value) {
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
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.addOperation('=');

                break;
            case 'ponto':
                this.addOperation('.');
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
            case '9': this.addOperation(parseInt(value)); //Convertendo para int 
                break;
            default:
                this.setError();
                break;


        }
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

                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn); //Chama o switchcase

            })

            // Para modificar o cursor e indicar que é clicável:
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer"
            });
        }
        );
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