/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class FooViewController extends UIViewController {

    fooLabel = new UILabel

    viewDidLoad() {
        super.viewDidLoad()
        const paragraphStyle = new UIParagraphStyle
        paragraphStyle.alignment = UITextAlignment.center
        // paragraphStyle.minimumLineHeight = 60
        const attributedString = new UIAttributedString("Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!", {
            [UIAttributedStringKey.font]: new UIFont(18),
            [UIAttributedStringKey.foregroundColor]: UIColor.gray,
            [UIAttributedStringKey.backgroundColor]: UIColor.yellow,
            [UIAttributedStringKey.kern]: 4,
            [UIAttributedStringKey.paragraphStyle]: paragraphStyle,
        })
        const mutable = attributedString.mutable()
        // mutable.deleteCharacters({ location: 0, length: 1 })
        // mutable.addAttribute(UIAttributedStringKey.font as any, new UIFont(18, "bold"), { location: 1, length: 2 })
        this.fooLabel.numberOfLines = 0
        console.log(mutable.measure({ width: UIScreen.main.bounds.width, height: Infinity }))
        this.fooLabel.attributedText = mutable
        this.view.addSubview(this.fooLabel)
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        this.fooLabel.frame = this.view.bounds
    }

}

const fooWindow = new UIWindow
fooWindow.rootViewController = new FooViewController
global.fooWindow = fooWindow
