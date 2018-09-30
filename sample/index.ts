/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const scrollView = new UIScrollView
scrollView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }

// const aLabel = new UILabel
// aLabel.frame = { x: 0, y: 44, width: 300, height: 100 }
// aLabel.backgroundColor = UIColor.yellow
// aLabel.text = "Hello, World!"
// aLabel.textColor = UIColor.red
// aLabel.font = new UIFont(14)
// aLabel.numberOfLines = 0
// ;console.log((aLabel as any).intrinsicContentSize())
// scrollView.addSubview(aLabel)

const img = new UIImage({ name: "location@2x.png", base64: "iVBORw0KGgoAAAANSUhEUgAAAB0AAAAjCAMAAABfPfHgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAD2UExURUdwTP84VP85U/9VVf83V/83Vf84VP8zTP84U/85VP84VP84VP85U/85U/85VP84VP86Vf84VP85U/84Vf84Vf88Vf84VP85U/85U/84U/85VP85Uf85Vf8/Vf84VP8/P/84Vf84VP85VP8qVf8AAP81Vf8zZv84U/8/X/83Uv85U/81V/84U/84Vf85U/9ISP83WP85Uv86WP84U/85VP84U/84VP85VP85VP85U/85Vf85U/85VP85U/84VP85U/85U/84VP84U/83Vf85U/85Uf84VP84VP85U/84Vf85U/84VP85VP84VP84U/84Vf84VP85VP/xwSoAAABRdFJOUwD78AMge7wK/P7mnWu3zcIwrEN1GxWCWTru2jV4DPgECce/BgEYBeUIJdUmq36NBxc+GmipnnlzfJZLm7LMs9ZMmply2yzptY8tqMGO79hs1FUFrfcAAAEkSURBVBgZdcGHQoJgGAXQC4KAe9vQLMtZmu299+6+/8skfvwypHMwt5/Z+dapPxZ/9hFVKNpU7GIBQf1Pm0H2ax9znRyjch14qitctFLFzO4V4+R24Roz3hhTTxrjaW8ADqmkaqVCqZaisgNMNHqOmnA10/RoExzQk4aSpucA7xQpC4rVozjEL4UJn0kxhE6xBN8ShQ56DPgMCgdfFKvwrVI8I09xAt8DxQdGFDctKK0hxQjbDsUpFJPC2QaSFE55C66tskORBLBHJV+vbFbqeSp7mMoy3gtcgzXGWRtg5phxTIjEBhdtJOAxlhm1bGDu3GaYfYuABsMaCDlj0D3CEpf0XW8iwmpTaVtYYCUpkhZirGfpyq4jVveO5EUX/8n0Mgj6A8R+sSkxxWjZAAAAAElFTkSuQmCC" })
// const iv = new UIImageView
// iv.loadImageWithURLString("https://file.calicali.cc/7e4e1072ef957f231ebc.jpg", img)
// iv.frame = { x: 44, y: 44, width: 300, height: 300 }
// iv.contentMode = UIViewContentMode.scaleAspectFill
// scrollView.addSubview(iv)


const button = new UIButton
button.setTitle("Hello, World!", UIControlState.normal)
button.setImage(img, UIControlState.normal)
button.backgroundColor = UIColor.yellow
button.frame = { x: 44, y: 44, width: 250, height: 44 }
button.titleEdgeInsets = { top: 0, left: 4, bottom: 0, right: 0 }
button.imageEdgeInsets = { top: 0, left: 0, bottom: 0, right: 4 }
button.on("touchUpInside", () => {
    button.backgroundColor = UIColor.gray
})
scrollView.addSubview(button)

global.aView = scrollView
global.img = img


// console.log(img.size)