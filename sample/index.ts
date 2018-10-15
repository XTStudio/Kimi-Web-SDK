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
        var testMutableData = new Data({utf8String: 'Hello, World!'}).mutable()
        testMutableData.appendData(new Data({utf8String: '!!!'}))
        testMutableData.appendArrayBuffer(new Uint8Array([33, 33, 33]).buffer)
        testMutableData.setData(new Data({utf8String: '!!!'}))
        console.log(testMutableData.utf8String() === '!!!')
        // this.vv()
        // this.tt()
    }

    vv() {
        const fooLayer = new CAShapeLayer
        fooLayer.frame = { x: 44, y: 44, width: 300, height: 300 }
        const path = new UIBezierPath
        path.moveTo({ x: 20, y: 20 })
        path.addLineTo({ x: 80, y: 20 })
        path.addLineTo({ x: 40, y: 40 })
        path.addLineTo({ x: 20, y: 40 })
        path.closePath()
        // {
        //     const path2 = new UIBezierPath
        //     path2.moveTo({ x: 90, y: 90 })
        //     path2.addLineTo({ x: 100, y: 90 })
        //     path2.addLineTo({ x: 40, y: 200 })
        //     path2.addLineTo({ x: 20, y: 200 })
        //     path2.closePath()
        //     path.appendPath(path2)
        // }
        fooLayer.path = path
        fooLayer.fillColor = UIColor.clear
        fooLayer.lineWidth = 6
        fooLayer.lineJoin = CAShapeLineJoin.round
        fooLayer.strokeColor = UIColor.red
        this.view.layer.addSublayer(fooLayer)
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
