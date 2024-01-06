// preload.js
const { ipcRenderer, contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const printButton = document.getElementById('printButton');
    const executeMyFunction = document.getElementById('executeMyFunction');

    if (executeMyFunction) {
        executeMyFunction.addEventListener('click', () => {
            console.log('111')
            ipcRenderer.send('execute');
        });
    }
      
    if (printButton) {
      printButton.addEventListener('click', () => {
        ipcRenderer.send('print');
      });
    }
  });
