// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import type * as vscode from 'vscode';
import { window } from 'vscode'
import Proofie from './proofie'


const proofie = new Proofie({
  "retext-passive": {
    color: '#fff',
    backgroundColor: 'orange',
  },
  "retext-simplify": {
    color: '#fff',
    backgroundColor: 'blue',
  },
  "retext-readability": {
    color: '#fff',
    backgroundColor: 'black',
  },
  "retext-profanities": {
    color: '#fff',
    backgroundColor: 'red',
  },
  'retext-equality': {
    color: '#fff',
    backgroundColor: 'green',
  }
})

// Activate the extension
export function activate() {
  proofie.activate(window.activeTextEditor)
}

// Deactivate the extension
export function deactivate() {
  proofie.deactivate()
}
