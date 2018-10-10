import { UIView } from "./UIView";
import { UIColor } from "./UIColor";
import { UIImage, UIImageRenderingMode } from "./UIImage";
import { EventEmitter } from "../kimi/EventEmitter";
import { UIAnimator } from "./UIAnimator";
import { UISizeZero } from "./UISize";
import { UILabel } from "./UILabel";
import { UIButton } from "./UIButton";
import { UIViewController } from "./UIViewController";
import { UINavigationController } from "./UINavigationController";
import { UIControlState } from "./UIEnums";
import { UIFont } from "./UIFont";

export class UINavigationItem {

    viewController: UIViewController | undefined = undefined

    navigationBar: UINavigationBar | undefined = undefined

    private _title: string | undefined = undefined

    public get title(): string | undefined {
        return this._title || (this.viewController ? this.viewController.title : undefined);
    }

    public set title(value: string | undefined) {
        this._title = value;
        this.setNeedsUpdate()
    }

    private _titleView: UIView = (() => {
        let view = new UILabel
        view.font = new UIFont(18)
        return view
    })()

    public get titleView(): UIView {
        return this._titleView;
    }

    public set titleView(value: UIView) {
        if (this._titleView) {
            this._titleView.removeFromSuperview()
        }
        this._titleView = value;
        this.setNeedsUpdate()
    }

    backButton: UIButton = new UIButton().on("touchUpInside", () => {
        if (this.viewController && this.viewController.navigationController) {
            this.viewController.navigationController.popViewController(true)
        }
    })

    private _hidesBackButton: boolean = false

    public get hidesBackButton(): boolean {
        return this._hidesBackButton;
    }

    public set hidesBackButton(value: boolean) {
        this._hidesBackButton = value;
        this.setNeedsUpdate()
    }

    private _leftBarButtonItem: UIBarButtonItem | undefined

    public get leftBarButtonItem(): UIBarButtonItem | undefined {
        return this.leftBarButtonItems[0];
    }

    public set leftBarButtonItem(value: UIBarButtonItem | undefined) {
        this.leftBarButtonItems = value ? [value] : [];
    }

    private _leftBarButtonItems: UIBarButtonItem[] = []

    public get leftBarButtonItems(): UIBarButtonItem[] {
        return this._leftBarButtonItems;
    }

    public set leftBarButtonItems(value: UIBarButtonItem[]) {
        this._leftBarButtonItems.forEach(it => {
            if (it.customView) {
                it.customView.removeFromSuperview()
            }
        })
        this._leftBarButtonItems = value;
        this.setNeedsUpdate()
    }

    private _rightBarButtonItem: UIBarButtonItem | undefined = undefined

    public get rightBarButtonItem(): UIBarButtonItem {
        return this.rightBarButtonItems[0];
    }

    public set rightBarButtonItem(value: UIBarButtonItem) {
        this.rightBarButtonItems = value ? [value] : [];
    }

    private _rightBarButtonItems: UIBarButtonItem[] = []

    public get rightBarButtonItems(): UIBarButtonItem[] {
        return this._rightBarButtonItems;
    }

    public set rightBarButtonItems(value: UIBarButtonItem[]) {
        this._rightBarButtonItems.forEach(it => {
            if (it.customView) {
                it.customView.removeFromSuperview()
            }
        })
        this._rightBarButtonItems = value;
        this.setNeedsUpdate()
    }

    setNeedsUpdate() {
        if (this.titleView instanceof UILabel) {
            this.titleView.text = this.title
            // if (this.navigationBar && this.navigationBar.titleTextAttributes) {

            // }
            //     it.font = (this.navigationBar?.titleTextAttributes?.get(UIAttributedStringKey.font.name) as? UIFont) ?: defaultTitleFont
        }
        if (this.navigationBar) {
            this.navigationBar.displayItems()
        }
    }

    allViews(): UIView[] {
        let views: UIView[] = []
        views.push(this.backButton)
        views.push(this.titleView)
        this.leftViews().forEach(it => {
            views.push(it)
        })
        this.rightViews().forEach(it => {
            views.push(it)
        })
        return views
    }

    leftViews(): UIView[] {
        return this.leftBarButtonItems.filter(it => it.customView !== undefined).map(it => it.customView) as UIView[]
    }

    rightViews(): UIView[] {
        return this.rightBarButtonItems.filter(it => it.customView !== undefined).map(it => it.customView) as UIView[]
    }

}

class UIBarButton extends UIButton { }

export class UIBarButtonItem extends EventEmitter {

    private _title: string | undefined = undefined

    public get title(): string | undefined {
        return this._title;
    }

    public set title(value: string | undefined) {
        this._title = value;
        this.resetText()
    }

