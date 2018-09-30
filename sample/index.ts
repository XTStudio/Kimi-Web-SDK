/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

const scrollView = new UIScrollView
scrollView.frame = { x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height }

const pv = new UIProgressView
pv.frame = { x: 44, y: 44, width: 200, height: 2 }
pv.progress = 0.0
DispatchQueue.main.asyncAfter(2.0, () => {
    pv.setProgress(1.0, true)
})
scrollView.addSubview(pv)

global.aView = scrollView


// console.log(img.size)