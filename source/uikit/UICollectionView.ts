import { UIView } from "./UIView";
import { UIScrollView } from "./UIScrollView";
import { UIRect, UIRectZero, UIRectEqualToRect, UIRectIntersectsRect } from "./UIRect";
import { UIIndexPath } from "./UIIndexPath";
import { UISize, UISizeZero } from "./UISize";
import { UIAffineTransform, UIAffineTransformIdentity } from "./UIAffineTransform";
import { UIPoint, UIPointZero } from "./UIPoint";
import { UIAnimator } from "./UIAnimator";
import { EventEmitter } from "../kimi/EventEmitter";
import { UITouch, UITouchPhase } from "./UITouch";

export enum ItemType {
    cell,
    supplementaryView,
    decorationView,
}

export const UICollectionElementKindCell = "UICollectionElementKindCell"

export class UICollectionViewItemKey {

    constructor(
        readonly type: ItemType = ItemType.cell,
        readonly indexPath: UIIndexPath,
        readonly identifier: String
    ) { }

    static collectionItemKeyForCellWithIndexPath(indexPath: UIIndexPath): UICollectionViewItemKey {
        return new UICollectionViewItemKey(
            ItemType.cell,
            indexPath,
            UICollectionElementKindCell
        )
    }

    static collectionItemKeyForLayoutAttributes(layoutAttributes: UICollectionViewLayoutAttributes): UICollectionViewItemKey {
        return new UICollectionViewItemKey(
            layoutAttributes.representedElementCategory,
            layoutAttributes.indexPath,
            layoutAttributes.representedElementKind
        )
    }

}

export class UICollectionViewLayoutAttributes {

    constructor(
        readonly indexPath: UIIndexPath,
        readonly elementKind: string = "",
        readonly representedElementCategory: ItemType = ItemType.cell) { }

    frame: UIRect = UIRectZero
    center: UIPoint = UIPointZero
    size: UISize = UISizeZero
    transform: UIAffineTransform = UIAffineTransformIdentity
    alpha: number = 1.0
    zIndex: number = 0
    hidden: boolean = false

    representedElementKind: string = this.elementKind

    isDecorationView(): boolean {
        return this.representedElementCategory === ItemType.decorationView
    }

    isSupplementaryView(): boolean {
        return this.representedElementCategory === ItemType.supplementaryView
    }

    isCell(): boolean {
        return this.representedElementCategory === ItemType.cell
    }

    static layoutAttributesForCellWithIndexPath(indexPath: UIIndexPath): UICollectionViewLayoutAttributes {
        return new UICollectionViewLayoutAttributes(indexPath, UICollectionElementKindCell, ItemType.cell)
    }

    static layoutAttributesForSupplementaryViewOfKind(elementKind: string, indexPath: UIIndexPath): UICollectionViewLayoutAttributes {
        return new UICollectionViewLayoutAttributes(indexPath, elementKind, ItemType.supplementaryView)
    }

    static layoutAttributesForDecorationViewOfKind(elementKind: string, indexPath: UIIndexPath): UICollectionViewLayoutAttributes {
        return new UICollectionViewLayoutAttributes(indexPath, elementKind, ItemType.decorationView)
    }

}

export class UICollectionViewLayout extends EventEmitter {

    layoutAttributesClass: typeof UICollectionViewLayoutAttributes = UICollectionViewLayoutAttributes

    collectionView: UICollectionView | undefined = undefined

    prepareLayout() { }

    invalidateLayout() {
        if (this.collectionView && this.collectionView._collectionViewData) {
            this.collectionView._collectionViewData.invalidate()
        }
        if (this.collectionView) {
            this.collectionView.setNeedsLayout(true)
        }
    }

    layoutAttributesForElementsInRect(rect: UIRect): UICollectionViewLayoutAttributes[] {
        return []
    }

    layoutAttributesForItemAtIndexPath(indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        return undefined
    }

    layoutAttributesForSupplementaryViewOfKind(kind: String, indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        return undefined
    }

    layoutAttributesForDecorationViewOfKind(kind: String, indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        return undefined
    }

    collectionViewContentSize(): UISize {
        return UISizeZero
    }

}

