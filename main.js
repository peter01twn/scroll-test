class Scroll {
  constructor(el) {
    this.el = el
    this.DOMNode = null
    this.timeInterval = 300
    this.counter = null
    this.callback = null
  }

  _scrollHandler = e => {
    clearTimeout(this.counter)
    this.counter = setTimeout(() => {
      this.callback(e)
    }, this.timeInterval);
  }
  
  init(el = this.el) {
    if (el === 'window') {
      this.DOMNode = window
    } else {
      this.DOMNode = document.querySelector(el)
    }
    this.DOMNode.addEventListener('scroll', this._scrollHandler)
    return this
  }
  
  scrollEnd(callback) {
    this.callback = callback
  }
}

class ScrollAnimation {
  constructor() {
    this.status = 'stop' // stop | play
    this.start = null
    this.end = null
    this.timeInterval = null
    this.step = 0
    this.duration = 0.3
    this.fps = 60
    this.times = this.duration * this.fps
    this.count = 0
  }
  init(start, end) {
    this.start = start
    this.end = end
    this.step = (end - start) / (this.duration * this.fps)
    return this
  }
  play() {
    this.status = 'play'
    this.timeInterval = setInterval(() => {
      const next = this.start + this.step
      window.scrollTo(0, next)
      this.start = next
      this.count += 1

      if (this.count >= this.times || this.start === this.end) {
        this.stop()
      }

      console.log(this.timeInterval)
    } , 1000 / this.fps)

    return this
  }
  stop() {
    clearInterval(this.timeInterval)
    this.status = 'stop'
    this.count = 0
    return this
  }
}

let scrollTop = 0;
const scroll = new Scroll()
const scrollAnimation = new ScrollAnimation()
const banner = document.querySelector('#banner')
const bannerTop = banner.getBoundingClientRect().top
const bannerBottom = banner.getBoundingClientRect().bottom

scroll
  .init('window')
  .scrollEnd(e => {
    const minOffset = 80;
    const viewHeight = window.innerHeight
    const scrollHeight = window.pageYOffset
    const direction = scrollTop > scrollHeight ? 'up' : 'down'
    if (scrollAnimation.status === 'play') return
    
    if (direction === 'up') {
      if (scrollHeight < bannerBottom - minOffset) {
        scrollAnimation
          .init(scrollHeight, bannerTop)
          .play()
      } else if(scrollHeight < bannerBottom) {
        scrollAnimation
          .init(scrollHeight, bannerBottom)
          .play()
      }
    } else {
      if (scrollHeight < minOffset) {
        scrollAnimation
          .init(scrollHeight, bannerTop)
          .play()
      } else if (scrollHeight < bannerBottom) {
        scrollAnimation
          .init(scrollHeight, bannerBottom)
          .play()
      }
    }

    scrollTop = scrollHeight
  })
