/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const scrollView = new UIScrollView
scrollView.frame = { x: 0, y: 0, width: 320, height: 568 }

const redView = new UIView
redView.frame = { x: 0, y: 0, width: 44, height: 44 }
redView.backgroundColor = UIColor.red
scrollView.addSubview(redView)

const blueView = new UIView
blueView.frame = { x: 0, y: 500, width: 44, height: 44 }
blueView.backgroundColor = UIColor.blue
scrollView.addSubview(blueView)

const yellowView = new UIView
yellowView.frame = { x: 0, y: 700, width: 44, height: 44 }
yellowView.backgroundColor = UIColor.yellow
scrollView.addSubview(yellowView)

const greenView = new UIView
greenView.frame = { x: 0, y: 1400, width: 44, height: 44 }
greenView.backgroundColor = UIColor.green
scrollView.addSubview(greenView)

scrollView.contentSize = { width: 0, height: 1744 }

global.aView = scrollView