export class UICollectionView extends UIScrollView {

    constructor(readonly collectionViewLayout: UICollectionViewLayout) {
        super()
        collectionViewLayout.collectionView = this
    }

    allowsSelection: boolean = true

    allowsMultipleSelection: boolean = false

    register(initializer: (context: any) => UICollectionViewCell, reuseIdentifier: string): void {
        this._registeredCells[reuseIdentifier] = initializer
    }

    dequeueReusableCell(reuseIdentifier: string, indexPath: UIIndexPath): UICollectionViewCell {
        if (this._cellReuseQueues[reuseIdentifier] && this._cellReuseQueues[reuseIdentifier].length > 0) {
            const cell = this._cellReuseQueues[reuseIdentifier][0]
            if (cell instanceof UICollectionViewCell) {
                this._cellReuseQueues[reuseIdentifier].splice(0, 1)
                return cell
            }
        }
        const initializer = this._registeredCells[reuseIdentifier]
        if (!initializer) {
            return new UICollectionViewCell()
        }
        const cell = initializer(undefined)
        cell.reuseIdentifier = reuseIdentifier
        cell.collectionView = this
        return cell
    }

    allCells(): UICollectionViewCell[] {
        let result: UICollectionViewCell[] = []
        this._allVisibleViewsDict.forEach(it => {
            if (it instanceof UICollectionViewCell) {
                result.push(it)
            }
        })
        return result
    }

    visibleCells(): UICollectionViewCell[] {
        return this.allCells().filter(it => UIRectIntersectsRect(this.visibleBoundRects, it.frame)) as UICollectionViewCell[]
    }

    reloadData(): void {
        this.invalidateLayout()
        this._allVisibleViewsDict.forEach(it => {
            it.hidden = true
        })
        this._allVisibleViewsDict.clear()
        this._indexPathsForSelectedItems.forEach((it) => {
            const cell = this.cellForItemAtIndexPath(it)
            if (cell) {
                cell.selected = false
                cell.highlighted = false
            }
        })
        this._indexPathsForSelectedItems = []
        this._indexPathsForHighlightedItems = []
        this.setNeedsLayout(true)
    }

    selectItem(indexPath: UIIndexPath, animated: boolean): void {
        if (!this.allowsMultipleSelection) {
            this._indexPathsForSelectedItems.forEach(indexPath => {
                this._allVisibleViewsDict.forEach(it => {
                    if (it instanceof UICollectionViewCell && it.currentIndexPath && it.currentIndexPath.mapKey() === indexPath.mapKey()) {
                        it.selected = false
                        this.emit("didDeselectItem", it.currentIndexPath, it)
                    }
                })
            })
            this._indexPathsForSelectedItems = []
        }
        this._indexPathsForSelectedItems.push(indexPath)
        if (animated) {
            UIAnimator.linear(0.5, () => {
                this._allVisibleViewsDict.forEach(it => {
                    if (it instanceof UICollectionViewCell && it.currentIndexPath && it.currentIndexPath.mapKey() === indexPath.mapKey()) {
                        it.selected = true
                    }
                })
            }, undefined)
        }
        else {
            this._allVisibleViewsDict.forEach(it => {
                if (it instanceof UICollectionViewCell && it.currentIndexPath && it.currentIndexPath.mapKey() === indexPath.mapKey()) {
                    it.selected = true
                }
            })
        }
    }

    deselectItem(indexPath: UIIndexPath, animated: boolean): void {
        {
            const idx = this._indexPathsForSelectedItems.map(it => it.mapKey()).indexOf(indexPath.mapKey())
            if (idx >= 0) {
                this._indexPathsForSelectedItems.splice(idx, 1)
            }
        }
        if (animated) {
            UIAnimator.linear(0.5, () => {
                this._allVisibleViewsDict.forEach(it => {
                    if (it instanceof UICollectionViewCell && it.currentIndexPath && it.currentIndexPath.mapKey() === indexPath.mapKey()) {
                        it.selected = false
                    }
                })
            }, undefined)
        }
        else {
            this._allVisibleViewsDict.forEach(it => {
                if (it instanceof UICollectionViewCell && it.currentIndexPath && it.currentIndexPath.mapKey() === indexPath.mapKey()) {
                    it.selected = false
                }
            })
        }
    }

