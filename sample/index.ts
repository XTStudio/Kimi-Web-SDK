/// <reference path="../node_modules/xt-studio/types/index.d.ts" />
declare var KIMIDebugger: any;

class Foo extends UIViewController {

  viewDidLoad() {
    super.viewDidLoad()
    let aLabel = new UIImageView
    // aLabel.text = "Hello, World! Hello, World! Hello, World! Hello, World! "
    // aLabel.numberOfLines = 0
    // aLabel.font = new UIFont(17)
    this.view.addSubview(aLabel)
    let yellowView = new UIView
    yellowView.backgroundColor = UIColor.yellow
    this.view.addSubview(yellowView)
    let redView = new UIView
    redView.backgroundColor = UIColor.red
    this.view.addSubview(redView)
    yellowView.makeConstraints(it => {
      it.left(20)
      it.top(20)
      it.width(44)
      it.height(44)
    })
    aLabel.makeConstraints(it => {
      it.left(8, yellowView)
      it.top(20)
      it.width(-1).maxWidth(frame => frame.width - (20 + 44 + 20))
      it.height(-1)
    })
    redView.makeConstraints(it => {
      it.left(0, aLabel, UILayoutAlignment.Start)
      it.top(20, aLabel)
      it.width(20)
      it.height(44)
    })
    redView.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
      aLabel.loadImageWithURLString("https://avatars0.githubusercontent.com/u/5013664?s=460&v=4")
    }))
  }

}

global.main = new Foo