/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const scrollView = new UIView
scrollView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }

const pv = new UISlider
pv.frame = { x: 44, y: 44, width: 200, height: 44 }
pv.value = 0.5
scrollView.addSubview(pv)

global.aView = scrollView


// console.log(img.size)