    // Query Grid

    numberOfSections(): number {
        return this._collectionViewData.numberOfSections()
    }

    numberOfItemsInSection(section: number): number {
        return this._collectionViewData.numberOfItemsInSection(section)
    }

    layoutAttributesForItemAtIndexPath(indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        return this.collectionViewLayout.layoutAttributesForItemAtIndexPath(indexPath)
    }

    layoutAttributesForSupplementaryElementOfKind(kind: string, indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        return this.collectionViewLayout.layoutAttributesForSupplementaryViewOfKind(kind, indexPath)
    }

    indexPathForItemAtPoint(point: UIPoint): UIIndexPath | undefined {
        const targets = this.collectionViewLayout.layoutAttributesForElementsInRect({ x: point.x, y: point.y, width: 1.0, height: 1.0 })
        return targets[targets.length - 1].indexPath
    }

    indexPathForCell(cell: UICollectionViewCell): UIIndexPath | undefined {
        const keys = this._allVisibleViewsDict.keys()
        while (true) {
            const element = keys.next()
            if (element.done) {
                break
            }
            if (this._allVisibleViewsDict.get(element.value) === cell) {
                return element.value.indexPath
            }
        }
        return undefined
    }

    cellForItemAtIndexPath(indexPath: UIIndexPath): UICollectionViewCell | undefined {
        const keys = this._allVisibleViewsDict.keys()
        while (true) {
            const element = keys.next()
            if (element.done) {
                break
            }
            if (element.value.indexPath.mapKey() === indexPath.mapKey()) {
                const cell = this._allVisibleViewsDict.get(element.value)
                if (cell instanceof UICollectionViewCell) {
                    return cell
                }
            }
        }
        return undefined
    }

    indexPathsForVisibleItems(): UIIndexPath[] {
        return this.visibleCells().filter(it => it.layoutAttributes !== undefined).map(it => it.layoutAttributes!!.indexPath)
    }

    indexPathsForSelectedItems(): UIIndexPath[] {
        return this._indexPathsForSelectedItems
    }

    // Implementations

    _allVisibleViewsDict: Map<UICollectionViewItemKey, UIView> = new Map()
    _indexPathsForSelectedItems: UIIndexPath[] = []
    _indexPathsForHighlightedItems: UIIndexPath[] = []
    _registeredCells: { [key: string]: (context: any) => UICollectionViewCell } = {}
    _collectionViewData: UICollectionViewData = new UICollectionViewData(this, this.collectionViewLayout)
    _cellReuseQueues: { [key: string]: UICollectionReusableView[] } = {}
    _supplementaryViewReuseQueues: { [key: string]: UICollectionReusableView[] } = {}
    _decorationViewReuseQueues: { [key: string]: UICollectionReusableView[] } = {}

    public get visibleBoundRects(): UIRect {
        return { x: this.contentOffset.x, y: this.contentOffset.y, width: this.bounds.width, height: this.bounds.height }
    }

    contentOffsetDidChanged() {
        super.contentOffsetDidChanged()
        this.layoutCollectionViews()
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.layoutCollectionViews()
    }

    // Private

    private layoutCollectionViews() {
        this._collectionViewData.validateLayoutInRect(this.visibleBoundRects)
        const contentRect = this._collectionViewData.collectionViewContentRect()
        this.contentSize = contentRect
        this._collectionViewData.validateLayoutInRect(this.visibleBoundRects)
        this.updateVisibleCellsNow(true)
    }

    private invalidateLayout() {
        this.collectionViewLayout.invalidateLayout()
        this._collectionViewData.invalidate()
    }

