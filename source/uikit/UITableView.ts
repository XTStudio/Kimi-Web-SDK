import { UIView } from "./UIView";
import { UIScrollView } from "./UIScrollView";
import { UIColor } from "./UIColor";
import { UIEdgeInsets, UIEdgeInsetsZero } from "./UIEdgeInsets";
import { UIIndexPath } from "./UIIndexPath";
import { UIRectIntersectsRect, UIRect, UIRectZero } from "./UIRect";
import { UIAnimator } from "./UIAnimator";
import { UIPoint } from "./UIPoint";
import { UITouch, UITouchPhase } from "./UITouch";

// @Reference https://github.com/BigZaphod/Chameleon/blob/master/UIKit/Classes/UITableView.m
export class UITableView extends UIScrollView {

    rowHeight: number = 44.0

    private _tableHeaderView: UIView | undefined = undefined

    public get tableHeaderView(): UIView | undefined {
        return this._tableHeaderView;
    }

    public set tableHeaderView(value: UIView | undefined) {
        if (this._tableHeaderView) {
            this._tableHeaderView.removeFromSuperview()
        }
        this._tableHeaderView = value;
        this._setContentSize()
        if (value) {
            this.addSubview(value)
        }
        this._layoutTableView()
    }

    private _tableFooterView: UIView | undefined = undefined

    public get tableFooterView(): UIView | undefined {
        return this._tableFooterView;
    }

    public set tableFooterView(value: UIView | undefined) {
        if (this._tableFooterView) {
            this._tableFooterView.removeFromSuperview()
        }
        this._tableFooterView = value;
        this._setContentSize()
        if (value) {
            this.addSubview(value)
        }
        this._layoutTableView()
    }

    separatorColor: UIColor | undefined = new UIColor(0xbc / 255.0, 0xba / 255.0, 0xc1 / 255.0, 1.0)
    separatorInset: UIEdgeInsets = UIEdgeInsetsZero
    allowsSelection: boolean = true
    allowsMultipleSelection: boolean = false

    register(initializer: () => UITableViewCell, reuseIdentifier: string) {
        this._registeredCells[reuseIdentifier] = initializer
    }

    dequeueReusableCell(reuseIdentifier: string, indexPath: UIIndexPath): UITableViewCell | undefined {
        for (let index = 0; index < this._reusableCells.length; index++) {
            if (this._reusableCells[index].reuseIdentifier == reuseIdentifier) {
                const cell = this._reusableCells[index]
                this._reusableCells.splice(index, 1)
                return cell
            }
        }
        const cell = this._registeredCells[reuseIdentifier] ? this._registeredCells[reuseIdentifier]() : new UITableViewCell()
        cell.reuseIdentifier = reuseIdentifier
        return cell
    }

    reloadData() {
        Object.keys(this._cachedCells).forEach(it => {
            this._cachedCells[it].removeFromSuperview()
        })
        this._reusableCells.forEach(it => it.removeFromSuperview())
        this._reusableCells = []
        this._cachedCells = {}
        this._updateSectionsCache()
        this._setContentSize()
        this._needsReload = false
        this._layoutTableView()
    }

    selectRow(indexPath: UIIndexPath, animated: boolean) {
        if (!this.allowsMultipleSelection) {
            this._selectedRows.forEach(indexPathKey => {
                const values = Object.keys(this._cachedCells).map(it => this._cachedCells[it])
                for (let index = 0; index < values.length; index++) {
                    const element = values[index];
                    if (element.currentIndexPath && element.currentIndexPath.mapKey() === indexPathKey) {
                        element.selected = false
                        element.emit("selected", element, false, false)
                        break
                    }
                }
            })
            this._selectedRows = []
        }
        this._selectedRows.push(indexPath.mapKey())
        const values = Object.keys(this._cachedCells).map(it => this._cachedCells[it])
        for (let index = 0; index < values.length; index++) {
            const element = values[index];
            if (element.currentIndexPath && element.currentIndexPath.mapKey() === indexPath.mapKey()) {
                if (animated) {
                    UIAnimator.linear(0.30, () => {
                        element.selected = true
                    }, undefined)
                }
                else {
                    element.selected = true
                }
                element.emit("selected", element, true, animated)
                break
            }
        }
    }

