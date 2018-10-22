import { UIViewController } from "./UIViewController";
import { UIView } from "./UIView";
import { UIRect } from "./UIRect";
import { UIColor } from "./UIColor";

export class UINavigationBarViewController extends UIViewController {

    navigationBarContentHeight: number = 44.0

    private _navigationBarInFront: boolean = true

    public get navigationBarInFront(): boolean {
        return this._navigationBarInFront;
    }

    public set navigationBarInFront(value: boolean) {
        this._navigationBarInFront = value;
        this.iView;
        if (this._view) {
            if (value) {
                this._view.bringSubviewToFront(this.navigationBar)
            }
            else {
                this._view.bringSubviewToFront(this._contentView)
            }
        }
    }

    navigationBar: UIView = new UIView

    _contentView: UIView = new UIView

    protected _view: any = undefined

    public set view(value: UIView) {
        if (this._view !== undefined) { return }
        this._view = value
    }

    public get view(): UIView {
        this.loadViewIfNeed()
        return this._contentView
    }

    navigationControllerState: { barHidden: boolean } | undefined = undefined

    loadView() {
        super.loadView()
        this.iView.addSubview(this._contentView)
        this.iView.addSubview(this.navigationBar)
    }

    viewWillAppear(animated: boolean) {
        if (this.navigationController !== undefined && this.navigationControllerState === undefined) {
            this.navigationControllerState = { barHidden: this.navigationController.navigationBar.hidden }
            this.navigationController.setNavigationBarHidden(true, animated, false)
        }
        super.viewWillAppear(animated)
    }

    viewWillDisappear(animated: boolean) {
        if (this.navigationControllerState !== undefined && this.navigationController) {
            this.navigationController.setNavigationBarHidden(this.navigationControllerState.barHidden, animated, true)
        }
        super.viewWillDisappear(animated)
    }

    private get barFrame(): UIRect {
        if (this.navigationBar.hidden) {
            return { x: 0.0, y: 0.0, width: this.iView.bounds.width, height: 0.0 }
        }
        return { x: 0.0, y: 0.0, width: this.iView.bounds.width, height: this.navigationBarContentHeight }
    }

    private get contentFrame(): UIRect {
        return { x: 0.0, y: this.barFrame.height, width: this.iView.bounds.width, height: this.iView.bounds.height - this.barFrame.height }
    }

    viewWillLayoutSubviews() {
        this.navigationBar.frame = this.barFrame
        this._contentView.frame = this.contentFrame
        super.viewWillLayoutSubviews()
    }

}