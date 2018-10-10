/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const mainView = new UIView
mainView.frame = UIScreen.main.bounds
mainView.backgroundColor = UIColor.yellow

const textField = new UITextField
textField.frame = { x: 44, y: 44, width: 200, height: 44 }
textField.backgroundColor = UIColor.white
textField.font = new UIFont(17)
textField.placeholder = "请输入用户名"
textField.on("shouldBeginEditing", () => {
    return true
})
textField.clearButtonMode = UITextFieldViewMode.whileEditing
mainView.addSubview(textField)
const leftView = new UIView
leftView.backgroundColor = UIColor.red
leftView.frame = { x: 0, y: 0, width: 22, height: 44 }
textField.rightView = leftView
textField.rightViewMode = UITextFieldViewMode.always
// textField.autocapitalizationType = UITextAutocapitalizationType.allCharacters
// textField.autocorrectionType = UITextAutocorrectionType.no
// textField.spellCheckingType = UITextSpellCheckingType.no
// textField.secureTextEntry = true
textField.keyboardType = UIKeyboardType.decimalPad
textField.on("shouldReturn", (sender: UITextField) => {
    sender.blur()
    return true
})
textField.on("shouldChange", (_, __, str) => {
    if (str === "9") {
        return false
    }
    return true
})

global.aView = mainView
