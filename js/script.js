'use strict';





const title = document.getElementsByTagName('h1')[0];
const buttonPlus = document.querySelector('.screen-btn');
const buttonCalculate = document.getElementsByClassName('handler_btn')[0];//рассчитать
const buttonReset = document.getElementsByClassName('handler_btn')[1];//сброс
const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number');
const typeRange = document.querySelector('.rollback input[type="range"]');//ползунок
const spanRangeValue = document.querySelector('.rollback .range-value');//Значение
let inputsTotalInput0 = document.getElementsByClassName('total-input')[0];
let inputsTotalInput1 = document.getElementsByClassName('total-input')[1];
let inputsTotalInput2 = document.getElementsByClassName('total-input')[2];
let inputsTotalInput3 = document.getElementsByClassName('total-input')[3];
let inputsTotalInput4 = document.getElementsByClassName('total-input')[4];
let blockScreen = document.querySelectorAll('.screen');





const appData = {
  title: '',
  adaptive: true,
  screenPrice: 0,
  fullPrice: 0,
  servicePricesPercent: 0,
  servicePricesNumber: 0,
  servicePercentPrice: 0,
  rollback: 0,
  servicesPercent: {}, // по-умолчанию объект{}
  servicesNumber: {},
  screens: [], // массив[]

  init: function () {
    this.addTitle();
    buttonCalculate.addEventListener('click', this.start); //когда кликаем рассчитать, то запускается функция 
    buttonPlus.addEventListener('click', this.addScreenBlock);
    this.checkBtnSelect();
    this.addScreenBlockListeners();
    typeRange.addEventListener('input', this.logger);
    this.btnReplace(false);//при запуске функция имеет значение ложь, т е кнопка не меняется. остается рассчитать
    buttonReset.addEventListener('click', () => this.reset());

  },

  addTitle: function () {
    document.title = title.textContent;
  },

  start: function () {

    appData.screens = [],
      appData.servicesPercent = {};
    appData.servicesNumber = {};
    appData.screenPrice = 0;
    appData.fullPrice = 0;
    appData.servicePricesPercent = 0;
    appData.servicePricesNumber = 0;
    appData.servicePercentPrice = 0;//нельзя в this

    appData.addScreens();
    appData.addServices();
    appData.addPrices();
    appData.showResult();//нельзя в this
    appData.blockAll();//ф для блока ввода
    appData.btnReplace(true);//после рассчетов значение тру - замена кнопки
  },

  showResult: function () {
    inputsTotalInput0.value = this.screenPrice;
    inputsTotalInput2.value = this.servicePricesPercent + this.servicePricesNumber;
    inputsTotalInput3.value = this.fullPrice;

  },

  addScreens: function () {
    blockScreen = document.querySelectorAll('.screen');
    blockScreen.forEach((screen, index) => {
      const select = screen.querySelector('select'); //выбор не должен быть пустым
      const input = screen.querySelector('input'); //и ввод не должен быть пустым 
      const selectName = select.options[select.selectedIndex].textContent;
      this.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value,
      })
    })
  },

  addServices: function () {
    otherItemsPercent.forEach((item) => {

      const check = item.querySelector('input[type = checkbox]'); //кнопка на галочку в допах 
      const label = item.querySelector('label');
      const input = item.querySelector('input[type = text]');
      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    }
    );

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector('input[type = checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type = text]');
      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    }
    );

  },

  //функция для блока всех способов введения информации (14 задание)
  blockAll: function () {
    const allTextInputs = document.querySelectorAll("input[type='text'], select");
    allTextInputs.forEach(input => {
      input.disabled = true;
    });

    const allCheckBoxes = document.querySelectorAll("input[type='checkbox']");
    allCheckBoxes.forEach(checkbox => {
      checkbox.disabled = true;
    });

    typeRange.disabled = true;
    buttonPlus.disabled = true;
  },



  //добавление нового блока для выбора экранов
  addScreenBlock: function () {
    const cloneScreen = blockScreen[0].cloneNode(true);
    const lastScreen = blockScreen[blockScreen.length - 1];
    lastScreen.after(cloneScreen);
    blockScreen = document.querySelectorAll('.screen');
    cloneScreen.querySelector('select').value = '';
    cloneScreen.querySelector('input').value = '';

    //делаем проверку для каждого добоавленного блока
    const select = cloneScreen.querySelector('select');
    const input = cloneScreen.querySelector('input');
    select.addEventListener('change', appData.checkBtnSelect);//нельзя ментья на this
    input.addEventListener('input', appData.checkBtnSelect);//нельзя ментья на this

    appData.checkBtnSelect();//нельзя ментья на this, т к addscreenblock прослушивается
  },



  checkBtnSelect: function () {
    blockScreen = document.querySelectorAll('.screen'); //обновляем состояние введенных элементов на момент функции
    let allScreensValid = true; //создаем переменную, со значением тру. по-умолчанию мы считаем, что пользователь все поля заполнил
    blockScreen.forEach((screen) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      //ставим условие с проверкой для каждого блока , если не заполнено поле с выбором экрана или не введено их количество, то переменная меняет свое значение на фолс
      if (!select.value || !input.value) {
        allScreensValid = false;
      }
    });
    buttonCalculate.disabled = !allScreensValid;

    //чтобы пользователю было понятнее - меняем цвет кнопки на серый и меняем курсор, если кнопка деактивирована
    if (allScreensValid === false) {
      buttonCalculate.style.backgroundColor = 'grey';
      buttonCalculate.style.cursor = 'not-allowed';
    } else { //если кнопка активна, то все оставляем 
      buttonCalculate.style.backgroundColor = '#A52A2A';
      buttonCalculate.style.cursor = 'pointer';
    }

  },

  //функция на замену кнопки рассчитать - сброс (14 задание)
  btnReplace: function (showReset) {
    if (showReset) {
      buttonCalculate.style.display = 'none';
      buttonReset.style.display = 'block';
      buttonPlus.disabled = true;
    } else {
      buttonCalculate.style.display = 'block';
      buttonReset.style.display = 'none';
      buttonPlus.disabled = false;
    };
  }, //по-умолчанию значение ложь


  //что делает кнопка сброс (отменяет недоступность кнопок,  )
  reset: function () {
    appData.screenPrice = 0;
    appData.fullPrice = 0;
    appData.servicePricesPercent = 0;
    appData.servicePricesNumber = 0;
    appData.servicePercentPrice = 0;
    appData.screens = [],
      appData.servicesPercent = {};
    appData.servicesNumber = {};

    const screens = document.querySelectorAll('.screen');
    for (let i = 1;
      i < screens.length;
      i++) {
      screens[i].remove();
    };

    const firstScreen = document.querySelector('.screen');
    firstScreen.querySelector('select').value = '';
    firstScreen.querySelector('input').value = '';

    blockScreen = document.querySelectorAll('.screen');
    blockScreen.forEach((screen) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      input.disabled = false;
      select.disabled = false;
    });

    const allCheckboxes = document.querySelectorAll("input[type='checkbox']");
    allCheckboxes.forEach(checkbox => {
      checkbox.disabled = false;//по-умолчанию все вводы разблокированы
      checkbox.checked = false;
    });

    typeRange.value = 0; //ползунок на 0
    spanRangeValue.textContent = '0';
    typeRange.disabled = false;

    document.querySelectorAll('.total-input').forEach(input => input.value = '');//очищаем поля сумм

    buttonCalculate.style.display = 'block';
    buttonReset.style.display = 'none';
    buttonPlus.disabled = false;
    this.btnReplace(false);
  },


  //отслеживаем изменения полей 
  addScreenBlockListeners: function () {
    blockScreen.forEach((screen) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');

      select.addEventListener('change', () => {
        appData.checkBtnSelect();
      });
      input.addEventListener('input', () => {
        appData.checkBtnSelect();
      });
    });//нельзя менять appdata на this, т к стрелочная функция
  },

  //ползунок-определяем новую перменуую value , со значением события. обозначаем текстовое содержимое спана значением value. сохраняем полученное значение в виде числа в переменную rollback
  logger: function (event) {
    const value = event.target.value;
    spanRangeValue.textContent = value;
    appData.rollback = +value;//нельзя менять на this, т к есть прослушка у logger
  },


  //можем заменить на this, так как addPrices вызывактся черзе appdata, нет стерлочной функции, нет прослушки
  addPrices: function () {
    let totalScreenCount = 0;//создали новую перменную, которая подразумевает количество экранов ВСЕГО
    for (let screen of this.screens) { //с помощью FOR OF мы перебираем массив appData.screens (за массив мы его приняли в самом начале дав ему [] ),  и в нашу новую переменную заносим значение из показателя count внутри screen
      this.screenPrice += +screen.price;
      totalScreenCount += screen.count;
    }
    inputsTotalInput1.value = totalScreenCount;

    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key]
    }

    for (let key in this.servicesPercent) {
      this.servicePricesPercent += (this.screenPrice * (this.servicesPercent[key] / 100))
    }

    this.fullPrice = +this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;

    inputsTotalInput4.value = this.fullPrice - (this.fullPrice * (this.rollback / 100));
  },//можно менять appdata на this, т к нет стрелочной функции, нет прослушки, addprice ссылается на appdata
};



appData.init();

