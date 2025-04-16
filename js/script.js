'use strict';





const title = document.getElementsByTagName('h1')[0];
const buttonPlus = document.querySelector('.screen-btn');
const buttonCalculate = document.getElementsByClassName('handler_btn')[0];//рассчитать
const buttonReset = document.getElementsByClassName('handler_btn')[1];//сброс
const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number');
const typeRange = document.querySelector('.rollback input[type="range"]');//ползунок
const spanRangeValue = document.querySelector('.rollback .range-value');//Значение
const inputsTotalInput0 = document.getElementsByClassName('total-input')[0];
const inputsTotalInput1 = document.getElementsByClassName('total-input')[1];
const inputsTotalInput2 = document.getElementsByClassName('total-input')[2];
const inputsTotalInput3 = document.getElementsByClassName('total-input')[3];
const inputsTotalInput4 = document.getElementsByClassName('total-input')[4];
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
    appData.addTitle();
    buttonCalculate.addEventListener('click', appData.start); //когда кликаем рассчитать, то запускается функция 
    buttonPlus.addEventListener('click', appData.addScreenBlock);
    appData.checkBtnSelect();
    appData.addScreenBlockListeners();
    typeRange.addEventListener('input', appData.logger)

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
    appData.servicePercentPrice = 0;


    appData.addScreens();
    appData.addServices();
    appData.addPrices();
    appData.showResult();
  },

  showResult: function () {
    inputsTotalInput0.value = appData.screenPrice;
    inputsTotalInput2.value = appData.servicePricesPercent + appData.servicePricesNumber;
    inputsTotalInput3.value = appData.fullPrice;

  },

  addScreens: function () {
    blockScreen = document.querySelectorAll('.screen');
    blockScreen.forEach(function (screen, index) {
      const select = screen.querySelector('select'); //выбор не должен быть пустым
      const input = screen.querySelector('input'); //и ввод не должен быть пустым 
      const selectName = select.options[select.selectedIndex].textContent;
      appData.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value,
      })
    })
    console.log(appData.screens);
  },

  addServices: function () {
    otherItemsPercent.forEach(function (item) {

      const check = item.querySelector('input[type = checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type = text]');
      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value;
      }
    }
    );

    otherItemsNumber.forEach(function (item) {
      const check = item.querySelector('input[type = checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type = text]');
      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      }
    }
    );

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
    select.addEventListener('change', appData.checkBtnSelect);
    input.addEventListener('input', appData.checkBtnSelect);

    appData.checkBtnSelect();
  },



  checkBtnSelect: function () {
    blockScreen = document.querySelectorAll('.screen'); //обновляем состояние введенных элементов на момент функции
    let allScreensValid = true; //создаем переменную, со значением тру. по-умолчанию мы считаем, что пользователь все поля заполнил
    blockScreen.forEach(function (screen) {
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


  //отслеживаем изменения полей 
  addScreenBlockListeners: function () {
    blockScreen.forEach(function (screen) {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');

      select.addEventListener('change', function () {
        appData.checkBtnSelect();
      });
      input.addEventListener('input', function () {
        appData.checkBtnSelect();
      });
    });
  },

  //ползунок-определяем новую перменуую value , со значением события. обозначаем текстовое содержимое спана значением value. сохраняем полученное значение в виде числа в переменную rollback
  logger: function (event) {
    const value = event.target.value;
    spanRangeValue.textContent = value;
    appData.rollback = +value;
  },



  addPrices: function () {
    let totalScreenCount = 0;//создали новую перменную, которая подразумевает количество экранов ВСЕГО
    for (let screen of appData.screens) { //с помощью FOR OF мы перебираем массив appData.screens (за массив мы его приняли в самом начале дав ему [] ),  и в нашу новую переменную заносим значение из показателя count внутри screen
      appData.screenPrice += +screen.price;
      totalScreenCount += screen.count;
    }
    inputsTotalInput1.value = totalScreenCount;

    for (let key in appData.servicesNumber) {
      appData.servicePricesNumber += appData.servicesNumber[key]
    }

    for (let key in appData.servicesPercent) {
      appData.servicePricesPercent += (appData.screenPrice * (appData.servicesPercent[key] / 100))
    }

    appData.fullPrice = +appData.screenPrice + appData.servicePricesPercent + appData.servicePricesNumber;

    inputsTotalInput4.value = appData.fullPrice - (appData.fullPrice * (appData.rollback / 100));
  },
}



appData.init();

