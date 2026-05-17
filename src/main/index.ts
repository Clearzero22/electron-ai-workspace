import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerIPCHandlers } from './ipc'
import { registerWindowIPCHandlers } from './ipc/window'
import { windowManager } from './windowManager'

function createWindow(): void {
  // 使用窗口管理器创建主窗口
  windowManager.createWindow({
    id: 'main',
    title: 'AI CrossBorder - 跨境电商工作台',
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 注册所有IPC处理器（Python AI服务、Go爬虫服务、服务管理）
  registerIPCHandlers()

  // 注册窗口管理IPC处理器
  registerWindowIPCHandlers()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createWindow({
        id: 'main',
        title: 'AI CrossBorder - 跨境电商工作台',
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600
      })
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
