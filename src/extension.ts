'use strict';

// import {commands, ExtensionContext, Position, Selection, TextEditor, TextEditorEdit, window} from 'vscode';
import * as vscode from 'vscode';

// Helper functions
// ================

function getNext(position: vscode.Position, document: vscode.TextDocument) {
    const endOfLine = document.lineAt(position.line).range.end.character;
    if (position.character != endOfLine) {
        return new vscode.Position(position.line, position.character + 1);
    }
    if (position.line == (document.lineCount - 1)) {
        return null;
    }
    return new vscode.Position(position.line + 1, 0);
}

function getPrev(position: vscode.Position, document: vscode.TextDocument) {
    if (position.character != 0) {
        return new vscode.Position(position.line, position.character - 1);
    }
    if (position.line == 0) {
        return null;
    }
    const endOfPrevLine = document.lineAt(position.line - 1).range.end.character;
    return new vscode.Position(position.line - 1, endOfPrevLine);
}

/** Returns the range deleted, if successful */
function joinLineWithNext(line: number, edit: vscode.TextEditorEdit, document: vscode.TextDocument) {
    if (line >= document.lineCount - 1) return null;
	const matchWhitespaceAtEnd = document.lineAt(line).text.match(/\s*$/);
	const range = new vscode.Range(
		line, document.lineAt(line).range.end.character - matchWhitespaceAtEnd[0].length,
		line + 1, document.lineAt(line + 1).firstNonWhitespaceCharacterIndex);
	edit.replace(range, ' ');
	return range;
}

// Commands
// ========

function transposeCharacters(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const document = textEditor.document;
    textEditor.selections.forEach(selection => {
        let p = new vscode.Position(selection.active.line, selection.active.character)
        let nextPosition = getNext(p, document);
        if (nextPosition == null) {
            nextPosition = p;
            p = getPrev(p, document);
        }
        let prevPosition = getPrev(p, document);
        if (prevPosition == null) {
            return;
        }
        let nextSelection = new vscode.Selection(p, nextPosition);
        let nextChar = textEditor.document.getText(nextSelection);
        edit.delete(nextSelection);
        edit.insert(prevPosition, nextChar);
    });
}

function transposeSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const selectionText = textEditor.selections.map(selection => {
        return textEditor.document.getText(selection);
    });

    // Transpose
    selectionText.unshift(selectionText.pop());

    for (let i = 0; i < selectionText.length; i++) {
        edit.replace(textEditor.selections[i], selectionText[i]);
    }
}

function transpose(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    if (textEditor.selections.every(s => s.isEmpty)) {
        transposeCharacters(textEditor, edit);
    } else {
        transposeSelections(textEditor, edit);
    }
}

function splitIntoLines(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let newSelections: vscode.Selection[] = [];
    for (let selection of textEditor.selections) {
        if (selection.isSingleLine) {
            newSelections.push(selection);
            continue;
        }
        let line = textEditor.document.lineAt(selection.start);
        newSelections.push(new vscode.Selection(
            selection.start,
            line.range.end
        ));
        for (let lineNum = selection.start.line + 1; lineNum < selection.end.line; lineNum++) {
            line = textEditor.document.lineAt(lineNum);
            newSelections.push(new vscode.Selection(
                line.range.start,
                line.range.end
            ));
        }
        if (selection.end.character > 0) {
            newSelections.push(new vscode.Selection(
                selection.end.with(undefined, 0),
                selection.end
            ));
        }
    }
    textEditor.selections = newSelections;
}

function expandToLine(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let newSelections: vscode.Selection[] = [];
    for (let selection of textEditor.selections) {
        newSelections.push(new vscode.Selection(
            selection.start.with(undefined, 0),
            selection.end.with(selection.end.line + 1, 0)
        ));
    }
    textEditor.selections = newSelections;
}

function joinLines(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const document = textEditor.document;

    let newSelections: vscode.Selection[] = [];

    for (const selection of textEditor.selections) {
        if (selection.isEmpty) {
            const range = joinLineWithNext(selection.start.line, edit, document);
            if (range) {
                newSelections.push(new vscode.Selection(range.end, range.end));
            } else {
                newSelections.push(selection)
            }
        } else {
            for (let lineNum = selection.start.line; lineNum <= selection.end.line; lineNum++) {
                joinLineWithNext(lineNum, edit, document);
            }
            newSelections.push(selection);
        }
    }
    textEditor.selections = newSelections;
}

// Activate
// ========

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerTextEditorCommand('extension.transpose', transpose);
    context.subscriptions.push(disposable);

    const disposable2 = vscode.commands.registerTextEditorCommand('extension.splitIntoLines', splitIntoLines);
    context.subscriptions.push(disposable2);

    const disposable3 = vscode.commands.registerTextEditorCommand('extension.expandToLine', expandToLine);
    context.subscriptions.push(disposable3);

	const disposable4 = vscode.commands.registerTextEditorCommand('extension.joinLines', joinLines);
	context.subscriptions.push(disposable4);
}