    private updateVisibleCellsNow(now: Boolean = false) {
        const layoutAttributesArray = this._collectionViewData.layoutAttributesForElementsInRect(this.visibleBoundRects)
        if (layoutAttributesArray.length === 0) {
            return
        }
        const itemKeysToAddDict: Map<UICollectionViewItemKey, UICollectionViewLayoutAttributes> = new Map()
        layoutAttributesArray.forEach(layoutAttributes => {
            const itemKey = UICollectionViewItemKey.collectionItemKeyForLayoutAttributes(layoutAttributes)
            itemKeysToAddDict.set(itemKey, layoutAttributes)
            var view = this._allVisibleViewsDict.get(itemKey)
            if (view instanceof UICollectionReusableView) {
                if (view instanceof UICollectionViewCell) {
                    view.currentIndexPath = itemKey.indexPath
                    view.highlighted = this._indexPathsForHighlightedItems.map(it => it.mapKey()).indexOf(itemKey.indexPath.mapKey()) >= 0
                    view.selected = this._indexPathsForSelectedItems.map(it => it.mapKey()).indexOf(itemKey.indexPath.mapKey()) >= 0
                }
                view.applyLayoutAttributes(layoutAttributes)
            }
            else {
                switch (itemKey.type) {
                    case ItemType.cell: {
                        view = this.createPreparedCellForItemAtIndexPath(itemKey.indexPath, layoutAttributes)
                        if (view instanceof UICollectionViewCell) {
                            view.currentIndexPath = itemKey.indexPath
                            view.highlighted = this._indexPathsForHighlightedItems.map(it => it.mapKey()).indexOf(itemKey.indexPath.mapKey()) >= 0
                            view.selected = this._indexPathsForSelectedItems.map(it => it.mapKey()).indexOf(itemKey.indexPath.mapKey()) >= 0
                        }
                        break;
                    }
                    case ItemType.supplementaryView: {
                        view = this.createPreparedSupplementaryViewForElementOfKind(layoutAttributes.representedElementKind, layoutAttributes.indexPath, layoutAttributes)
                        break;
                    }
                    case ItemType.decorationView: {
                        view = undefined
                    }
                }
                if (view instanceof UICollectionReusableView) {
                    this._allVisibleViewsDict.set(itemKey, view)
                    this.addControlledSubview(view)
                    view.applyLayoutAttributes(layoutAttributes)
                }
            }
        })
        const allVisibleItemKeys = (() => {
            let keys = []
            let keySet = this._allVisibleViewsDict.keys()
            while (true) {
                const key = keySet.next()
                if (key.done) {
                    break
                }
                keys.push(key.value)
            }
            return keys
        })()
        itemKeysToAddDict.forEach((_, it) => {
            const idx = allVisibleItemKeys.indexOf(it)
            if (idx >= 0) {
                allVisibleItemKeys.splice(idx, 1)
            }
        })
        allVisibleItemKeys.forEach(itemKey => {
            const reusableView = this._allVisibleViewsDict.get(itemKey)
            if (reusableView) {
                reusableView.hidden = true
                this._allVisibleViewsDict.delete(itemKey)
                switch (itemKey.type) {
                    case ItemType.cell: {
                        this.reuseCell(reusableView as UICollectionViewCell)
                        break
                    }
                    case ItemType.supplementaryView: {
                        this.reuseSupplementaryView(reusableView as UICollectionReusableView)
                        break
                    }
                    case ItemType.decorationView: {
                        this.reuseDecorationView(reusableView as UICollectionReusableView)
                        break
                    }
                }
            }
        })
    }

    private createPreparedCellForItemAtIndexPath(indexPath: UIIndexPath, layoutAttributes: UICollectionViewLayoutAttributes): UICollectionViewCell {
        const cell = this.__cellForItemAtIndexPath(this, indexPath)
        return cell
    }

    private createPreparedSupplementaryViewForElementOfKind(kind: String, indexPath: UIIndexPath, layoutAttributes: UICollectionViewLayoutAttributes): UICollectionReusableView | undefined {
        const view = this.__viewForSupplementaryElementOfKind(this, kind, indexPath)
        if (view) {
            view.applyLayoutAttributes(layoutAttributes)
        }
        return view
    }

    private addControlledSubview(subview: UICollectionReusableView) {
        if (subview.superview === undefined) {
            this.addSubview(subview)
        }
        subview.hidden = false
    }

