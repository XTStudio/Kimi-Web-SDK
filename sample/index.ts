/// <reference path="../node_modules/xt-studio/types/index.d.ts" />
declare var KIMIDebugger: any;

class Foo extends UIViewController {

  viewDidLoad() {
    super.viewDidLoad()
    let grayView = new UIView
    grayView.backgroundColor = UIColor.gray
    grayView.frame = UIRectMake(200, 200, 200, 200)
    this.view.addSubview(grayView)
    grayView.layoutController.left(44).bottom(100).apply()
    let yellowView = new UIView
    yellowView.backgroundColor = UIColor.yellow
    grayView.addSubview(yellowView)
    yellowView.makeConstraints(it => it.left(0, grayView).top(0, grayView).width(88).height(88))
    let redView = new UIView
    redView.backgroundColor = UIColor.red
    redView.alpha = 0.75
    this.view.addSubview(redView)
    redView.makeConstraints(it => it.left(0, grayView).top(-100, grayView).width("100%", grayView).height("25%", grayView))
    redView.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
      UIAnimator.bouncy(12.0, 40.0, () => {
        redView.makeConstraints(it => it.left(0, grayView).top(-200, grayView).width("100%", grayView).height("100%", grayView))
      })
    }))
  }

}

global.main = new Foo