var aView = new UIView;
aView.frame = { x: 44, y: 44, width: 88, height: 88 };
aView.backgroundColor = UIColor.red;
global.aView = aView;
var bView = new UIView;
bView.frame = { x: 22, y: 22, width: 22, height: 22 };
bView.backgroundColor = UIColor.green;
aView.addSubview(bView);
