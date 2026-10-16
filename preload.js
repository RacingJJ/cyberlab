const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('platformInfo', {
  isElectron: true,
  platform: process.platform
})
