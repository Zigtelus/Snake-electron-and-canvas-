import { useEffect, useRef, useState } from "react";
import _ from 'lodash';
import { randomNumber } from "../utils.ts/randomNumber";

export const Canvas = ()=> {

  /************* ИЗМЕНЕНИЕ РАЗМЕР ЭКРАНА *************/
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      // Удаляем слушателя событий при размонтировании компонента
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Пустой массив зависимостей означает, что эффект выполняется только при монтировании и размонтировании
  /***************************************************/


  // данная функция создана просто для проверки возможности отправить сообщение с реакте в електрон и обратно
  function electron() {
    if (window.require) {
      const ipcRenderer = window.require('electron').ipcRenderer;
      // Отправляем сообщение в Electron
      ipcRenderer.send('message-from-react', 'message-from-react');
      ipcRenderer.on('message-from-electron', (event, data)=> {
        console.log(data)
      })
    }
  };

  const canvasRef = useRef(null);
  const [state, setState] = useState({
    element: {
      x: 100,
      y: 100,
      width: 10,
      height: 100
    },

    
    // ЗМЕЯ
    snake: {
      // Расположение головы
      head: {
        x: 100,
        y: 100,
        color: 'black'
      },
      // Размер одного елемента тела
      element: {
        width: 10,
        height: 10
      },
      // Все тело змеи (кроме головы)
      body: [
        {x: 100, y: 100, color: 'red'},
        {x: 100, y: 100, color: 'red'},
        {x: 100, y: 100, color: 'red'},
      ]
    },


    // ЕДА ДЛЯ ЗМЕИ
    food: {
      width: 10,
      height: 10,
      x: 109,
      y: 200,
      color: 'blue'
    },


    // ИГРОВОЕ ПОЛЕ
    field: {
      width: screenSize.width - 20,
      height: screenSize.height - 25
    },
    // speed: 10,
    run: "bottom"
  });




  /************** ЛОГИКА ДВИЖЕНИЯ ЗМЕИ ***************/
  useEffect(() => {
    let sideRight,
        sideLeft,
        sideTop,
        sideBottom;

    const animate = () => {
      setState((prevState: any) => {
        // Глубокое клонирование объекта (лучше делать через lodash, но что бы не забывать от какого гемороя он может спасать, решил оставить)
        let newState = {
          ...prevState,
          snake: {
            ...prevState.snake,
            head: {
              ...prevState.snake.head
            },
            body: [
              ...prevState.snake.body
            ]
          },
          food: {...prevState.food}
        };

        const {head}  = newState.snake;
        const {run}   = newState;


        /****** ПЕРЕДВИЖЕНИЕ ТЕЛА ЗМЕИ (кроме головы) ******/
        // необходимо, что бы в map передать координаты каждого елемента тела
        let bodySnake = newState.snake.body;
        
        // глубокое клонирование через lodash
        const cloneBodySnake = _.cloneDeep(newState.snake.body);
        newState.snake.body = cloneBodySnake.map((elem, index, array) => {
          /*
            так как голова змеи отдельно от тела, то первой части тела (НЕ ГОЛОВА) 
            задается направление от головы, а всем последующим частям задается направление от 
            передиидущего елемента
          */
          if (index == 0) {
            elem.x = head.x;
            elem.y = head.y;
          } else {
            // если тут вместо bodySnake использовать аргумент "array" или "cloneBodySnake", то всем елементам тела присваивается одно значение из-за того, что map передает ссылки объектов
            elem.x = bodySnake[index-1].x;
            elem.y = bodySnake[index-1].y;
          }

          return elem;
        })
        /***************************************************/

        /**** ВЫБОР В КАКУЮ СТОРОНУ ПОВОРАЧИВАТЬ ГОЛОВУ ****/
        switch (run) {
          case "right":
            head.x += 10;
            break;
          case "left":
            head.x -= 10;
            break;
          case "top":
            head.y -= 10;
            break;
          case "bottom":
            head.y += 10;
            break;
        }
        /***************************************************/


        /************** УСЛОВИЯ ДЛЯ ОСТАНОВКИ *************/
        {
          const {field} = newState;
          const {head, element} = newState.snake;

          sideRight = head.x + element.width;
          sideLeft = 0;
  
          sideTop = 0;
          sideBottom = head.y + element.height;

          // stop right
          if (sideRight === field.width) {
            clearInterval(intervalId)
          }
    
          // stop left
          if (sideLeft === head.x) {
            clearInterval(intervalId)
          }
    
          // stop top
          if (sideTop === head.y) {
            clearInterval(intervalId)
          }
    
          // stop bottom
          if (sideBottom === field.height) {
            clearInterval(intervalId)
          }
        };
        /***************************************************/

        /***********УСЛОВИЯ ДЛЯ СЪЕДАНИЯ ЕЛЕМЕНТА***********/
        const y =
          newState.snake.head.y > (newState.food.y - newState.food.height) 
          &&
          newState.snake.head.y < (newState.food.y + newState.food.height);

        const x =
          newState.snake.head.x > (newState.food.x - newState.food.width) 
          &&
          newState.snake.head.x < (newState.food.x + newState.food.width);

        if (y && x) {
          newState.snake.body.push({color: newState.food.color});

          // генерация расположения новой еды
          const maxY = newState.field.height - newState.food.height;
          const maxX = newState.field.width - newState.food.width;
          newState.food.y = randomNumber(0, maxY);
          newState.food.x = randomNumber(0, maxX);
        }

        /***************************************************/


        return newState;
      });
    };
    const intervalId = setInterval(animate, 100);

    // Очищает setInterval после размонтирования компоненты
    return () => clearInterval(intervalId);
  });
  /***************************************************/


  /**************** ОТРИСОВКА КАНВАС *****************/
  useEffect(() => {
    const canvas = canvasRef.current;

    //метод возвращает объект CanvasRenderingContext2D, который предоставляет API для рисования на канвасе.
    const ctx = canvas.getContext('2d'); 
    
    // Очищаем канвас перед каждым рендером
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    
    /***************** ОТРИСОВКА ЗМЕИ ******************/
    const {element} = state.snake;

    // отрисовка головы
    const {head} = state.snake;
    ctx.fillStyle = head.color;
    ctx.fillRect(head.x, head.y, element.width, element.height);

    // отрисовка тела
    const snake = [...state.snake.body];
    while(!!snake.length) {
      const item = snake.shift();
      ctx.fillStyle = item.color;
      ctx.fillRect(item.x, item.y, element.width, element.height);
    }
    /***************************************************/

    // отрисовка еды
    const {food} = state;
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, food.width, food.height);

  }, [state.snake.head]);
  /***************************************************/

  const {width, height} = state.field;
  return <>
    <canvas 
      style     = {{border: '1px solid black', background: 'black'}} 
      ref       = {canvasRef} 
      width     = {width} 
      height    = {height} 
      tabIndex  = {0}  // Добавляем атрибут tabIndex
      onKeyDown = {_changeWay}
    ></canvas>
  </>

  function _changeWay(e) {
    electron()
    switch (e.key) {
      case "ArrowRight":
        setState((prevState) => ({...prevState, run: "right"}))
        break;
      case "ArrowLeft":
        setState((prevState) => ({...prevState, run: "left"}))
        break;
      case "ArrowDown":
        setState((prevState) => ({...prevState, run: "bottom"}))
        break;
      case "ArrowUp":
        setState((prevState) => ({...prevState, run: "top"}))
        break;
    }
  }
}