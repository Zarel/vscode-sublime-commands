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

# Comparison

- [transpose](https://marketplace.visualstudio.com/items?itemName=v4run.transpose) crashes when some selections are empty and others aren't; sublime-commands doesn't
- transpose behaves weirdly when there are three or more selections; sublime-commands transposes them like Sublime Text
- [join-lines](https://marketplace.visualstudio.com/items?itemName=wmaurer.join-lines) crashes when a cursor is on the last line, sublime-commands doesn't
- join-lines doesn't join the last line of a multiline selection, sublime-commands does (matching Sublime Text's behavior)

# License

[MIT](https://github.com/Zarel/vscode-sublime-commands/blob/master/LICENSE)