    private queueReusableView(reusableView: UICollectionReusableView, queue: { [key: string]: UICollectionReusableView[] }, identifier: string) {
        reusableView.hidden = true
        reusableView.prepareForReuse()
        if (queue[identifier] === undefined) {
            queue[identifier] = []
        }
        const reusableViews = queue[identifier] || []
        reusableViews.push(reusableView)
    }

    private reuseCell(cell: UICollectionViewCell) {
        const reuseIdentifier = cell.reuseIdentifier
        if (reuseIdentifier === undefined) {
            return
        }
        this.queueReusableView(cell, this._cellReuseQueues, reuseIdentifier)
    }

    private reuseSupplementaryView(supplementaryView: UICollectionReusableView) {
        const layoutAttributes = supplementaryView.layoutAttributes
        const reuseIdentifier = supplementaryView.reuseIdentifier
        if (layoutAttributes === undefined || reuseIdentifier === undefined) {
            return
        }
        const kindAndIdentifier = "${layoutAttributes.elementKind}/$reuseIdentifier"
        this.queueReusableView(supplementaryView, this._supplementaryViewReuseQueues, kindAndIdentifier)
    }

    private reuseDecorationView(decorationView: UICollectionReusableView) {
        const reuseIdentifier = decorationView.reuseIdentifier
        if (reuseIdentifier === undefined) {
            return
        }
        this.queueReusableView(decorationView, this._decorationViewReuseQueues, reuseIdentifier)
    }

    // Touches

    touchesBegan(touches: UITouch[]) {
        super.touchesBegan(touches)
        const firstTouch = touches[0]
        if (!firstTouch) {
            return
        }
        this.handleTouch(UITouchPhase.began, firstTouch)
    }

    touchesMoved(touches: UITouch[]) {
        super.touchesMoved(touches)
        const firstTouch = touches[0]
        if (!firstTouch) {
            return
        }
        this.handleTouch(UITouchPhase.moved, firstTouch)
    }

    touchesEnded(touches: UITouch[]) {
        super.touchesEnded(touches)
        const firstTouch = touches[0]
        if (!firstTouch) {
            return
        }
        this.handleTouch(UITouchPhase.ended, firstTouch)
    }

    touchesCancelled(touches: UITouch[]) {
        super.touchesCancelled(touches)
        const firstTouch = touches[0]
        if (!firstTouch) {
            return
        }
        this.handleTouch(UITouchPhase.cancelled, firstTouch)
    }

    private firstTouchPoint: UIPoint | undefined = undefined

    private firstTouchCell: UICollectionViewCell | undefined = undefined

