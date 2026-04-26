import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { exposeMultilangAPI } from './api/multilang'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // 暴露基础Electron API
    contextBridge.exposeInMainWorld('electron', electronAPI)

    // 暴露多语言服务API
    exposeMultilangAPI()

    // 暴露其他API
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
