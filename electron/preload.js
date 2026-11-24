// 只暴露三个最小能力给页面，不开放 Node
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petDesktop', {
  isDesktop: true,
  openFloat: () => ipcRenderer.invoke('petpal:float'),
  openHome: () => ipcRenderer.invoke('petpal:home'),
  quitFloat: () => ipcRenderer.invoke('petpal:quit-float'),
});
