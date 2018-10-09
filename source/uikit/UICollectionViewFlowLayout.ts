import { UISize, UISizeZero } from "./UISize";
import { UIRect, UIRectZero, UIRectUnion, UIRectIntersectsRect, UIRectIsEmpty } from "./UIRect";
import { UIEdgeInsets, UIEdgeInsetsZero } from "./UIEdgeInsets";
import { UICollectionViewLayout, ItemType, UICollectionElementKindCell, UICollectionViewLayoutAttributes } from "./UICollectionView";
import { UIIndexPath } from "./UIIndexPath";

export enum UICollectionViewScrollDirection {
    vertical,
    horizontal
}

const UIFlowLayoutCommonRowHorizontalAlignmentKey = "UIFlowLayoutCommonRowHorizontalAlignmentKey"
const UIFlowLayoutLastRowHorizontalAlignmentKey = "UIFlowLayoutLastRowHorizontalAlignmentKey"
const UIFlowLayoutRowVerticalAlignmentKey = "UIFlowLayoutRowVerticalAlignmentKey"
const UICollectionElementKindSectionHeader = "UICollectionElementKindSectionHeader"
const UICollectionElementKindSectionFooter = "UICollectionElementKindSectionFooter"

export enum UIFlowLayoutHorizontalAlignment {
    left,
    center,
    right,
    justify,
}

class UIGridLayoutInfo {

    sections: UIGridLayoutSection[] = []
    rowAlignmentOptions: { [key: string]: any } = {}
    usesFloatingHeaderFooter = false
    dimension: number = 0.0
    horizontal = false
    leftToRight = false
    contentSize: UISize = UISizeZero
    private _isValid = false

    frameForItemAtIndexPath(indexPath: UIIndexPath): UIRect {
        const section = this.sections[indexPath.section]
        let itemFrame: UIRect
        if (section.fixedItemSize) {
            itemFrame = { x: 0.0, y: 0.0, width: section.itemSize.width, height: section.itemSize.height }
        }
        else {
            itemFrame = section.items[indexPath.row].itemFrame
        }
        return itemFrame
    }

    addSection(): UIGridLayoutSection {
        const section = new UIGridLayoutSection()
        section.rowAlignmentOptions = this.rowAlignmentOptions
        section.layoutInfo = this
        this.sections.push(section)
        this.invalidate(false)
        return section
    }

    invalidate(arg: Boolean) {
        this._isValid = false
    }

    snapshot(): UIGridLayoutInfo {
        const layoutInfo = new UIGridLayoutInfo()
        layoutInfo.sections = this.sections.slice(0)
        layoutInfo.rowAlignmentOptions = this.rowAlignmentOptions
        layoutInfo.usesFloatingHeaderFooter = this.usesFloatingHeaderFooter
        layoutInfo.dimension = this.dimension
        layoutInfo.horizontal = this.horizontal
        layoutInfo.leftToRight = this.leftToRight
        layoutInfo.contentSize = { ...this.contentSize }
        return layoutInfo
    }

}

class UIGridLayoutSection {

    items: UIGridLayoutItem[] = []
    rows: UIGridLayoutRow[] = []
    fixedItemSize: boolean = false
    itemSize: UISize = UISizeZero

    private _itemsCount: number = 0

    public get itemsCount(): number {
        return this.fixedItemSize ? this._itemsCount : this.items.length;
    }

    public set itemsCount(value: number) {
        this._itemsCount = value;
    }

    verticalInterstice: number = 0.0
    horizontalInterstice: number = 0.0
    sectionMargins: UIEdgeInsets = UIEdgeInsetsZero

    frame = UIRectZero
    headerFrame = UIRectZero
    footerFrame = UIRectZero
    headerDimension: number = 0.0
    footerDimension: number = 0.0
    layoutInfo: UIGridLayoutInfo | undefined = undefined
    rowAlignmentOptions: { [key: string]: any } = {}