    private handleTouch(phase: UITouchPhase, currentTouch: UITouch) {
        if (!this.allowsSelection) { return }
        switch (phase) {
            case UITouchPhase.began: {
                if (!this.tracking) {
                    var hitTestView = currentTouch.view
                    var cellShouldHighlighted = true
                    while (hitTestView !== undefined) {
                        if (hitTestView instanceof UICollectionViewCell) {
                            break
                        }
                        if (hitTestView.gestureRecognizers.length > 0) {
                            cellShouldHighlighted = false
                        }
                        hitTestView = hitTestView.superview
                    }
                    if (cellShouldHighlighted) {
                        this.firstTouchPoint = currentTouch.windowPoint
                        if (hitTestView instanceof UICollectionViewCell) {
                            this.firstTouchCell = hitTestView
                            setTimeout(() => {
                                if (this.firstTouchPoint === undefined || !(hitTestView instanceof UICollectionViewCell)) { return }
                                if (hitTestView.currentIndexPath) {
                                    this._indexPathsForHighlightedItems.push(hitTestView.currentIndexPath)
                                }
                                hitTestView.highlighted = true
                            }, 150)
                        }
                    }
                }
                break;
            }
            case UITouchPhase.moved: {
                if (this.firstTouchPoint && currentTouch.windowPoint) {
                    if (UIView.recognizedGesture !== undefined || Math.abs(currentTouch.windowPoint.y - this.firstTouchPoint.y) > 8) {
                        this._indexPathsForHighlightedItems = []
                        this._allVisibleViewsDict.forEach(it => {
                            if (it instanceof UICollectionViewCell) {
                                it.highlighted = false
                            }
                        })
                        this.firstTouchPoint = undefined
                        this.firstTouchCell = undefined
                    }
                }
                break;
            }
            case UITouchPhase.ended: {
                if (this.firstTouchCell) {
                    const cell = this.firstTouchCell
                    this._indexPathsForHighlightedItems = []
                    if (!this.allowsMultipleSelection) {
                        this._indexPathsForSelectedItems.forEach(indexPath => {
                            this._allVisibleViewsDict.forEach((it, key) => {
                                if (key.indexPath && key.indexPath.mapKey() === indexPath.mapKey()) {
                                    if (it instanceof UICollectionViewCell) {
                                        it.selected = false
                                        this.emit("didDeselectItem", it.currentIndexPath, it)
                                    }
                                }
                            })
                        })
                        this._indexPathsForSelectedItems = []
                    }
                    this.firstTouchPoint = undefined
                    this.firstTouchCell = undefined
                    this._indexPathsForHighlightedItems = []
                    this._allVisibleViewsDict.forEach(it => {
                        if (it instanceof UICollectionViewCell) {
                            it.highlighted = false
                        }
                    })
                    if (cell.currentIndexPath) {
                        const idx = this._indexPathsForSelectedItems.map(it => it.mapKey()).indexOf(cell.currentIndexPath.mapKey())
                        if (idx >= 0) {
                            this._indexPathsForSelectedItems.splice(idx, 1)
                        }
                        else {
                            this._indexPathsForSelectedItems.push(cell.currentIndexPath)
                        }
                    }
                    cell.selected = !cell.selected
                    if (cell.selected) {
                        this.emit("didSelectItem", cell.currentIndexPath, cell)
                    }
                    else {
                        this.emit("didDeselectItem", cell.currentIndexPath, cell)
                    }
                }
                else {
                    this.firstTouchPoint = undefined
                    this.firstTouchCell = undefined
                    this._indexPathsForHighlightedItems = []
                    this._allVisibleViewsDict.forEach(it => {
                        if (it instanceof UICollectionViewCell) {
                            it.highlighted = false
                        }
                    })
                }
                break;
            }
            case UITouchPhase.cancelled: {
                this.firstTouchPoint = undefined
                this.firstTouchCell = undefined
                this._indexPathsForHighlightedItems = []
                this._allVisibleViewsDict.forEach(it => {
                    if (it instanceof UICollectionViewCell) {
                        it.highlighted = false
                    }
                })
                break;
            }
        }
    }

    // DataSource & Delegate

    __cellForItemAtIndexPath(collectionView: UICollectionView, indexPath: UIIndexPath): UICollectionViewCell {
        return collectionView.val("cellForItem", indexPath) || new UICollectionViewCell()
    }

    __viewForSupplementaryElementOfKind(collectionView: UICollectionView, kind: String, indexPath: UIIndexPath): UICollectionReusableView | undefined {
        return undefined
    }

    __numberOfSections(collectionView: UICollectionView): number {
        const value = collectionView.val("numberOfSections")
        return typeof value === "number" ? value : 1
    }

    __numberOfItemsInSection(collectionView: UICollectionView, inSection: number): number {
        const value = collectionView.val("numberOfItems", inSection)
        return typeof value === "number" ? value : 0
    }

}

export class UICollectionReusableView extends UIView {

    collectionView: UICollectionView | undefined = undefined

    layoutAttributes: UICollectionViewLayoutAttributes | undefined = undefined

    reuseIdentifier: string | undefined = undefined

    prepareForReuse() {
        this.layoutAttributes = undefined
    }

    applyLayoutAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        if (layoutAttributes !== this.layoutAttributes) {
            this.layoutAttributes = layoutAttributes
            this.frame = layoutAttributes.frame
            this.transform = layoutAttributes.transform
        }
    }

}

export class UICollectionViewCell extends UICollectionReusableView {

    private _selected: boolean = false

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        this._selected = value;
        this.emit("selected", this, value)
    }

    private _highlighted: boolean = false

    public get highlighted(): boolean {
        return this._highlighted;
    }

    public set highlighted(value: boolean) {
        this._highlighted = value;
        this.emit("highlighted", this, value)
    }

    contentView: UIView = new UIView

    currentIndexPath: UIIndexPath | undefined = undefined

    prepareForReuse() {
        super.prepareForReuse()
        this.selected = false
        this.highlighted = false
    }

    constructor() {
        super()
        this.addSubview(this.contentView)
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.contentView.frame = this.bounds
    }

}

