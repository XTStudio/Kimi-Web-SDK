/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class BarViewController extends UIViewController {

    viewDidLoad() {
        super.viewDidLoad()
        this.view.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
            this.dismissViewController()
        }))
        this.view.backgroundColor = UIColor.green
    }

}

class FooViewController extends UIViewController {

    aView = new UIView

    viewDidLoad() {
        super.viewDidLoad()
        this.vv()
        // this.tt()
    }

    vv() {
        const fooLayer = new CAGradientLayer
        fooLayer.frame = { x: 44, y: 44, width: 88, height: 88 }
        fooLayer.colors = [UIColor.black, UIColor.red, UIColor.clear]
        fooLayer.locations = [0, 0.3, 1]
        fooLayer.startPoint = { x: 0, y: 0 }
        fooLayer.endPoint = { x: 0, y: 1 }
        // fooLayer.cornerRadius = 22
        // fooLayer.borderColor = UIColor.red
        // fooLayer.borderWidth = 10
        // const barLayer = new CALayer
        // barLayer.frame = { x: 22, y: 22, width: 44, height: 44 }
        // barLayer.backgroundColor = UIColor.gray
        // fooLayer.addSublayer(barLayer)
        // fooLayer.masksToBounds = true
        this.view.layer.addSublayer(fooLayer)
        // fooLayer.frame = { x: 44, y: 44, width: 44, height: 44 }
        DispatchQueue.main.asyncAfter(2.0, () => {
            fooLayer.frame = { x: 44, y: 44, width: 88, height: 200 }
        })
    }

    tt() {
        this.aView.backgroundColor = UIColor.white
        this.aView.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
            const alert = new UIActionSheet
            alert.message = "退出后不会删除任何历史数据，下次登录依然可以使用本帐号。"
            alert.addDangerAction("退出登录", () => {
                console.log("vvv")
            })
            alert.addCancelAction("取消", () => {
                console.log("ccc")
            })
            alert.show()
            // this.presentViewController(new BarViewController)
        }))
        this.view.addSubview(this.aView)
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        this.aView.frame = this.view.bounds
    }

}

const fooWindow = new UIWindow
fooWindow.rootViewController = new FooViewController
global.fooWindow = fooWindow