    otherMargin: number = 0.0
    beginMargin: number = 0.0
    endMargin: number = 0.0
    actualGap: number = 0.0
    lastRowBeginMargin: number = 0.0
    lastRowEndMargin: number = 0.0
    lastRowActualGap: number = 0.0
    lastRowIncomplete = false
    itemsByRowCount = 0
    indexOfImcompleteRow = 0

    private _isValid = false

    recomputeFromIndex(index: number) {
        this.invalidate()
        this.computeLayout()
    }

    invalidate() {
        this._isValid = false
        this.rows = []
    }

    computeLayout() {
        if (!this._isValid) {
            const layoutInfo = this.layoutInfo
            if (layoutInfo === undefined) {
                return
            }
            const sectionSize = { width: 0.0, height: 0.0 }
            var rowIndex = 0
            var itemIndex = 0
            var itemsByRowCount = 0
            var dimensionLeft = 0.0
            var row: UIGridLayoutRow | undefined = undefined
            const headerFooterDimension: number = layoutInfo.dimension
            var dimension = headerFooterDimension
            if (layoutInfo.horizontal) {
                dimension -= this.sectionMargins.top + this.sectionMargins.bottom
                this.headerFrame = { x: sectionSize.width, y: 0.0, width: this.headerDimension, height: headerFooterDimension }
                sectionSize.width += this.headerDimension + this.sectionMargins.right
            }
            else {
                dimension -= this.sectionMargins.left + this.sectionMargins.right
                this.headerFrame = { x: 0.0, y: sectionSize.height, width: headerFooterDimension, height: this.headerDimension }
                sectionSize.height += this.headerDimension + this.sectionMargins.top
            }
            const spacing = layoutInfo.horizontal ? this.verticalInterstice : this.horizontalInterstice
            while (itemIndex <= this.itemsCount) {
                const finishCycle = itemIndex >= this.itemsCount
                var item: UIGridLayoutItem | undefined = undefined
                if (!finishCycle) {
                    item = this.fixedItemSize ? undefined : this.items[itemIndex]
                }
                const itemSize = this.fixedItemSize ? this.itemSize : (item && item.itemFrame ? { width: item.itemFrame.width, height: item.itemFrame.height } : { width: 0, height: 0 })
                var itemDimension = layoutInfo.horizontal ? itemSize.height : itemSize.width
                if (itemsByRowCount > 0) {
                    itemDimension += spacing
                }
                if (dimensionLeft < itemDimension || finishCycle) {
                    if (row) {
                        this.itemsByRowCount = Math.max(itemsByRowCount, this.itemsByRowCount)
                        row.itemCount = itemsByRowCount
                        if (!finishCycle) {
                            this.indexOfImcompleteRow = rowIndex
                        }
                        row.layoutRow()
                        if (layoutInfo.horizontal) {
                            row.rowFrame = { x: sectionSize.width, y: this.sectionMargins.top, width: row.rowSize.width, height: row.rowSize.height }
                            sectionSize.height = Math.max(row.rowSize.height, sectionSize.height)
                            sectionSize.width += row.rowSize.width + (finishCycle ? 0.0 : this.horizontalInterstice)
                        }
                        else {
                            row.rowFrame = { x: this.sectionMargins.left, y: sectionSize.height, width: row.rowSize.width, height: row.rowSize.height }
                            sectionSize.height += row.rowSize.height + (finishCycle ? 0.0 : this.verticalInterstice)
                            sectionSize.width = Math.max(row.rowSize.width, sectionSize.width)
                        }
                    }
                    if (!finishCycle) {
                        if (row) {
                            row.complete = true
                        }
                        row = this.addRow()
                        row.fixedItemSize = this.fixedItemSize
                        row.index = rowIndex
                        this.indexOfImcompleteRow = rowIndex
                        rowIndex++
                        if (itemsByRowCount > 0) {
                            itemDimension -= spacing
                        }
                        dimensionLeft = dimension - itemDimension
                        itemsByRowCount = 0
                    }
                }
                else {
                    dimensionLeft -= itemDimension
                }
                if (item && row) {
                    row.addItem(item)
                }
                itemIndex++
                itemsByRowCount++
            }
            if (layoutInfo.horizontal) {
                sectionSize.width += this.sectionMargins.right
                this.footerFrame = { x: sectionSize.width, y: 0.0, width: this.footerDimension, height: headerFooterDimension }
                sectionSize.width += this.footerDimension
            }
            else {
                sectionSize.height += this.sectionMargins.bottom
                this.footerFrame = { x: 0.0, y: sectionSize.height, width: headerFooterDimension, height: this.footerDimension }
                sectionSize.height += this.footerDimension
            }
            this.frame = { x: 0.0, y: 0.0, width: sectionSize.width, height: sectionSize.height }
            this._isValid = true
        }
    }

