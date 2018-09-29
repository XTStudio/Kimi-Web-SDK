/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const aView = new UIView
aView.frame = { x: 44, y: 44, width: 88, height: 88 }
aView.backgroundColor = UIColor.red
aView.clipsToBounds = true
const longPress = new UIPanGestureRecognizer()
    .on("began", () => {
        aView.backgroundColor = UIColor.yellow
    })
    .on("changed", () => {
        aView.backgroundColor = UIColor.gray
    })
    .on("ended", (sender) => {
        aView.backgroundColor = UIColor.red
        console.log(sender.velocityInView(undefined))
    })
aView.addGestureRecognizer(longPress)
global.aView = aView

const bView = new UIView
bView.frame = { x: 22, y: 22, width: 22, height: 22 }
bView.backgroundColor = UIColor.green
aView.addSubview(bView)

const cView = new UIView
cView.frame = { x: 11, y: 11, width: 22, height: 22 }
cView.backgroundColor = UIColor.gray
cView.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
    UIAnimator.bouncy(20.0, 8.0, () => {
        aView.frame = { x: 44, y: 44, width: 200, height: 200 }
    }, () => {
        cView.backgroundColor = UIColor.yellow
    })
    // cView.backgroundColor = UIColor.yellow
}))
// cView.hidden = true

aView.insertSubviewAboveSubview(cView, bView)