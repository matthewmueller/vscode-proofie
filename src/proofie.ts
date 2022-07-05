import * as vscode from 'vscode';
const { window, workspace } = vscode
import { unified } from 'unified'
import retextEnglish from 'retext-english'
import retextPassive from 'retext-passive'
import retextStringify from 'retext-stringify'
import retextProfanities from 'retext-profanities'
import retextSimplify from 'retext-simplify'
import retextReadability from 'retext-readability'
import retextEquality from 'retext-equality'

type Decoration = vscode.DecorationOptions & {
  source: string
}

type DecorationByType = Record<string, vscode.DecorationRenderOptions>

export default class Proofie {
  private readonly disposables: vscode.Disposable[] = []
  private readonly decorationMap: Record<string, vscode.TextEditorDecorationType> = {}
  private timeout?: NodeJS.Timeout

  constructor(private readonly styles: DecorationByType) { }

  // Activate event handlers
  activate(editor: vscode.TextEditor | undefined) {
    // Setup the text decorations
    for (let type in this.styles) {
      this.decorationMap[type] = window.createTextEditorDecorationType(this.styles[type])
      this.disposables.push(this.decorationMap[type])
    }
    // Listen for changes to the active editor
    this.disposables.push(window.onDidChangeActiveTextEditor(activeEditor => {
      editor = activeEditor
    }))
    // Listen for changes to any document in the workspace
    this.disposables.push(workspace.onDidChangeTextDocument(event => {
      if (!editor || event.document !== editor.document) {
        return
      }
      this.rerender(editor)
    }))
    // Run render on boot we have an editor
    if (editor) {
      this.render(editor)
    }
  }

  // Cleanup disposables
  deactivate() {
    for (let disposable of this.disposables) {
      disposable.dispose()
    }
  }

  // Render in the next tick
  private rerender(editor: vscode.TextEditor) {
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(this.render.bind(this, editor), 0);
  }

  // Render processes the text document and decorates the editor
  private render(editor: vscode.TextEditor) {
    const decorations = this.process(editor.document)
    // Segment decorations by types
    const segments: Map<vscode.TextEditorDecorationType, Decoration[]> = new Map()
    for (let decoration of decorations) {
      const decorationType = this.decorationMap[decoration.source]
      if (!decorationType) {
        console.log('missing source', decoration.source)
        continue
      }
      const decorations = segments.get(decorationType) || []
      decorations.push(decoration)
      segments.set(decorationType, decorations)
    }
    // Loop over the segments and highlight the ranges
    for (let [decorationType, decorations] of segments) {
      editor.setDecorations(decorationType, decorations)
    }
  }

  // Process the text document
  private process(doc: vscode.TextDocument): Decoration[] {
    const file = unified()
      .use(retextEnglish)
      .use(retextPassive)
      .use(retextSimplify)
      .use(retextProfanities)
      .use(retextEquality)
      .use(retextReadability, { threshold: 6 / 7 })
      .use(retextStringify)
      .processSync(doc.getText())

    const ranges: Decoration[] = []
    for (let message of file.messages) {
      if (!message.position) { continue }
      const startOffset = message.position.start.offset
      if (typeof startOffset === 'undefined') { continue }
      const endOffset = message.position.end.offset
      if (typeof endOffset === 'undefined') { continue }
      var startPos = doc.positionAt(startOffset);
      var endPos = doc.positionAt(endOffset);
      ranges.push({
        source: message.source || '',
        range: new vscode.Range(startPos, endPos),
        hoverMessage: message.message,
      })
    }
    return ranges
  }
}
