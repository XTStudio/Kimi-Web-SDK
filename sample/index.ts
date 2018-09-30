/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const scrollView = new UIView
scrollView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }

const pv = new UISwitch
pv.frame = { x: 44, y: 44, width: 66, height: 44 }
scrollView.addSubview(pv)

global.aView = scrollView


// console.log(img.size)