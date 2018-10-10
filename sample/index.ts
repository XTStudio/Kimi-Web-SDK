/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const mainView = new UIView
mainView.frame = UIScreen.main.bounds
mainView.backgroundColor = UIColor.yellow

const textField = new UITextView
textField.frame = { x: 44, y: 44, width: 200, height: 200 }
textField.backgroundColor = UIColor.white
textField.font = new UIFont(17)
// textField.placeholder = "请输入用户名"
textField.on("shouldBeginEditing", () => {
    return true
})
// textField.clearButtonMode = UITextFieldViewMode.whileEditing
mainView.addSubview(textField)
textField.on("shouldChange", (_, __, str) => {
    if (str === "9") {
        return false
    }
    return true
})
textField.text = "Hello, World!"
textField.editable = false
textField.selectable = false

global.aView = mainView