    deselectRow(indexPath: UIIndexPath, animated: boolean) {
        const idx = this._selectedRows.indexOf(indexPath.mapKey())
        if (idx >= 0) {
            this._selectedRows.splice(idx, 1)
        }
        const values = Object.keys(this._cachedCells).map(it => this._cachedCells[it])
        for (let index = 0; index < values.length; index++) {
            const element = values[index];
            if (element.currentIndexPath && element.currentIndexPath.mapKey() === indexPath.mapKey()) {
                if (animated) {
                    UIAnimator.linear(0.30, () => {
                        element.selected = false
                    }, undefined)
                }
                else {
                    element.selected = false
                }
                element.emit("selected", element, false, false)
                break
            }
        }
    }

    // DataSource & Delegate

    numberOfSections(): number {
        const value = this.val("numberOfSections")
        return typeof value === "number" ? value : 1
    }

    numberOfRows(inSection: number): number {
        const value = this.val("numberOfRows", inSection)
        return typeof value === "number" ? value : 0
    }

    heightForRow(indexPath: UIIndexPath): number {
        const value = this.val("heightForRow", indexPath)
        return typeof value === "number" ? value : this.rowHeight
    }

    cellForRow(indexPath: UIIndexPath): UITableViewCell {
        const value = this.val("cellForRow", indexPath)
        return value || new UITableViewCell()
    }

    viewForHeader(inSection: number): UIView | undefined {
        return this.val("viewForHeader", inSection)
    }

    heightForHeader(inSection: number): number {
        const value = this.val("heightForHeader", inSection)
        return typeof value === "number" ? value : 0.0
    }

    viewForFooter(inSection: number): UIView | undefined {
        return this.val("viewForFooter", inSection)
    }

    heightForFooter(inSection: number): number {
        const value = this.val("heightForFooter", inSection)
        return typeof value === "number" ? value : 0.0
    }

    didSelectRow(indexPath: UIIndexPath) {

    }

    didDeselectRow(indexPath: UIIndexPath) {

    }

    private _registeredCells: { [key: string]: () => UITableViewCell } = {}
    private _reusableCells: UITableViewCell[] = []
    private _cachedCells: { [key: string]: UITableViewCell } = {}
    private _selectedRows: string[] = []
    private _highlightedRow: string | undefined = undefined
    private _needsReload = false
    private _sections: UITableViewSection[] = []

    constructor() {
        super()
        this.alwaysBounceVertical = true
    }

    contentOffsetDidChanged() {
        this._layoutTableView()
    }

    layoutSubviews() {
        super.layoutSubviews()
        this._layoutTableView()
    }

    _updateSectionsCache() {
        this._sections.forEach((it) => {
            it.headerView && it.headerView.removeFromSuperview()
            it.footerView && it.footerView.removeFromSuperview()
        })
        this._sections = []
        const numberOfSections = this.numberOfSections()
        for (let section = 0; section < numberOfSections; section++) {
            const numberOfRowsInSection = this.numberOfRows(section)
            const sectionRecord = new UITableViewSection()
            const rowHeights = Array(numberOfRowsInSection).fill(0).map((_, row) => {
                return this.heightForRow(new UIIndexPath(row, section))
            })
            const totalRowsHeight = rowHeights.length > 0 ? rowHeights.reduce((a, b) => a + b) : 0.0
            const headerView = this.viewForHeader(section)
            if (headerView) {
                this.addSubview(headerView)
                sectionRecord.headerView = headerView
                sectionRecord.headerHeight = this.heightForHeader(section)
            }
            else {
                sectionRecord.headerHeight = 0.0
            }
            const footerView = this.viewForHeader(section)
            if (footerView) {
                this.addSubview(footerView)
                sectionRecord.footerView = footerView
                sectionRecord.footerHeight = this.heightForFooter(section)
            }
            else {
                sectionRecord.footerHeight = 0.0
            }
            sectionRecord.rowsHeight = totalRowsHeight
            sectionRecord.setNumberOfRows(numberOfRowsInSection, rowHeights)
            this._sections.push(sectionRecord)
        }
    }

    _updateSectionsCacheIfNeeded() {
        if (this._sections.length == 0) {
            this._updateSectionsCache()
        }
    }

    _setContentSize() {
        this._updateSectionsCacheIfNeeded()
        const headerHeight = this.tableHeaderView ? this.tableHeaderView.frame.height : 0.0
        const sectionsHeight = this._sections.length > 0 ? this._sections.map(it => it.sectionHeight()).reduce((a, b) => a + b) : 0.0
        const footerHeight = this.tableFooterView ? this.tableFooterView.frame.height : 0.0
        this.contentSize = {
            width: 0.0,
            height: headerHeight + sectionsHeight + footerHeight
        }
    }

