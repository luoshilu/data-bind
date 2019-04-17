import Dep, { pushTarget } from './dep'
import VM from '../vm'
export default class Watcher {
  vm: VM
  deps: Array<Dep>
  newDeps: Array<Dep> = []
  queue: Array<Function>
  cb: Function
  sync: boolean = false
  depIds = new Set()
  newDepIds = new Set()
  constructor(vm: VM, cb: Function) {
    this.vm = vm
    this.cb = cb
  }

  get() {
    pushTarget(this)
    let value
    try {
      // value = this.getter.call(vm, vm)
    } catch {}
    return value
  }

  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  run() {
    this.cb()
  }
  update() {
    // 同步执行
    // if (this.sync) {
    this.run()
    return
    // }
    // 异步推送到观察者队列中，由调度者调用
    // setTimeout(function(){
    //   this.queueWatcher.push(this.cb)
    // }, 0)
  }
}