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
       this.nameLabel.frame = {x: 16, y: 0, width: this.bounds.width - 16, height: this.bounds.height}
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
      this.titleLabel.frame = {x: 16, y: 0, width: this.bounds.width - 16, height: this.bounds.height}
    }
    
  }
  
  class MainViewController extends UIViewController {
  
    tableView = new UITableView
    
    viewDidLoad() {
      super.viewDidLoad()
      this.setupTableView()
    }
  
    setupTableView() {
      this.tableView.layer.borderWidth = 1
      this.tableView.layer.borderColor = UIColor.black
      this.tableView.frame = {x: 0, y: 0, width: 200, height: 300}
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
  
  }
  
  global.main = new MainViewController