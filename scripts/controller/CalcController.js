class CalcController {

    constructor() {

        // Atributos 
        this._lastOperator = '';
        this._lastNumber = '';
        this.locale = 'pt-BR'
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._operation = [];
        this._audioOnOff = false;
        this._audio = new Audio('click.mp3'); //API de áudio 

        //Métodos 
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    initialize() {

        this.setDisplayDateTime()

        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio(); //toggle funciona como um interruptor, tá ligado liga, desligado desliga.

            })

        })

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff //(this._audioOnOff) ? false : true;

    }

    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    copyToClipboard() {

        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input); //"appendChild" - O body retém o input como filho. 
        input.select();
        document.execCommand("Copy");

        input.remove();

    }


    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text'); // 'Text' é o tipo de informação que estamos trazendo  

            this.displayCalc = parseFloat(text);

        });

    }

    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    // Função do AC, apaga a expressão
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    // função do CE, que apaga a última entrada
    cancelEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    setError() {
        this.displayCalc = "Error";
    }

    // Busca o valor no array, se achar retorna o índice
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

    getResult() {

        try {
            return eval(this._operation.join(""));
        } catch (e) {

            setTimeout(() => {
                this.setError();
            }, 1); // após 1 milissegundo 

        }
    }

    // Calcula em pares, para mostrar o resultado no display 
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

        //Caso o último seja porcentagem
        if (last == '%') {

            result /= 100; // result = result / 100;

            this._operation = [result];
        }

        else {
            this._operation = [result];
            if (last) this._operation.push(last); // Só adiciona o last se ele realmente existir
        }

        this.setLastNumberToDisplay();
    }

    //Se não passar nenhum parâmetro, por padrão, procura por um operador. 
    //Caso passe um parâmetro, um número
    getLastItem(isOperator = true) {

        let lastItem;

        //Percorre o array de trás para frente
        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber; //If ternário. 
            // Sintaxe: condição ? faça isso : senão isso 

        }

        return lastItem;

    }

    //Adiciona a operação no array 
    pushOperation(value) {
        this._operation.push(value);


        if (this._operation.length > 3) {
            this.calc();

        }
    }

    //Adiciona o último do array no display
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        // Verifica se o último número é vazio, se for undefined o resultado do "!" é falso. 
        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    //Adiciona uma operação no array
    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            //String

            if (this.isOperator(value)) {

                this.setLastOperation(value);

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
                this.setLastOperation(newValue);

                // Atualizar display 
                this.setLastNumberToDisplay();
            }

        }
    }

    addDot() {

        let lastOperation = this.getLastOperation();

        // Se a última operação for uma string e já tiver um ponto nela, para a execução.  
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) { // Se for um operador ou se não tiver nada (undefined)
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }


        this.setLastNumberToDisplay();

    }

    execBtn(value) {

        this.playAudio();

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
                this.calc();

                break;
            case 'ponto':
                this.addDot();
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
            case '9': this.addOperation(parseInt(value));
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

        });
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

    //Eventos de teclado
    initKeyboard() {

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.cancelEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter': //igual
                case '=':
                    this.calc();

                    break;
                case '.':
                case ',':
                    this.addDot();
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
                case '9': this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard(); //If abreviado 
                    break;

            }
        })

    }

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

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}