    _layoutTableView() {
        const boundsSize = { width: this.bounds.width, height: this.bounds.height }
        const contentOffset = this.contentOffset.y
        const visibleBounds = { x: 0.0, y: contentOffset, width: boundsSize.width, height: boundsSize.height }
        var tableHeight = 0.0
        if (this.tableHeaderView) {
            this.tableHeaderView.frame = { x: 0.0, y: 0.0, width: boundsSize.width, height: this.tableHeaderView.frame.height }
            tableHeight += this.tableHeaderView.frame.height
        }
        const availableCells = this._cachedCells
        const numberOfSections = this._sections.length
        this._cachedCells = {}
        for (let section = 0; section < numberOfSections; section++) {
            const sectionRect = this._rectForSection(section)
            tableHeight += sectionRect.height
            if (UIRectIntersectsRect(sectionRect, visibleBounds)) {
                const headerRect = this._rectForHeaderInSection(section)
                const footerRect = this._rectForFooterInSection(section)
                const sectionRecord = this._sections[section]
                const numberOfRows = sectionRecord.numberOfRows
                if (sectionRecord.headerView) {
                    sectionRecord.headerView.frame = headerRect
                }
                if (sectionRecord.footerView) {
                    sectionRecord.footerView.frame = footerRect
                }
                var startIndex: number
                var left = 0
                var right = Math.max(0, sectionRecord.numberOfRows - 1)
                while (true) {
                    if (Math.abs(right - left) <= 1) {
                        startIndex = left
                        break
                    }
                    const mid = Math.ceil((right + left) / 2.0)
                    const indexPath = new UIIndexPath(mid, section)
                    const rowRect = this._rectForRowAtIndexPath(indexPath)
                    if (rowRect.y <= this.contentOffset.y && rowRect.y + rowRect.height >= this.contentOffset.y) {
                        startIndex = mid
                        break
                    }
                    else if (rowRect.y + rowRect.height < this.contentOffset.y) {
                        left = mid
                    }
                    else if (rowRect.y > this.contentOffset.y) {
                        right = mid
                    }
                }
                var renderCount = 0
                for (let row = startIndex; row < numberOfRows; row++) {
                    renderCount++
                    const indexPath = new UIIndexPath(row, section)
                    const rowRect = this._rectForRowAtIndexPath(indexPath)
                    if (UIRectIntersectsRect(rowRect, visibleBounds) && rowRect.height > 0) {
                        var cell = availableCells[indexPath.mapKey()] || this.cellForRow(indexPath)
                        cell.currentIndexPath = indexPath
                        cell.currentSectionRecord = sectionRecord
                        this._cachedCells[indexPath.mapKey()] = cell
                        delete availableCells[indexPath.mapKey()]
                        cell.highlighted = this._highlightedRow == indexPath.mapKey()
                        cell.emit("highlighted", cell, cell.highlighted, false)
                        cell.selected = this._selectedRows.indexOf(indexPath.mapKey()) >= 0
                        cell.emit("selected", cell, cell.selected, false)
                        cell.frame = rowRect
                        cell.backgroundColor = this.backgroundColor
                        if (cell.superview == undefined) {
                            this.addSubview(cell)
                        }
                        cell.hidden = false
                    }
                    else if (renderCount > 10) {
                        break
                    }
                }
            }
        }
        Object.keys(availableCells).forEach(key => {
            const cell = availableCells[key]
            if (cell.reuseIdentifier) {
                this._reusableCells.push(cell)
            }
            else {
                cell.hidden = true
            }
        })
        const allCachedCells = Object.keys(this._cachedCells).map(it => this._cachedCells[it])
        this._reusableCells.forEach(cell => {
            if (UIRectIntersectsRect(cell.frame, visibleBounds) && allCachedCells.indexOf(cell) < 0) {
                cell.hidden = true
            }
        })
        if (this.tableFooterView) {
            this.tableFooterView.frame = { x: 0.0, y: tableHeight, width: boundsSize.width, height: this.tableFooterView.frame.height }
        }
    }

    _rectForSection(section: number): UIRect {
        this._updateSectionsCacheIfNeeded()
        return this._UIRectFromVerticalOffset(this._offsetForSection(section), this._sections[section].sectionHeight())
    }

    _rectForHeaderInSection(section: number): UIRect {
        this._updateSectionsCacheIfNeeded()
        return this._UIRectFromVerticalOffset(this._offsetForSection(section), this._sections[section].headerHeight)
    }

    _rectForFooterInSection(section: number): UIRect {
        this._updateSectionsCacheIfNeeded()
        const sectionRecord = this._sections[section]
        var offset = this._offsetForSection(section)
        offset += sectionRecord.headerHeight
        offset += sectionRecord.rowsHeight
        return this._UIRectFromVerticalOffset(offset, this._sections[section].footerHeight)
    }

