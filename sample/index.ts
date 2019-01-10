/// <reference path="../node_modules/xt-studio/types/index.d.ts" />
declare var KIMIDebugger: any;

class Foo extends UIViewController {

  redView = new UIView()

  viewDidLoad() {
    super.viewDidLoad()
    this.redView.backgroundColor = UIColor.red
    this.view.addSubview(this.redView)
  }

  viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews()
    this.redView.frame = UIRectMake(44, 44, 88, 88)
  }

}

global.main = new Foo