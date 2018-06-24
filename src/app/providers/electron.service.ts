import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, shell } from 'electron';

@Injectable({
providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  shell: typeof shell;  

  constructor() {
    if (this.isElectron()) {
      // this.shell = require('electron').shell;
      // this.childProcess = require('child_process');
      // this.fs = require('fs');
    }
  }

  isElectron = () => {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
       // Electron-specific code
       return true;
    }
  }

  openLink = () => {
    //this.shell.openExternal('https://github.com')
  }
}