    addItem(): UIGridLayoutItem {
        const item = new UIGridLayoutItem()
        item.section = this
        this.items.push(item)
        return item
    }

    addRow(): UIGridLayoutRow {
        const item = new UIGridLayoutRow()
        item.section = this
        this.rows.push(item)
        return item
    }

    snapshot(): UIGridLayoutSection {
        const snapshotSection = new UIGridLayoutSection()
        snapshotSection.items = this.items.slice(0)
        snapshotSection.rows = this.rows.slice(0)
        snapshotSection.verticalInterstice = this.verticalInterstice
        snapshotSection.horizontalInterstice = this.horizontalInterstice
        snapshotSection.sectionMargins = this.sectionMargins
        snapshotSection.frame = this.frame
        snapshotSection.headerFrame = this.headerFrame
        snapshotSection.footerFrame = this.footerFrame
        snapshotSection.headerDimension = this.headerDimension
        snapshotSection.footerDimension = this.footerDimension
        snapshotSection.layoutInfo = this.layoutInfo
        snapshotSection.rowAlignmentOptions = this.rowAlignmentOptions
        snapshotSection.fixedItemSize = this.fixedItemSize
        snapshotSection.itemSize = this.itemSize
        snapshotSection.itemsCount = this.itemsCount
        snapshotSection.otherMargin = this.otherMargin
        snapshotSection.beginMargin = this.beginMargin
        snapshotSection.endMargin = this.endMargin
        snapshotSection.actualGap = this.actualGap
        snapshotSection.lastRowBeginMargin = this.lastRowBeginMargin
        snapshotSection.lastRowEndMargin = this.lastRowEndMargin
        snapshotSection.lastRowActualGap = this.lastRowActualGap
        snapshotSection.lastRowIncomplete = this.lastRowIncomplete
        snapshotSection.itemsByRowCount = this.itemsByRowCount
        snapshotSection.indexOfImcompleteRow = this.indexOfImcompleteRow
        return snapshotSection
    }

}

class UIGridLayoutItem {
    section: UIGridLayoutSection | undefined = undefined
    rowObject: UIGridLayoutRow | undefined = undefined
    itemFrame: UIRect = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 }
}

class UIGridLayoutRow {