export class UICollectionViewData {

    constructor(readonly collectionView: UICollectionView, readonly layout: UICollectionViewLayout) { }

    validateLayoutInRect(rect: UIRect) {
        this.validateItemCounts()
        this.prepareToLoadData()
        if (this.validLayoutRect === undefined || !UIRectEqualToRect(this.validLayoutRect, rect)) {
            this.validLayoutRect = rect
            this.cachedLayoutAttributes = this.layout.layoutAttributesForElementsInRect(rect).filter(it => {
                return it.isCell() || it.isDecorationView() || it.isSupplementaryView()
            })
        }
    }

    rectForItemAtIndexPath(indexPath: UIIndexPath): UIRect {
        return UIRectZero
    }

    globalIndexForItemAtIndexPath(indexPath: UIIndexPath): number {
        return this.numberOfItemsBeforeSection(indexPath.section) + indexPath.row
    }

    indexPathForItemAtGlobalIndex(index: number): UIIndexPath | undefined {
        this.validateItemCounts()
        var section = 0
        var countItems = 0
        for (let i = 0; i < this._numSections; i++) {
            const section = i
            const countIncludingThisSection = countItems + this._sectionItemCounts[section]
            if (countIncludingThisSection > index) {
                break
            }
            countItems = countIncludingThisSection
        }
        const item = index - countItems
        return new UIIndexPath(item, section)
    }

    layoutAttributesForElementsInRect(rect: UIRect): UICollectionViewLayoutAttributes[] {
        this.validateLayoutInRect(rect)
        return this.cachedLayoutAttributes
    }

    invalidate() {
        this.itemCountsAreValid = false
        this.layoutIsPrepared = false
        this.validLayoutRect = undefined
    }

    numberOfItemsBeforeSection(section: number): number {
        this.validateItemCounts()
        var returnCount = 0
        for (let i = 0; i < section; i++) {
            returnCount += this._sectionItemCounts[i]

        }
        return returnCount
    }

    numberOfItemsInSection(section: number): number {
        this.validateItemCounts()
        if (section >= this._numSections || section < 0) {
            return 0
        }
        return this._sectionItemCounts[section]
    }

    numberOfItems(): number {
        this.validateItemCounts()
        return this._numItems
    }

    numberOfSections(): number {
        this.validateItemCounts()
        return this._numSections
    }

    collectionViewContentRect(): UIRect {
        return { x: 0.0, y: 0.0, width: this.contentSize.width, height: this.contentSize.height }
    }

    layoutIsPrepared: boolean = false

    itemCountsAreValid = false

    _numSections = 0

    _numItems = 0

    _sectionItemCounts: number[] = []

    validLayoutRect: UIRect | undefined = undefined

    contentSize: UISize = UISizeZero

    cachedLayoutAttributes: UICollectionViewLayoutAttributes[] = []

    private updateItemCounts() {
        const collectionView = this.collectionView
        this._numSections = collectionView.__numberOfSections(collectionView)
        if (this._numSections <= 0) {
            this._numItems = 0
            this._sectionItemCounts = []
            this.itemCountsAreValid = true
            return
        }
        this._numItems = 0
        const sectionItemCounts = []
        for (let index = 0; index < this._numSections; index++) {
            const cellCount = collectionView.__numberOfItemsInSection(collectionView, index)
            sectionItemCounts.push(cellCount)
            this._numItems += cellCount
        }
        this._sectionItemCounts = sectionItemCounts
        this.itemCountsAreValid = true
    }

    private validateItemCounts() {
        if (!this.itemCountsAreValid) {
            this.updateItemCounts()
        }
    }

    private prepareToLoadData() {
        if (!this.layoutIsPrepared) {
            this.layout.prepareLayout()
            this.contentSize = this.layout.collectionViewContentSize()
            this.layoutIsPrepared = true
        }
    }

}