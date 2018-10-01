/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const scrollView = new UIView
scrollView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }

const pv = new UIActivityIndicatorView
pv.backgroundColor = UIColor.yellow
pv.frame = { x: 0, y: 0, width: 300, height: 300 }
pv.color = UIColor.red
pv.largeStyle = true
pv.startAnimating()
scrollView.addSubview(pv)

global.aView = scrollView


// console.log(img.size)