    _rectForRowAtIndexPath(indexPath: UIIndexPath): UIRect {
        this._updateSectionsCacheIfNeeded()
        if (indexPath.section < this._sections.length) {
            const sectionRecord = this._sections[indexPath.section]
            if (indexPath.row < sectionRecord.numberOfRows) {
                var offset = this._offsetForSection(indexPath.section)
                offset += sectionRecord.headerHeight
                for (let currentRow = 0; currentRow < indexPath.row; currentRow++) {
                    offset += sectionRecord.rowHeights[currentRow]
                }
                return this._UIRectFromVerticalOffset(offset, sectionRecord.rowHeights[indexPath.row])
            }
        }
        return UIRectZero
    }

    _offsetForSection(section: number): number {
        let offset = this.tableHeaderView ? this.tableHeaderView.frame.height : 0.0
        for (let it = 0; it < section; it++) {
            offset += this._sections[it].sectionHeight()

        }
        return offset
    }

    _cellForRow(indexPath: UIIndexPath): UITableViewCell | undefined {
        return this._cachedCells[indexPath.mapKey()]
    }

    _UIRectFromVerticalOffset(offset: number, height: number): UIRect {
        return { x: 0.0, y: offset, width: this.bounds.width, height: height }
    }

    // Touches

    touchesBegan(touches: UITouch[]) {
        super.touchesBegan(touches)
        const firstTouch = touches[0]
        if (firstTouch === undefined) {
            return
        }
        this.handleTouch(UITouchPhase.began, firstTouch)
    }

    touchesMoved(touches: UITouch[]) {
        super.touchesMoved(touches)
        const firstTouch = touches[0]
        if (firstTouch === undefined) {
            return
        }
        this.handleTouch(UITouchPhase.moved, firstTouch)
    }

    touchesEnded(touches: UITouch[]) {
        super.touchesEnded(touches)
        const firstTouch = touches[0]
        if (firstTouch === undefined) {
            return
        }
        this.handleTouch(UITouchPhase.ended, firstTouch)
    }

    touchesCancelled(touches: UITouch[]) {
        super.touchesCancelled(touches)
        const firstTouch = touches[0]
        if (firstTouch === undefined) {
            return
        }
        this.handleTouch(UITouchPhase.cancelled, firstTouch)
    }

    private firstTouchPoint: UIPoint | undefined = undefined

    private firstTouchCell: UITableViewCell | undefined = undefined

