import Watcher from './watcher'

let uid = 0

// 依赖 (发布者)
export default class Dep {
  static target?: Watcher
  id: number
  subs: Array<Watcher> = []
  constructor () {
    this.id = uid++
  }
  // 收集依赖
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 添加订阅者
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  // 通知所有订阅者
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target?: Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}