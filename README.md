# Sublime Commands for VS Code

Adds commands from [Sublime Text](https://www.sublimetext.com/) to [VS Code](https://code.visualstudio.com/): Transpose, Expand Selection to Line, Split into Lines, Join Lines.

## Shortcuts

By default, sublime-commands doesn't add any shortcuts. You should add them to `keybinding.json` yourself; mine are:

```javascript
{"key": "ctrl+t", "command": "extension.transpose", "when": "editorFocus"},
{"key": "cmd+l", "command": "extension.expandToLine", "when": "editorFocus"},
{"key": "shift+cmd+l", "command": "extension.splitIntoLines", "when": "editorFocus"},
{"key": "cmd+j", "command": "extension.joinLines", "when": "editorFocus"},
```

## Documentation

- `extension.transpose` will, if all selections are empty (i.e. if you have one or more cursors and no selections), behave like `^t` in macOS/emacs: for each cursor, swap the character before the cursor with the character after cursor, and move the cursor after both characters.
  - At the end of the file, it will swap the previous two characters (like macOS/emacs, unlike Sublime which does nothing)
  - At the beginning of the file, it will do nothing (like macOS/emacs, unlike Sublime which moves the cursor forward)
  - At the end of a line, it will swap the previous and next (linebreak) characters (like Sublime, unlike macOS/emacs which swap the previous two characters)
  - At the beginning of a line, it will swap the previous (linebreak) and next characters (like Sublime and emacs, unlike macOS which does nothing)
- `extension.transpose` will, otherwise (i.e. if some selections aren't empty), transpose the selections, putting the contents of the first selection into the second, the second into the third, etc, and the last into the first. If there's only one selection, nothing will happen.
- `extension.expandToLine` will expand all cursors/selections to the entire line (including the ending `\n`). Note that this puts the end of the selection on the next line, so repeated use will increase the selection. VS Code doesn't support ending one selection at the same place another begins, so this can merge selections in situations where it wouldn't in Sublime Text.
- `extension.splitIntoLines` will split a selection into lines, not including the linebreak. If every selection is already single-line, nothing happens. If a selection ends with a linebreak, the next line will not be included.
- `extension.joinLines` will, for all selected lines, replace the linebreak and surrounding whitespace with a single space. If a selection is empty (it's just a cursor), the cursor will be moved to right after the space.

## Differences from other VS Code extensions

- [transpose](https://marketplace.visualstudio.com/items?itemName=v4run.transpose) crashes when some selections are empty and others aren't; sublime-commands doesn't
- transpose behaves weirdly when there are three or more selections; sublime-commands transposes them like Sublime Text
- [join-lines](https://marketplace.visualstudio.com/items?itemName=wmaurer.join-lines) crashes when a cursor is on the last line, sublime-commands doesn't
- join-lines doesn't join the last line of a multiline selection, sublime-commands does (matching Sublime Text's behavior)

# License

[MIT](https://github.com/Zarel/vscode-sublime-commands/blob/master/LICENSE)