    section: UIGridLayoutSection | undefined = undefined
    items: UIGridLayoutItem[] = []
    rowSize = UISizeZero
    rowFrame = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 }
    index = 0
    complete = false
    fixedItemSize = false

    private _itemCount: number = 0

    public get itemCount(): number {
        return this.fixedItemSize ? this._itemCount : this.items.length
    }

    public set itemCount(value: number) {
        this._itemCount = value;
    }

    private _isValid = false

    addItem(item: UIGridLayoutItem) {
        this.items.push(item)
        item.rowObject = this
        this.invalidate()
    }

    layoutRow() {
        this.layoutRowAndGenerateRectArray(false)
    }

    itemRects(): UIRect[] {
        return this.layoutRowAndGenerateRectArray(true) || []
    }

    invalidate() {
        this._isValid = false
        this.rowSize = UISizeZero
        this.rowFrame = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 }
    }

    snapshot(): UIGridLayoutRow {
        const snapshotRow = new UIGridLayoutRow()
        snapshotRow.section = this.section
        snapshotRow.items = this.items
        snapshotRow.rowSize = { ...this.rowSize }
        snapshotRow.rowFrame = { ...this.rowFrame }
        snapshotRow.index = this.index
        snapshotRow.complete = this.complete
        snapshotRow.fixedItemSize = this.fixedItemSize
        snapshotRow.itemCount = this.itemCount
        return snapshotRow
    }

    private layoutRowAndGenerateRectArray(generateRectArray: boolean): UIRect[] | undefined {
        const rects: UIRect[] | undefined = generateRectArray ? [] : undefined
        if (!this._isValid || generateRectArray) {
            const section = this.section
            if (section === undefined) {
                return undefined
            }
            const isHorizontal = section.layoutInfo && section.layoutInfo.horizontal ? true : false
            const isLastRow = section.indexOfImcompleteRow == this.index
            const horizontalAlignment = section.rowAlignmentOptions[isLastRow ? UIFlowLayoutLastRowHorizontalAlignmentKey : UIFlowLayoutCommonRowHorizontalAlignmentKey]
            if (horizontalAlignment === undefined) {
                return undefined
            }
            var leftOverSpace = section.layoutInfo && section.layoutInfo.dimension || 0.0
            if (isHorizontal) {
                leftOverSpace -= section.sectionMargins.top + section.sectionMargins.bottom
            }
            else {
                leftOverSpace -= section.sectionMargins.left + section.sectionMargins.right
            }
            var usedItemCount = 0
            var itemIndex = 0
            const spacing = isHorizontal ? section.verticalInterstice : section.horizontalInterstice
            while (itemIndex < this.itemCount || isLastRow) {
                var nextItemSize: number
                if (!this.fixedItemSize) {
                    const item = this.items[Math.min(itemIndex, this.itemCount - 1)]
                    nextItemSize = isHorizontal ? item.itemFrame.height : item.itemFrame.width
                }
                else {
                    nextItemSize = isHorizontal ? section.itemSize.height : section.itemSize.width
                }
                if (itemIndex > 0) {
                    nextItemSize += spacing
                }
                if (leftOverSpace < nextItemSize) {
                    break
                }
                leftOverSpace -= nextItemSize
                itemIndex++
                usedItemCount = itemIndex
            }
            var itemOffset = { x: 0, y: 0 }
            if (horizontalAlignment == UIFlowLayoutHorizontalAlignment.right) {
                itemOffset.x += leftOverSpace
            }
            else if (horizontalAlignment == UIFlowLayoutHorizontalAlignment.center ||
                (horizontalAlignment == UIFlowLayoutHorizontalAlignment.justify && usedItemCount == 1)) {
                itemOffset.x += leftOverSpace / 2.0
            }
            const interSpacing = usedItemCount <= 1 ? 0.0 : leftOverSpace / (usedItemCount - 1)
            var frame = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 }
            var itemFrame = { x: 0.0, y: 0.0, width: section.itemSize.width, height: section.itemSize.height }
            for (let itemIndex = 0; itemIndex < this.itemCount; itemIndex++) {
                var item: UIGridLayoutItem | undefined = undefined
                if (!this.fixedItemSize) {
                    item = this.items[itemIndex]
                    itemFrame = { ...item.itemFrame }
                }
                if (isHorizontal) {
                    itemFrame.y = itemOffset.y
                    itemOffset.y += itemFrame.height + section.verticalInterstice
                    if (horizontalAlignment == UIFlowLayoutHorizontalAlignment.justify) {
                        itemOffset.y += interSpacing
                    }
                }
                else {
                    itemFrame.x = itemOffset.x
                    itemOffset.x += itemFrame.width + section.horizontalInterstice
                    if (horizontalAlignment == UIFlowLayoutHorizontalAlignment.justify) {
                        itemOffset.x += interSpacing
                    }
                }
                const iFrame = { x: itemFrame.x, y: itemFrame.y, width: itemFrame.width, height: itemFrame.height }
                if (item) {
                    item.itemFrame = iFrame
                }
                if (rects) {
                    rects.push(iFrame)
                }
                frame = UIRectUnion(frame, iFrame)
            }
            this.rowSize = { width: frame.width, height: frame.height }
            this._isValid = true
        }
        return rects
    }

}