    titleAttributes: { [key: string]: any } | undefined = undefined
    // set(value) {
    //     field = value
    //     this.resetText()
    // }

    private _image: UIImage | undefined = undefined

    public get image(): UIImage | undefined {
        return this._image;
    }

    public set image(value: UIImage | undefined) {
        this._image = value;
        if (this.customView instanceof UIBarButton) {
            this.customView.setImage(value, UIControlState.normal)
        }
    }

    private _tintColor: UIColor = UIColor.black

    public get tintColor(): UIColor {
        return this._tintColor;
    }

    public set tintColor(value: UIColor) {
        this._tintColor = value;
        if (this.customView instanceof UIBarButton) {
            this.customView.tintColor = value
        }
    }

    width: number = 44.0

    customView: UIView | undefined = new UIBarButton().on("touchUpInside", () => {
        this.emit("touchUpInside", this)
    })

    resetText() {
        if (this.customView instanceof UIBarButton) {
            this.customView.tintColor = this.tintColor
            this.customView.setTitle(this.title, UIControlState.normal)
        }
    }

}

export class UINavigationBar extends UIView {

    navigationController: UINavigationController | undefined = undefined

    public get hidden(): boolean {
        return this._hidden;
    }

    public set hidden(value: boolean) {
        this._hidden = value;
        this.domElement.style.visibility = value ? 'hidden' : 'inherit'
        if (this.navigationController) {
            this.navigationController.view.setNeedsDisplay()
        }
    }

    barHeight = 48.0

    translucent: boolean = false

    private _barTintColor: UIColor | undefined = undefined

    public get barTintColor(): UIColor | undefined {
        return this._barTintColor;
    }

    public set barTintColor(value: UIColor | undefined) {
        this._barTintColor = value;
        this.backgroundColor = value
    }

    titleTextAttributes: { [key: string]: any } = {}

    backIndicatorImage: UIImage | undefined = new UIImage({ name: "icon_back@3x", base64: "iVBORw0KGgoAAAANSUhEUgAAADkAAAA8CAMAAADrC+IEAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTP///////////////////////////////////////////////////////////////////////////////////////////////////4il91oAAAAZdFJOUwD+ZRPxOKUhoAPR0BY3pxSZmAIOMyhEh7SA0BQ9AAAAfElEQVRIx+3VSQqAMBAF0XaIGudZ+/4XVaMLCQjxo4LQtX/rIrpO14qgdMShAiFD1ECEHnClPQg5CwQ+D1OBAv8Cq68hz4ljnQXdy1FoZMOoLEJUYtRIiO7yRKfYsZYs6vl3z6WEChUq1JGOKC01YRSAO4XgRkFINKDwrRZIeEfaMx4tYAAAAABJRU5ErkJggg==", renderingMode: UIImageRenderingMode.alwaysTemplate })

    backIndicatorTransitionMaskImage: UIImage | undefined = undefined

    constructor() {
        super()
        this.barTintColor = UIColor.white
        this.tintColor = UIColor.black
        this.domElement.style.borderBottom = "solid"
        this.domElement.style.borderBottomWidth = (1.0 / devicePixelRatio).toFixed(2) + "px"
        this.domElement.style.borderBottomColor = new UIColor(0x98 / 255.0, 0x96 / 255.0, 0x9b / 255.0, 0.75).toStyle()
    }

    // override fun draw(canvas: Canvas?) {
    //     super.draw(canvas)
    //     const canvas = canvas ?: return
    //     shadowPaint.color = Color.rgb(0x98, 0x96, 0x9b)
    //     shadowPaint.strokeWidth = 1f
    //     shadowPaint.style = Paint.Style.STROKE
    //     canvas.drawLine(0.0f, canvas.height.toFloat() - 1f, canvas.width.toFloat(), canvas.height.toFloat() - 1f, shadowPaint)
    // }

    // Implementation

    public get topItem(): UINavigationItem | undefined {
        return this.items[this.items.length - 1]
    }

    public get backItem(): UINavigationItem | undefined {
        return this.items[this.items.length - 2]
    }

    items: UINavigationItem[] = []

    setItems(items: UINavigationItem[], animated: boolean) {
        this.items.forEach(it => it.allViews().forEach(it => it.removeFromSuperview()))
        this.items = items
        this.displayItems()
    }

    pushNavigationItem(item: UINavigationItem, animated: boolean) {
        this.items.push(item)
        item.navigationBar = this
        this.displayItems()
        if (animated) {
            (() => {
                const fromItem = this.items[this.items.length - 2]
                const toItem = this.items[this.items.length - 1]
                if (fromItem === undefined || toItem === undefined) {
                    return
                }
                fromItem.allViews().forEach(it => it.alpha = 1.0)
                toItem.allViews().forEach(it => {
                    it.transform = { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: it.bounds.width, ty: 0.0 }
                    it.alpha = 1.0
                })
                UIAnimator.bouncy(0.0, 16.0, () => {
                    fromItem.allViews().forEach(it => it.alpha = 0.0)
                    toItem.allViews().forEach(it => {
                        it.transform = { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0 }
                        it.alpha = 1.0
                    })
                }, undefined)
            })()
        }
    }

