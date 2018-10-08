/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class FooCell extends UITableViewCell {

    aLabel = new UILabel

    constructor(context: any) {
        super(context)
        this.contentView.addSubview(this.aLabel)
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.aLabel.frame = this.bounds
    }

}

const tableView = new UITableView
tableView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }
tableView.register((context: any) => {
    return new FooCell(context)
}, "Cell")
tableView.on("numberOfRows", () => 100)
tableView.on("cellForRow", (indexPath: UIIndexPath) => {
    const cell = tableView.dequeueReusableCell("Cell", indexPath) as FooCell
    cell.aLabel.text = "index = " + indexPath.row
    return cell
})
tableView.on("didSelectRow", (indexPath: UIIndexPath) => {
    tableView.deselectRow(indexPath, true)
})
tableView.reloadData()
global.aView = tableView


// console.log(img.size)