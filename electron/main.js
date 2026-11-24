// 小小陪伴 · 桌面壳
// 主窗口 = 完整游戏（mobile.html）；悬浮窗 = 同一份页面的 ?float=1 模式，
// 无边框、透明、置顶、可拖动，只显示两只宠物 + 迷你操作条。
// 两个窗口同源，共用 localStorage 里的同一份存档，进度互通。

const { app, BrowserWindow, globalShortcut, Menu, screen, ipcMain } = require('electron');
const path = require('path');

const PAGE = path.join(__dirname, '..', 'mobile.html');
const PRELOAD = path.join(__dirname, 'preload.js');

let mainWin = null;
let floatWin = null;

function createMain() {
  mainWin = new BrowserWindow({
    width: 430,
    height: 820,
    minWidth: 360,
    minHeight: 600,
    title: '小小陪伴',
    backgroundColor: '#f3e6cf',
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });
  mainWin.loadFile(PAGE);
  mainWin.on('closed', () => { mainWin = null; });
  return mainWin;
}

function createFloat() {
  if (floatWin) { floatWin.show(); floatWin.focus(); return floatWin; }

  const { workArea } = screen.getPrimaryDisplay();
  const W = 286, H = 258;

  floatWin = new BrowserWindow({
    width: W,
    height: H,
    x: workArea.x + workArea.width - W - 24,
    y: workArea.y + workArea.height - H - 24,
    transparent: true,
    frame: false,
    resizable: false,
    movable: true,
    hasShadow: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    fullscreenable: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  floatWin.setAlwaysOnTop(true, 'screen-saver');
  floatWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  floatWin.loadFile(PAGE, { query: { float: '1' } });

  floatWin.on('closed', () => { floatWin = null; });
  console.log('[float] bounds', floatWin.getBounds(), 'alwaysOnTop', floatWin.isAlwaysOnTop());
  return floatWin;
}

function toggleFloat() {
  if (floatWin) { floatWin.close(); }
  else { createFloat(); }
}

app.whenReady().then(() => {
  createMain();
  if (process.env.PP_FLOAT === '1') setTimeout(createFloat, 800);

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: '小小陪伴',
      submenu: [
        { label: '悬浮模式（宠物上桌面）', accelerator: 'CmdOrCtrl+Shift+P', click: toggleFloat },
        { label: '打开完整小屋', accelerator: 'CmdOrCtrl+O', click: () => { if (mainWin) { mainWin.show(); mainWin.focus(); } else createMain(); } },
        { type: 'separator' },
        { role: 'quit', label: '退出' },
      ],
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
  ]));

  globalShortcut.register('CommandOrControl+Shift+P', toggleFloat);
});

ipcMain.handle('petpal:float', () => { toggleFloat(); return !!floatWin; });
ipcMain.handle('petpal:home', () => { if (!mainWin) createMain(); mainWin.show(); mainWin.focus(); return true; });
ipcMain.handle('petpal:quit-float', () => { if (floatWin) floatWin.close(); return true; });

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWin) createMain();
});