    popNavigationItem(animated: boolean) {
        if (this.items.length <= 1) { return }
        const fromItem = this.items[this.items.length - 1]
        const toItem = this.items[this.items.length - 2]
        this.items.pop()
        if (animated) {
            fromItem.allViews().forEach(it => {
                it.alpha = 1.0
            })
            toItem.allViews().forEach(it => {
                it.alpha = 0.0
            })
            UIAnimator.bouncy(0.0, 16.0, () => {
                fromItem.allViews().forEach(it => {
                    it.alpha = 0.0
                })
                toItem.allViews().forEach(it => {
                    it.alpha = 1.0
                })
            }, () => {
                fromItem.allViews().forEach(it => it.removeFromSuperview())
                this.displayItems()
            })
        }
        else {
            fromItem.allViews().forEach(it => it.removeFromSuperview())
            this.displayItems()
        }
    }

    popToNavigationItem(item: UINavigationItem, animated: boolean) {
        if (this.items.indexOf(item) < 0) { return }
        const targetIndex = this.items.indexOf(item)
        const fromItems = this.items.filter((_, index) => {
            return index > targetIndex
        })
        if (fromItems.length == 0) { return }
        this.items = this.items.filter((_, index) => {
            return index <= targetIndex
        })
        const toItem = item
        if (animated) {
            const fromItem = fromItems[fromItems.length - 1]
            fromItem.allViews().forEach(it => {
                it.alpha = 1.0
            })
            toItem.allViews().forEach(it => {
                it.alpha = 0.0
            })
            UIAnimator.bouncy(0.0, 16.0, () => {
                fromItem.allViews().forEach(it => {
                    it.alpha = 0.0
                })
                toItem.allViews().forEach(it => {
                    it.alpha = 1.0
                })
            }, () => {
                fromItems.forEach(it => {
                    it.allViews().forEach(it => {
                        it.removeFromSuperview()
                    })
                })
                this.displayItems()
            })
        }
        else {
            fromItems.forEach(it => {
                it.allViews().forEach(it => {
                    it.removeFromSuperview()
                })
            })
            this.displayItems()
        }
    }

    displayItems() {
        this.items.forEach((it, index) => {
            if (it.titleView.superview != this) {
                this.addSubview(it.titleView)
            }
            if (it.backButton.superview != this) {
                this.addSubview(it.backButton)
            }
            it.leftViews().forEach(it => {
                if (it.superview != this) {
                    this.addSubview(it)
                }
            })
            it.rightViews().forEach(it => {
                if (it.superview != this) {
                    this.addSubview(it)
                }
            })
            it.backButton.hidden = it.hidesBackButton || index == 0 || it.leftBarButtonItems.length > 0
            it.backButton.setImage(this.backIndicatorImage ? this.backIndicatorImage.clone() : undefined, UIControlState.normal)
        })
        this.layoutItems()
    }

    private layoutItems() {
        const lastItemIndex = this.items.length - 1
        this.items.forEach((item, index) => {
            let leftX = 16.0
            if (!item.backButton.hidden) {
                item.backButton.frame = { x: 0.0, y: this.bounds.height - this.barHeight, width: 44.0, height: this.barHeight }
                leftX += 32.0
            }
            (() => {
                item.leftBarButtonItems.forEach(barButtonItem => {
                    if (barButtonItem.customView) {
                        const it = barButtonItem.customView
                        it.frame = { x: leftX, y: this.bounds.height - this.barHeight, width: barButtonItem.width, height: this.barHeight }
                        leftX += barButtonItem.width + 8.0
                    }

                })
            })()
            const titleViewSize = item.titleView.intrinsicContentSize() || UISizeZero
            item.titleView.frame = { x: leftX, y: (this.bounds.height - this.barHeight) + ((this.barHeight - titleViewSize.height) / 2.0), width: titleViewSize.width, height: titleViewSize.height }
            let x = this.bounds.width - 16.0
            item.rightBarButtonItems.forEach(barButtonItem => {
                if (barButtonItem.customView) {
                    const it = barButtonItem.customView
                    x -= barButtonItem.width
                    it.frame = { x: x, y: this.bounds.height - this.barHeight, width: barButtonItem.width, height: this.barHeight }
                    x -= 8.0
                }
            })
            item.allViews().forEach(it => {
                it.alpha = index < lastItemIndex ? 0.0 : 1.0
            })
        })
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.layoutItems()
    }

}