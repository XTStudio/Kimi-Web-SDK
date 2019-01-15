import { UIViewController } from "./UIViewController";
import { UIColor } from "./UIColor";
import { UIView } from "./UIView";
import { UILabel } from "./UILabel";
import { UIAttributedString, UIAttributedStringKey } from "./UIAttributedString";
import { UITextAlignment, UIControlState } from "./UIEnums";
import { UIButton } from "./UIButton";
import { UIFont } from "./UIFont";
import { UITapGestureRecognizer } from "./UITapGestureRecognizer";
import { DispatchQueue } from "../foundation/DispatchQueue";
import { UIAnimator } from "./UIAnimator";
import { UIScreen } from "./UIScreen";

enum UIAlertActionStyle {
    normal,
    danger,
    cancel,
}

class UIAlertAction {

    constructor(readonly title: string, readonly style: UIAlertActionStyle, readonly callback: (() => void) | undefined) { }

}

class UIActionSheetController extends UIViewController {

    backgroundView = new UIView()
    contentView = new UIView()

    viewDidLoad() {
        super.viewDidLoad()
        this.view.backgroundColor = UIColor.clear
        this.backgroundView.backgroundColor = new UIColor(0.0, 0.0, 0.0, 0.35)
        this.view.addSubview(this.backgroundView)
        this.contentView.tintColor = UIColor.black
        this.contentView.backgroundColor = new UIColor(0.9, 0.9, 0.9, 1.0)
        this.view.addSubview(this.contentView)
    }

    message: string | undefined = undefined

    private _actions: UIAlertAction[] = []

    public get actions(): UIAlertAction[] {
        return this._actions;
    }

    public set actions(value: UIAlertAction[]) {
        this._actions = value;
        this.setupContents()
    }

    setupContents() {
        var height = 0.0
        if (this.message) {
            const messageView = new UIView()
            messageView.backgroundColor = UIColor.white
            const textLabel = new UILabel()
            const attributedString = new UIAttributedString(this.message, {
                [UIAttributedStringKey.font]: new UIFont(12),
                [UIAttributedStringKey.foregroundColor]: new UIColor(0.55, 0.55, 0.55, 1.0),
            })
            const textBounds = attributedString.measure({ width: UIScreen.main.bounds.width - 60, height: 88.0 })
            textLabel.attributedText = attributedString
            textLabel.numberOfLines = 0
            textLabel.textAlignment = UITextAlignment.center
            textLabel.frame = { x: 30.0, y: 0.0, width: UIScreen.main.bounds.width - 60, height: textBounds.height + 28 }
            messageView.frame = { x: 0.0, y: height, width: 0.0, height: textBounds.height + 28 }
            messageView.addSubview(textLabel)
            messageView.domElement.style.borderBottom = "solid"
            messageView.domElement.style.borderBottomColor = new UIColor(0.9, 0.9, 0.9, 1.0).toStyle()
            messageView.domElement.style.borderBottomWidth = (1.0 / devicePixelRatio) + "px"
            this.contentView.addSubview(messageView)
            height += messageView.frame.height + 1
        }
        this.actions.forEach(it => {
            if (it.style == UIAlertActionStyle.cancel) {
                height += 6.0
            }
            const view = new UIButton().on("touchUpInside", () => {
                this.dismiss(true, () => {
                    it.callback && it.callback()
                })
            })
            view.backgroundColor = UIColor.white
            view.setTitle(it.title, UIControlState.normal)
            view.setTitleFont(new UIFont(19.0))
            if (it.style == UIAlertActionStyle.danger) {
                view.setTitleColor(new UIColor(231.0 / 255.0, 45.0 / 255.0, 39.0 / 255.0, 1.0), UIControlState.normal)
            }
            else if (it.style == UIAlertActionStyle.cancel) {
                view.setTitleFont(new UIFont(18.0))
            }
            view.frame = { x: 0.0, y: height, width: UIScreen.main.bounds.width, height: 55.0 }
            view.domElement.style.borderBottom = "solid"
            view.domElement.style.borderBottomColor = new UIColor(0.9, 0.9, 0.9, 1.0).toStyle()
            view.domElement.style.borderBottomWidth = (1.0 / devicePixelRatio) + "px"
            this.contentView.addSubview(view)
            height += 56.0
        })
        this.contentView.frame = { x: 0.0, y: 0.0, width: 0.0, height: height }
        {
            const cancelAction = this.actions.filter(it => it.style === UIAlertActionStyle.cancel)[0]
            if (cancelAction) {
                this.backgroundView.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
                    this.dismiss(true, () => {
                        cancelAction.callback && cancelAction.callback()
                    })
                }))
            }
        }
    }

    show(animated: boolean) {
        if (animated) {
            this.backgroundView.alpha = 0.0
            this.contentView.alpha = 0.0
            DispatchQueue.main.asyncAfter(0.10, () => {
                this.contentView.alpha = 1.0
                this.contentView.frame = { x: 0.0, y: this.view.bounds.height, width: this.view.bounds.width, height: this.contentView.frame.height }
                UIAnimator.bouncy(0.0, 36.0, () => {
                    this.backgroundView.alpha = 1.0
                    this.contentView.frame = { x: 0.0, y: this.view.bounds.height - this.contentView.frame.height, width: this.view.bounds.width, height: this.contentView.frame.height }
                }, undefined)
            })
        }
    }

    dismiss(animated: boolean, callback: () => void) {
        if (UIActionSheet.currentActionSheet === undefined) {
            return
        }
        UIActionSheet.currentActionSheet = undefined
        if (animated) {
            this.backgroundView.alpha = 1.0
            this.contentView.frame = { x: 0.0, y: this.view.bounds.height - this.contentView.frame.height, width: this.view.bounds.width, height: this.contentView.frame.height }
            UIAnimator.bouncy(0.0, 24.0, () => {
                this.backgroundView.alpha = 0.0
                this.contentView.frame = { x: 0.0, y: this.view.bounds.height, width: this.view.bounds.width, height: this.contentView.frame.height }
            }, () => {
                if (this.window) {
                    this.window.removeFromSuperview()
                }
                callback()
            })
        }
        else {
            if (this.window) {
                this.window.removeFromSuperview()
            }
        }
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        this.backgroundView.frame = this.view.bounds
        this.contentView.frame = { x: 0.0, y: this.view.bounds.height - this.contentView.frame.height, width: this.view.bounds.width, height: this.contentView.frame.height }
        this.contentView.subviews.forEach(it => {
            it.frame = { x: it.frame.x, y: it.frame.y, width: this.view.bounds.width, height: it.frame.height }
        })
    }

}

export class UIActionSheet {

    message: string = ""

    actions: UIAlertAction[] = []

    addRegularAction(title: string, actionBlock: () => void) {
        this.actions.push(new UIAlertAction(title, UIAlertActionStyle.normal, actionBlock))
    }

    addDangerAction(title: string, actionBlock: () => void) {
        this.actions.push(new UIAlertAction(title, UIAlertActionStyle.danger, actionBlock))
    }

    addCancelAction(title: string, actionBlock: () => void) {
        this.actions.push(new UIAlertAction(title, UIAlertActionStyle.cancel, actionBlock))
    }

    show() {
        if (UIActionSheet.currentActionSheet) {
            UIActionSheet.currentActionSheet.dismiss(false, () => { })
        }
        const view = new UIActionSheetController()
        UIActionSheet.currentActionSheet = view
        view.appendToElement(document.body)
        view.message = this.message
        view.actions = this.actions
        view.show(true)
    }

    static currentActionSheet: UIActionSheetController | undefined = undefined

}