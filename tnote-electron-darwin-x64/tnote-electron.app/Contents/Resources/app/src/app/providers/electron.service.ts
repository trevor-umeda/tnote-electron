import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor() {
    // if (this.isElectron()) {
    //   this.ipcRenderer = require('electron').ipcRenderer;
    //   this.webFrame = require('electron').webFrame;
    //   this.remote = require('electron').remote;
    //
    //   this.childProcess = require('child_process');
    //   this.fs = require('fs');
    // }
  }

  isElectron = () => {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
       // Electron-specific code
       return true;
    }
  }
}