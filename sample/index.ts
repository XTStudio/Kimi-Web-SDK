/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class FooCell extends UICollectionViewCell {

    aLabel = new UILabel

    constructor(context: any) {
        super(context)
        this.aLabel.backgroundColor = UIColor.yellow
        this.on("highlighted", (_, highlighted: boolean) => {
            this.aLabel.backgroundColor = highlighted ? UIColor.red : UIColor.yellow
        })
        this.on("selected", (_, selected: boolean) => {
            this.aLabel.backgroundColor = selected ? UIColor.red : UIColor.yellow
        })
        this.contentView.addSubview(this.aLabel)
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.aLabel.frame = this.bounds
    }

}

var count = 100

const layout = new UICollectionViewFlowLayout
layout.on("sizeForItem", () => {
    return { width: 40, height: 40 }
})
layout.on("insetForSection", () => {
    return { top: 8, left: 8, bottom: 8, right: 8 }
})
layout.on("minimumInteritemSpacing", () => 30)
layout.on("minimumLineSpacing", () => 30)
const collectionView = new UICollectionView(layout)
collectionView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }
collectionView.register((context: any) => {
    return new FooCell(context)
}, "Cell")
collectionView.on("numberOfItems", () => count)
collectionView.on("cellForItem", (indexPath: UIIndexPath) => {
    const cell = collectionView.dequeueReusableCell("Cell", indexPath) as FooCell
    // cell.aLabel.text = "index = " + indexPath.row
    return cell
})
collectionView.on("didSelectItem", (indexPath: UIIndexPath) => {
    collectionView.deselectItem(indexPath, true)
})
collectionView.reloadData()

const refreshControl = new UIRefreshControl
refreshControl.on("refresh", (sender) => {
    DispatchQueue.main.asyncAfter(3.0, () => {
        sender.endRefreshing()
    })
})
collectionView.addSubview(refreshControl)

collectionView.addSubview(new UIFetchMoreControl().on("fetch", (sender) => {
    count += 100
    collectionView.reloadData()
    sender.endFetching()
}))

global.aView = collectionView
// console.log(img.size)