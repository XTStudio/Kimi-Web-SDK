/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class FooViewController extends UIViewController {

    sampleView = new UIStackView([])
    redView: UIView = new UIView
    yellowView: UIView = new UIView
    blueView: UIView = new UIView

    viewDidLoad() {
        super.viewDidLoad()
        this.redView.backgroundColor = UIColor.red
        this.redView.tag = 100
        this.yellowView.backgroundColor = UIColor.yellow
        this.yellowView.tag = 101
        this.blueView.backgroundColor = UIColor.blue
        this.blueView.tag = 102
        this.sampleView.addArrangedSubview(this.redView)
        this.sampleView.addArrangedSubview(this.yellowView)
        this.sampleView.addArrangedSubview(this.blueView)
        this.sampleView.layoutArrangedSubview(this.yellowView, { width: 50 })
        this.sampleView.layoutArrangedSubview(this.blueView, { width: 50 })
        this.sampleView.axis = UILayoutConstraintAxis.horizontal
        this.sampleView.distribution = UIStackViewDistribution.fill
        this.view.addSubview(this.sampleView)
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        this.sampleView.frame = { x: 0, y: 0, width: 300, height: 88 }
    }

}

const fooWindow = new UIWindow
fooWindow.rootViewController = new FooViewController
global.fooWindow = fooWindow
