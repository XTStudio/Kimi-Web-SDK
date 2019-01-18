/// <reference path="../node_modules/xt-studio/types/index.d.ts" />
declare var KIMIDebugger: any;

class Foo extends UIViewController {

  textField = new UITextField

  viewDidLoad() {
    super.viewDidLoad()
    this.textField.on("shouldReturn", (sender: UITextField) => {
      sender.blur()
      return false
    })
    this.textField.backgroundColor = UIColor.yellow
    this.view.addSubview(this.textField)
  }

  viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews()
    this.textField.frame = UIRectMake(44, 44, 200, 88)
  }

}

global.main = new Foo