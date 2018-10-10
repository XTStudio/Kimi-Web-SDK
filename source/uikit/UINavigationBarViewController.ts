import { UIViewController } from "./UIViewController";
import { UIView } from "./UIView";
import { UIRect } from "./UIRect";

export class UINavigationBarViewController extends UIViewController {

    navigationBarContentHeight: number = 44.0

    private _navigationBarInFront: boolean = true

    public get navigationBarInFront(): boolean {
        return this._navigationBarInFront;
    }

    public set navigationBarInFront(value: boolean) {
        this._navigationBarInFront = value;
        if (value) {
            this.view.bringSubviewToFront(this.navigationBar)
        }
        else {
            this.view.bringSubviewToFront(this.contentView)
        }
    }

    navigationBar: UIView = new UIView

    contentView: UIView = new UIView

    public get view(): UIView {
        return this.contentView
    }

    navigationControllerState: { barHidden: boolean } | undefined = undefined

    loadView() {
        super.loadView()
        this.view.addSubview(this.contentView)
        this.view.addSubview(this.navigationBar)
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
            return { x: 0.0, y: 0.0, width: this.view.bounds.width, height: 0.0 }
        }
        return { x: 0.0, y: 0.0, width: this.view.bounds.width, height: this.navigationBarContentHeight }
    }

    private get contentFrame(): UIRect {
        return { x: 0.0, y: this.barFrame.height, width: this.view.bounds.width, height: this.view.bounds.height - this.barFrame.height }
    }

    viewWillLayoutSubviews() {
        this.navigationBar.frame = this.barFrame
        this.contentView.frame = this.contentFrame
        super.viewWillLayoutSubviews()
    }

}