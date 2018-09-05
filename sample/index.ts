/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const aView = new UIView
aView.frame = { x: 44, y: 44, width: 88, height: 88 }
aView.backgroundColor = UIColor.red
aView.clipsToBounds = true
global.aView = aView

const bView = new UIView
bView.frame = { x: 22, y: 22, width: 22, height: 22 }
bView.backgroundColor = UIColor.green
aView.addSubview(bView)

const cView = new UIView
cView.frame = { x: 11, y: 11, width: 22, height: 1000 }
cView.backgroundColor = UIColor.gray
// cView.hidden = true

aView.insertSubviewAboveSubview(cView, bView)