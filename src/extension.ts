// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const { window, workspace } = vscode

const pattern = new RegExp(escapeRegExp("TODO") + "|" + escapeRegExp("FIXME"), 'g')
const decorationTypes = {};
let timeout: any

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
    timeout && clearTimeout(timeout);
    timeout = setTimeout(getText2, 0);
  }
  const decorationType = window.createTextEditorDecorationType({
    color: '#fff',
    backgroundColor: '#ffbd2a',
  });
  function getText2() {
    if (!activeEditor) {
      console.log("no active editor...")
      return
    }
    const text = activeEditor.document.getText()
    const ranges: vscode.Range[] = []
    let match
    while (match = pattern.exec(text)) {
      var startPos = activeEditor.document.positionAt(match.index);
      var endPos = activeEditor.document.positionAt(match.index + match[0].length);
      console.log('added range', match[0], match.index, match.length, startPos.line + ":" + startPos.character, endPos.line + ":" + endPos.character)
      ranges.push(new vscode.Range(startPos, endPos))
    }

    console.log("setting ranges", ranges)
    activeEditor.setDecorations(decorationType, ranges)
  }
}


function escapeRegExp(s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// this method is called when your extension is deactivated
export function deactivate() { }
