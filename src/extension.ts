// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const { window, workspace } = vscode

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "writer" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('writer.helloWorld', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from writer!!!!');
  });

  let activeEditor = window.activeTextEditor;
  if (activeEditor) {
    getText();
  }

  window.onDidChangeActiveTextEditor(function (editor) {
    activeEditor = editor;
    if (editor) {
      console.log("active text editor changed...")
      getText();
    }
  }, null, context.subscriptions);

  workspace.onDidChangeTextDocument(function (event) {
    if (activeEditor && event.document === activeEditor.document) {
      console.log("text changed...")
      getText();
    }
  }, null, context.subscriptions);

  context.subscriptions.push(disposable);

  function getText() {
    if (!activeEditor) {
      console.log("no active editor...")
      return
    }
    console.log(activeEditor.document.getText())
  }
}



// this method is called when your extension is deactivated
export function deactivate() { }