export class UICollectionViewFlowLayout extends UICollectionViewLayout {

    private _data: UIGridLayoutInfo | undefined = undefined

    minimumLineSpacing: number = 10.0

    minimumInteritemSpacing: number = 10.0

    itemSize: UISize = { width: 50.0, height: 50.0 }

    headerReferenceSize: UISize = UISizeZero

    footerReferenceSize: UISize = UISizeZero

    private _sectionInset: UIEdgeInsets = UIEdgeInsetsZero

    public get sectionInset(): UIEdgeInsets {
        return this._sectionInset;
    }

    public set sectionInset(value: UIEdgeInsets) {
        this._sectionInset = value;
        this.invalidateLayout()
    }

    scrollDirection: UICollectionViewScrollDirection = UICollectionViewScrollDirection.vertical

    rowAlignmentOptions: { [key: string]: any } = {
        [UIFlowLayoutCommonRowHorizontalAlignmentKey]: UIFlowLayoutHorizontalAlignment.justify,
        [UIFlowLayoutLastRowHorizontalAlignmentKey]: UIFlowLayoutHorizontalAlignment.justify,
        [UIFlowLayoutRowVerticalAlignmentKey]: 1,
    }

    prepareLayout() {
        super.prepareLayout()
        const data = new UIGridLayoutInfo()
        data.horizontal = this.scrollDirection == UICollectionViewScrollDirection.horizontal
        this._visibleBounds = this.collectionView ? this.collectionView.visibleBoundRects : UIRectZero
        data.dimension = data.horizontal ? this._visibleBounds.height : this._visibleBounds.width
        data.rowAlignmentOptions = this.rowAlignmentOptions
        this._data = data
        this.fetchItemsInfo()
    }

    layoutAttributesForElementsInRect(rect: UIRect): UICollectionViewLayoutAttributes[] {
        if (this._data == undefined) {
            this.prepareLayout()
        }
        const layoutAttributesArray: UICollectionViewLayoutAttributes[] = []
        const _data = this._data
        if (_data === undefined) {
            return []
        }
        _data.sections.forEach((section, sectionIndex) => {
            if (true || UIRectIntersectsRect(section.frame, rect)) {
                const rectCache = this.rectCache
                const normalizedHeaderFrame = { x: section.headerFrame.x + section.frame.x, y: section.headerFrame.y + section.frame.y, width: section.headerFrame.width, height: section.headerFrame.height }
                if (!UIRectIsEmpty(normalizedHeaderFrame) && UIRectIntersectsRect(normalizedHeaderFrame, rect)) {
                    const layoutAttributes = new this.layoutAttributesClass(new UIIndexPath(0, sectionIndex), UICollectionElementKindSectionHeader, ItemType.supplementaryView)
                    layoutAttributes.frame = normalizedHeaderFrame
                    layoutAttributesArray.push(layoutAttributes)
                }
                var itemRects = rectCache[sectionIndex]
                if (itemRects === undefined && section.fixedItemSize && section.rows.length > 0) {
                    itemRects = section.rows[0].itemRects()
                    if (itemRects != undefined) { rectCache[sectionIndex] = itemRects }
                }
                section.rows.forEach(row => {
                    const normalizedRowFrame = { x: row.rowFrame.x + section.frame.x, y: row.rowFrame.y + section.frame.y, width: row.rowFrame.width, height: row.rowFrame.height }
                    if (UIRectIntersectsRect(normalizedRowFrame, rect)) {
                        for (let itemIndex = 0; itemIndex < row.itemCount; itemIndex++) {
                            let layoutAttributes: UICollectionViewLayoutAttributes
                            let sectionItemIndex: number
                            let itemFrame: UIRect
                            if (row.fixedItemSize) {
                                itemFrame = itemRects[itemIndex] || UIRectZero
                                sectionItemIndex = row.index * section.itemsByRowCount + itemIndex
                            }
                            else {
                                const item = row.items[itemIndex]
                                sectionItemIndex = section.items.indexOf(item)
                                itemFrame = item.itemFrame
                            }
                            const normalizedItemFrame = { x: normalizedRowFrame.x + itemFrame.x, y: normalizedRowFrame.y + itemFrame.y, width: itemFrame.width, height: itemFrame.height }
                            if (UIRectIntersectsRect(normalizedItemFrame, rect)) {
                                layoutAttributes = new this.layoutAttributesClass(new UIIndexPath(sectionItemIndex, sectionIndex), UICollectionElementKindCell, ItemType.cell)
                                layoutAttributes.frame = normalizedItemFrame
                                layoutAttributesArray.push(layoutAttributes)
                            }
                        }
                    }
                })
                const normalizedFooterFrame = { x: section.footerFrame.x + section.frame.x, y: section.footerFrame.y + section.frame.y, width: section.footerFrame.width, height: section.footerFrame.height }
                if (!UIRectIsEmpty(normalizedFooterFrame) && UIRectIntersectsRect(normalizedFooterFrame, rect)) {
                    const layoutAttributes = new this.layoutAttributesClass(new UIIndexPath(0, sectionIndex), UICollectionElementKindSectionFooter, ItemType.supplementaryView)
                    layoutAttributes.frame = normalizedFooterFrame
                    layoutAttributesArray.push(layoutAttributes)
                }
            }
        })
        return layoutAttributesArray
    }

