/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const scrollView = new UIScrollView
scrollView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }

const aLabel = new UILabel
aLabel.frame = { x: 0, y: 44, width: 300, height: 100 }
aLabel.backgroundColor = UIColor.yellow
aLabel.text = "Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!"
aLabel.textColor = UIColor.red
aLabel.font = new UIFont(17)
aLabel.numberOfLines = 0
scrollView.addSubview(aLabel)

global.aView = scrollView

