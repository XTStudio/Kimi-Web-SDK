/// <reference path="../node_modules/xt-studio/types/index.d.ts" />

const names = [
  {
    letter: "A",
    items: [
      "Apple Inc.",
    ],
  },
  {
    letter: "B",
    items: [
      "Benji",
      "Bob",
    ],
  },
  {
    letter: "D",
    items: [
      "Dad",
    ],
  },
  {
    letter: "G",
    items: [
      "Gill",
      "God B",
      "Google Inc.",
    ],
  },
  {
    letter: "J",
    items: [
      "Jack",
      "Jiwa",
    ],
  },
  {
    letter: "K",
    items: [
      "Kate",
    ],
  },
  {
    letter: "M",
    items: [
      "Mary",
      "Max",
      "Mother",
    ],
  },
  {
    letter: "P",
    items: [
      "Penny",
      "Pony",
    ],
  },
  {
    letter: "S",
    items: [
      "Soso",
      "Son",
      "Susu",
      "Soso",
    ],
  },
]

class ItemCell extends UITableViewCell {

  nameLabel = new UILabel

  constructor(context: any) {
    super(context)
    this.contentView.addSubview(this.nameLabel)
  }

  layoutSubviews() {
    super.layoutSubviews()
    this.nameLabel.frame = { x: 16, y: 0, width: this.bounds.width - 16, height: this.bounds.height }
  }

}

class SectionHeaderView extends UIView {

  titleLabel = new UILabel

  constructor(title: string) {
    super()
    this.backgroundColor = new UIColor(0.9, 0.9, 0.9, 1.0)
    this.titleLabel.text = title
    this.addSubview(this.titleLabel)
  }

  layoutSubviews() {
    super.layoutSubviews()
    this.titleLabel.frame = { x: 16, y: 0, width: this.bounds.width - 16, height: this.bounds.height }
  }

}

class MainViewController extends UIViewController {

  tableView = new UITableView

  viewDidLoad() {
    super.viewDidLoad()
    this.setupTableView()
  }

  setupTableView() {
    this.tableView.frame = { x: 44, y: 44, width: 300, height: 300 }
    this.tableView.register((context: any) => {
      return new ItemCell(context)
    }, "Cell")
    // setup data source
    this.tableView.on("numberOfSections", () => names.length)
    this.tableView.on("numberOfRows", (inSection: number) => names[inSection].items.length)
    this.tableView.on("heightForRow", () => 44)
    this.tableView.on("cellForRow", (indexPath: UIIndexPath) => {
      const cell = this.tableView.dequeueReusableCell("Cell", indexPath) as ItemCell
      cell.nameLabel.text = names[indexPath.section].items[indexPath.row]
      return cell
    })
    // setup section header
    this.tableView.on("heightForHeader", () => 22)
    this.tableView.on("viewForHeader", (inSection: number) => {
      return new SectionHeaderView(names[inSection].letter)
    })
    this.tableView.reloadData()
    this.view.addSubview(this.tableView)
  }

  viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews()
    this.tableView.frame = this.view.bounds
  }

}

class E extends UIViewController {

  scrollView = new UIScrollView()

  viewDidLoad() {
    super.viewDidLoad()
    for (let index = 0; index < 1000; index++) {
      const view = new UIView
      view.frame = UIRectMake(0, index * 44, 88, 22)
      view.backgroundColor = UIColor.gray
      view.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
        view.backgroundColor = UIColor.red
      }))
      this.scrollView.addSubview(view)
    }
    this.scrollView.contentSize = { width: 0, height: 40000 }
    this.view.addSubview(this.scrollView)
  }

  viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews()
    this.scrollView.frame = this.view.bounds
  }

}

global.main = new MainViewController