    layoutAttributesForItemAtIndexPath(indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        if (this._data === undefined) {
            this.prepareLayout()
        }
        const _data = this._data
        if (_data === undefined) {
            return undefined
        }
        const section = _data.sections[indexPath.section]
        var row: UIGridLayoutRow | undefined = undefined
        var itemFrame = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 }
        if (section.fixedItemSize && section.itemsByRowCount > 0 && indexPath.row / section.itemsByRowCount < section.rows.length) {
            row = section.rows[(indexPath.row / section.itemsByRowCount)]
            const itemIndex = (indexPath.row % section.itemsByRowCount)
            const itemRects = row.itemRects()
            itemFrame = itemRects[itemIndex]
        }
        else if (indexPath.row < section.items.length) {
            const item = section.items[indexPath.row]
            row = item.rowObject
            itemFrame = item.itemFrame
        }
        const layoutAttributes = new this.layoutAttributesClass(indexPath, UICollectionElementKindCell, ItemType.cell)
        if (row) {
            const normalizedRowFrame = { x: row.rowFrame.x + section.frame.x, y: row.rowFrame.y + section.frame.y, width: row.rowFrame.width, height: row.rowFrame.height }
            layoutAttributes.frame = { x: normalizedRowFrame.x + itemFrame.x, y: normalizedRowFrame.y + itemFrame.y, width: itemFrame.width, height: itemFrame.height }
        }
        return layoutAttributes
    }

    layoutAttributesForSupplementaryViewOfKind(kind: string, indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        if (this._data === undefined) {
            this.prepareLayout()
        }
        const _data = this._data
        if (_data === undefined) {
            return undefined
        }
        const sectionIndex = indexPath.section
        var layoutAttributes: UICollectionViewLayoutAttributes | undefined = undefined
        if (sectionIndex < _data.sections.length) {
            const section = _data.sections[sectionIndex]
            var normalizedFrame = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 }
            if (kind == UICollectionElementKindSectionHeader) {
                normalizedFrame = section.headerFrame
            }
            else if (kind == UICollectionElementKindSectionFooter) {
                normalizedFrame = section.footerFrame
            }
            if (!UIRectIsEmpty(normalizedFrame)) {
                normalizedFrame = { x: normalizedFrame.x + section.frame.x, y: normalizedFrame.y + section.frame.y, width: normalizedFrame.width, height: normalizedFrame.height }
                layoutAttributes = new this.layoutAttributesClass(new UIIndexPath(0, sectionIndex), kind, ItemType.supplementaryView)
                layoutAttributes.frame = normalizedFrame
            }
        }
        return layoutAttributes
    }

    layoutAttributesForDecorationViewOfKind(kind: String, indexPath: UIIndexPath): UICollectionViewLayoutAttributes | undefined {
        return undefined
    }

    collectionViewContentSize(): UISize {
        if (this._data === undefined) {
            this.prepareLayout()
        }
        const _data = this._data
        if (_data === undefined) {
            return super.collectionViewContentSize()
        }
        return _data.contentSize
    }

    invalidateLayout() {
        super.invalidateLayout()
        this.rectCache = []
        this._data = undefined
    }

    __sizeForItem(indexPath: UIIndexPath): UISize {
        return this.val("sizeForItem", indexPath) || this.itemSize
    }

    __insetForSection(inSection: number): UIEdgeInsets {
        return this.val("insetForSection", inSection) || this.sectionInset
    }

    __minimumLineSpacing(inSection: number): number {
        const value = this.val("minimumLineSpacing", inSection)
        return typeof value === "number" ? value : this.minimumLineSpacing
    }

    __minimumInteritemSpacing(inSection: number): number {
        const value = this.val("minimumInteritemSpacing", inSection)
        return typeof value === "number" ? value : this.minimumInteritemSpacing
    }

    __referenceSizeForHeader(inSection: number): UISize {
        return this.headerReferenceSize
    }

    __referenceSizeForFooter(inSection: number): UISize {
        return this.footerReferenceSize
    }

    private _visibleBounds: UIRect = UIRectZero

    private rectCache: UIRect[][] = []

    private fetchItemsInfo() {
        this.getSizingInfos()
        this.updateItemsLayout()
    }

    private getSizingInfos() {
        const _data = this._data
        if (_data === undefined) {
            return
        }
        const collectionView = this.collectionView
        if (collectionView === undefined) {
            return
        }
        const numberOfSections = collectionView.numberOfSections()
        for (let section = 0; section < numberOfSections; section++) {
            const layoutSection = _data.addSection()
            layoutSection.verticalInterstice = _data.horizontal ? this.__minimumInteritemSpacing(section) : this.__minimumLineSpacing(section)
            layoutSection.horizontalInterstice = !_data.horizontal ? this.__minimumInteritemSpacing(section) : this.__minimumLineSpacing(section)
            layoutSection.sectionMargins = this.__insetForSection(section)
            layoutSection.headerDimension = _data.horizontal ? this.__referenceSizeForHeader(section).width : this.__referenceSizeForHeader(section).height
            layoutSection.footerDimension = _data.horizontal ? this.__referenceSizeForFooter(section).width : this.__referenceSizeForFooter(section).height
            const numberOfItems = collectionView.numberOfItemsInSection(section)
            for (let item = 0; item < numberOfItems; item++) {
                const indexPath = new UIIndexPath(item, section)
                const itemSize = this.__sizeForItem(indexPath)
                const layoutItem = layoutSection.addItem()
                layoutItem.itemFrame = { x: 0.0, y: 0.0, width: itemSize.width, height: itemSize.height }
            }
        }
    }

    private updateItemsLayout() {
        const _data = this._data
        if (_data === undefined) {
            return
        }
        var contentSize = { width: 0, height: 0 }
        _data.sections.forEach((section) => {
            section.computeLayout()
            const sectionFrame = { ...section.frame }
            if (_data.horizontal) {
                sectionFrame.x += contentSize.width
                contentSize.width += section.frame.width + section.frame.x
                contentSize.height = Math.max(contentSize.height, sectionFrame.height + section.frame.y + section.sectionMargins.top + section.sectionMargins.bottom)
            }
            else {
                sectionFrame.y += contentSize.height
                contentSize.height += sectionFrame.height + section.frame.y
                contentSize.width = Math.max(contentSize.width, sectionFrame.width + section.frame.x + section.sectionMargins.left + section.sectionMargins.right)
            }
            section.frame = { x: sectionFrame.x, y: sectionFrame.y, width: sectionFrame.width, height: sectionFrame.height }
        })
        _data.contentSize = { width: contentSize.width, height: contentSize.height }
    }

}