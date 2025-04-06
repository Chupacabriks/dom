'use strict';



// Задение на DOM Урок 9
// Получить заголовок "Калькулятор верстки" через метод getElementsByTagName. (тэг h1, получить именно элемент, а не коллекцию)
const header = document.getElementsByTagName('h1')[0];
// console.log(header.textContent);

// Получить кнопки "Рассчитать" и "Сброс" через метод getElementsByClassName. (класс handler_btn)
const buttonCalculateAndReset = document.getElementsByClassName('handler_btn');
// console.log(buttonCalculateAndReset);


// Получить кнопку "+" под выпадающим списком через метод querySelector. (класс screen-btn)
const buttonPlus = document.querySelector('.screen-btn');
// console.log(buttonPlus);


// Получить все элементы с классом  в две разные переменные. В первую элементы у которых так же присутствует класс percent, во вторую элементы у которых так же присутствует класс number через метод querySelectorAll.
const otherItems1 = document.querySelectorAll('.other-items.percent');
const otherItems2 = document.querySelectorAll('.other-items.number');
// console.log(otherItems1);
// console.log(otherItems2);

// Получить input type=range через его родителя с классом rollback одним запросом через метод querySelector.
const typeRange = document.querySelector('.rollback input[type="range"]');
// console.log(typeRange);


// Получить span с классом range-value через его родителя с классом rollback одним запросом через метод querySelector.
const spanRangeValue = document.querySelector('.rollback .range-value');
// console.log(spanRangeValue);

// ????Получить все инпуты с классом total-input справа через метод getElementsByClassName. (класс total-input, получить именно элементы, а не коллекции)
const inputsTotalInput = document.getElementsByClassName('total-input');


// Получить все блоки с классом screen в изменяемую переменную ( let ) через метод querySelectorAll (далее мы будем переопределять ее значение) 
let blockScreen = document.querySelectorAll('.screen');





const appData = {
  title: '',
  adaptive: true,
  screenPrice: 0,
  fullPrice: 0,
  allServicePrices: 0,
  servicePercentPrice: 0,
  rollback: 10,
  services: {}, // по-умолчанию объект{}
  screens: [], // массив[]

  start: function () {
    this.asking(),
      this.getAllServicePrices(),
      this.getFullPrice(),
      this.getRollBackMessage(),
      this.getServicePercentPrices(),
      this.getTitle(),
      this.logger()
  },

  asking: function () {
    do {
      this.title = prompt('Как называется Ваш проект?', 'Калькулятор верстки');
      // Удаляем пробелы в начале и конце
      const trimTitle = this.title.trim();
      // Проверка на отмену ввода (если пользователь нажал "Отмена")
      if (this.title === null || trimTitle === '') {
        alert('Проект без названия')
        this.title = "Без названия";
        break;
      };

      // Проверка, что строка не состоит только из цифр
      if (/^[\d\s]+$/.test(trimTitle)) {
        alert('Название не может содержать только цифры');
        continue; // Переходим к следующей итерации цикла
      }

      // Если все проверки пройдены - сохраняем и выходим из цикла
      this.title = trimTitle;
      break;

    } while (true); // Бесконечный цикл, пока не получим корректный ввод



    for (let i = 0; i < 2; i++) {
      let name;
      do {
        name = prompt('Какие типы экранов нужно разработать?');
        if (name === null || name.trim() === '') {
          alert('Введите тип экрана');
        }
        if (/^[\d\s]+$/.test(name.trim())) {
          alert('Строка не может содержать только цифры');
          continue;
        }
      } while (name === null || name.trim() === '' || /^[\d\s]+$/.test(name.trim()));

      let price = 0;
      do {
        price = prompt('Сколько будет стоить данная работа?');
        if (price !== null) {
          price = price.trim();
        }
      } while (!this.isNumber(price));

      this.screens.push({ id: i, name: name, price: price }); // метод.push для работы с массивами. добавляет элемент в конец массива. с помощью {} сохраняем именно объекта со свойствами id name price
    }


    //УСЛОЖНЕННОЕ ЗАДАНИЕ
    this.screenPrice = this.screens.reduce(function (sum, screen) {
      return sum + Number(screen.price);
    }, 0); //через метод .reduce выводим сумму экранов


    for (let i = 0; i < 2; i++) {
      let name;
      let addService = true;//создаем новую переменную по-умолчанию тру, нужна, чтобы создать новое условие для вывода цены. если эта переменная станет фолс, то вопрос о цене не будет задан
      do {
        name = prompt('Какой дополнительный тип услуги нужен?');
        if (name === null || name.trim() === '') {
          alert('Дополнительная услуга не требуется');
          addService = false;
          break
        }
        if (/^[\d\s]+$/.test(name.trim())) {
          alert('Строка не может содержать только цифры');
          continue;
        }
      } while (/^[\d\s]+$/.test(name.trim()));

      if (!addService) { //в этом случае переменная не равна тру, т е мы пропускаем вопрос о цене
        continue;
      }


      let price = 0;

      do {
        price = prompt('Сколько это будет стоить?');
        if (price === null || price.trim() === '') {
          price = 0;
          break;
        }
        price = price.trim();
      } while (!this.isNumber(price));


      //УСЛОЖНЕННОЕ ЗАДАНИЕ
      let key = name;//создаем переменную key, которая содержит название, т е ответ на вопрос о типе услуг
      let counter = 1; //создаем переменную , содержащую окончание. по-умолчанию 1 
      while (this.services.hasOwnProperty(key)) { //цикл проверяет есть ли уже в this.servicess ключ name, который ввел пользователь. если меод hasOwnProperty находит совпадение, то ключ меняется на - название + каунт, который увеличивается каждый раз на единицу ++
        key = `${name}_${counter}`;
        counter++;
      }

      this.services[name] = +price; //если проверка на число и на пустую строку или отмену пройдена в do while, то значение сохраняется в объекте this.services с ключом name. например, this.services = {"дизайн": 1000}. но, если оба раза в типе услуг записать одно и то же значение, то сохранится только одно - последнее.
    }

    this.adaptive = confirm('Нужен ли адаптив на сайте?');

  },

  //проверка числа
  isNumber: function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },

  getTitle: function () {
    this.title = this.title.trim()[0].toUpperCase() + this.title.trim().slice(1).toLowerCase();
  },

  getAllServicePrices: function () {
    this.allServicePrices = 0;
    for (let key in this.services) {
      this.allServicePrices += this.services[key]
    }
  },

  getFullPrice: function () {
    this.fullPrice = +this.screenPrice + this.allServicePrices;
  },

  getServicePercentPrices: function () {
    this.servicePercentPrice = this.fullPrice - (this.fullPrice * (this.rollback / 100));
  },

  getRollBackMessage: function (price) {
    if (price >= 30000) {
      return 'Даем скидку в 10%'
    } else if (price >= 15000 && price < 30000) {
      return 'Даем скидку в 5%'
    } else if (price < 15000 && price >= 0) {
      return 'Скидка не предусмотрена'
    } else if (price < 0) {
      return 'Что-то пошло не так'
    }
  },

  logger: function () {
    console.log(this.getRollBackMessage(this.fullPrice)); //скидка пользователю 
    console.log('Итоговая стоимость: ' + this.servicePercentPrice);//итоговая стоимость
    console.log(this.screens);
    console.log('Общая стоимость экранов:' + this.screenPrice);

    // for (let key in this) {
    //   console.log("Ключ:" + key + "Значение:" + this[key])
    // }
  }
};

appData.start();

