const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');

let mainWindow;
app.on("ready", () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // узнает размер экрана

  // Создание окна браузера.
  mainWindow = new BrowserWindow({
    width         : width,
    height        : height,
    transparent   : true,                         // Это свойство делает фон окна прозрачным
    frame         : false,                        // Если вы хотите убрать стандартные кнопки закрытия и минимизации
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js') // Файл доступный на всех страницах проекта (что-то вроде глобального объекта)
    }
  })

  // добавление файла разметки в приложение десктопного.
  mainWindow.loadFile('./dist/index.html');
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}) 


//ожидает, пока приложение полностью инициализируется
app.whenReady().then(() => {
  // Слушаем событие от React
  ipcMain.on('message-from-react', (event, data) => {
    console.log(data);
    mainWindow.webContents.send('message-from-electron', 'message-from-electron');
  });

  //определение устройства на котором запущено
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });
  
  //активация приложения кликом на иконку
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});