    private handleTouch(phase: UITouchPhase, currentTouch: UITouch) {
        if (!this.allowsSelection) { return }
        switch (phase) {
            case UITouchPhase.began: {
                if (!this.tracking) {
                    var hitTestView: UIView | undefined = currentTouch.view
                    var cellShouldHighlighted = true
                    while (hitTestView !== undefined) {
                        if (hitTestView instanceof UITableViewCell) {
                            break
                        }
                        if (hitTestView.gestureRecognizers.length > 0) {
                            cellShouldHighlighted = false
                        }
                        hitTestView = hitTestView.superview
                    }
                    if (cellShouldHighlighted) {
                        this.firstTouchPoint = currentTouch.windowPoint
                        if (hitTestView instanceof UITableViewCell) {
                            this.firstTouchCell = hitTestView
                            setTimeout(() => {
                                if (!(hitTestView instanceof UITableViewCell) || this.firstTouchPoint === undefined) { return }
                                if (hitTestView.currentIndexPath) {
                                    this._highlightedRow = hitTestView.currentIndexPath.mapKey()
                                }
                                hitTestView.highlighted = true
                                hitTestView.emit("highlighted", hitTestView, true, false)
                            }, 150)
                        }
                    }
                }
                break;
            }
            case UITouchPhase.moved: {
                if (this.firstTouchPoint !== undefined && currentTouch.windowPoint) {
                    if (UIView.recognizedGesture !== undefined || Math.abs((currentTouch.windowPoint.y) - this.firstTouchPoint.y) > 8) {
                        this._highlightedRow = undefined
                        Object.keys(this._cachedCells).map(it => this._cachedCells[it]).forEach((it) => {
                            it.highlighted = false
                            it.emit("highlighted", it, true, false)
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
                    this._highlightedRow = undefined
                    if (!this.allowsMultipleSelection) {
                        this._selectedRows.forEach((indexPathKey) => {
                            Object.keys(this._cachedCells).map(it => this._cachedCells[it]).forEach((it) => {
                                if (it.currentIndexPath && it.currentIndexPath.mapKey() === indexPathKey) {
                                    it.selected = false
                                    it.emit("selected", it, false, false)
                                    this.emit("didDeselectRow", it.currentIndexPath, it)
                                }
                            })
                        })
                        this._selectedRows = []
                    }
                    this.firstTouchPoint = undefined
                    this.firstTouchCell = undefined
                    this._highlightedRow = undefined
                    Object.keys(this._cachedCells).map(it => this._cachedCells[it]).forEach((it) => {
                        it.highlighted = false
                        it.emit("highlighted", it, false, false)
                    })
                    if (cell.currentIndexPath) {
                        const it = cell.currentIndexPath.mapKey()
                        const idx = this._selectedRows.indexOf(it)
                        if (idx >= 0) {
                            this._selectedRows.splice(idx, 1)
                        }
                        else {
                            this._selectedRows.push(it)
                        }
                    }
                    cell.selected = !cell.selected
                    cell.emit("selected", cell, cell.selected, false)
                    if (cell.selected) {
                        if (cell.currentIndexPath) {
                            this.didSelectRow(cell.currentIndexPath)
                        }
                        this.emit("didSelectRow", cell.currentIndexPath, cell)
                    }
                    else {
                        if (cell.currentIndexPath) {
                            this.didDeselectRow(cell.currentIndexPath)
                        }
                        this.emit("didDeselectRow", cell.currentIndexPath, cell)
                    }
                }
                else {
                    this.firstTouchPoint = undefined
                    this.firstTouchCell = undefined
                    this._highlightedRow = undefined
                    Object.keys(this._cachedCells).map(it => this._cachedCells[it]).forEach((it) => {
                        it.highlighted = false
                        it.emit("highlighted", it, false, false)
                    })
                }
                break;
            }
            case UITouchPhase.cancelled: {
                this.firstTouchPoint = undefined
                this.firstTouchCell = undefined
                this._highlightedRow = undefined
                Object.keys(this._cachedCells).map(it => this._cachedCells[it]).forEach((it) => {
                    it.highlighted = false
                    it.emit("highlighted", it, false, false)
                })
                break;
            }
        }
    }

}

class UITableViewSection {

    rowsHeight: number = 0.0

    headerHeight: number = 0.0

    footerHeight: number = 0.0

    numberOfRows: number = 0

    rowHeights: number[] = []

    headerView: UIView | undefined = undefined

    footerView: UIView | undefined = undefined

    sectionHeight(): number {
        return this.headerHeight + this.rowsHeight + this.footerHeight
    }

    setNumberOfRows(rows: number, rowHeights: number[]) {
        this.numberOfRows = rows
        this.rowHeights = rowHeights
    }

}

export class UITableViewCell extends UIView {

    selectionView: UIView = new UIView()

    contentView: UIView = new UIView()

    reuseIdentifier: string | undefined = undefined

    hasSelectionStyle: boolean = true

    private _selected: boolean = false

	public get selected(): boolean  {
		return this._selected;
	}

	public set selected(value: boolean ) {
        this._selected = value;
        this.onStateChanged()
	}

    private _highlighted: boolean = false

	public get highlighted(): boolean  {
		return this._highlighted;
	}

	public set highlighted(value: boolean ) {
        this._highlighted = value;
        this.onStateChanged()
	}

    currentIndexPath: UIIndexPath | undefined = undefined

    currentSectionRecord: UITableViewSection | undefined = undefined

    constructor() {
        super()
        this.selectionView.alpha = 0.0
        this.selectionView.backgroundColor = new UIColor(0xd0 / 255.0, 0xd0 / 255.0, 0xd0 / 255.0, 1.0)
        this.contentView.backgroundColor = UIColor.white
        this.addSubview(this.selectionView)
        this.addSubview(this.contentView)
    }

    restoringContentViewBackgroundColor: UIColor | undefined = undefined

    onStateChanged() {
        if (this.hasSelectionStyle) {
            if (this.selected || this.highlighted) {
                if (this.restoringContentViewBackgroundColor == undefined) {
                    this.restoringContentViewBackgroundColor = this.contentView.backgroundColor
                }
                this.selectionView.alpha = 1.0
                this.contentView.backgroundColor = UIColor.clear
            }
            else {
                this.selectionView.alpha = 0.0
                if (this.restoringContentViewBackgroundColor != undefined) {
                    this.contentView.backgroundColor = this.restoringContentViewBackgroundColor
                    this.restoringContentViewBackgroundColor = undefined
                }
            }
        }
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.selectionView.frame = this.bounds
        this.contentView.frame = this.bounds
    }

}