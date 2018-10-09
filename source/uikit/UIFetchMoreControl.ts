import { UIView } from "./UIView";
import { UIScrollView } from "./UIScrollView";
import { UIColor } from "./UIColor";

export class UIFetchMoreControl extends UIView {

    scrollView: UIScrollView | undefined = undefined

    constructor() {
        super()
        this.tintColor = UIColor.gray
    }

    enabled: Boolean = true

    fetching: boolean = false

    tintColorDidChange() {
        super.tintColorDidChange()
    }

    beginFetching() {
        this.fetching = true
        this.emit("fetch", this)
    }

    endFetching() {
        if (this.scrollView) {
            const it = this.scrollView
            if (it.contentOffset.y > it.contentSize.height + it.contentInset.bottom - it.bounds.height) {
                it.setContentOffset({ x: 0.0, y: it.contentSize.height + it.contentInset.bottom - it.bounds.height }, true)
            }
        }
        this.fetching = false
    }

}