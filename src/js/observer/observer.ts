import Dep from './dep'
import observe from './observe'
import defineReactive from './defineReactive'
import { arrayMethods, arrayKeys } from './arrayMethods'
import { def } from '../util/index'

function protoAugment (target, src: Object) {
  target.__proto__ = src
}

function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

export default class Observer {
  value: any
  dep: Dep
  vmCount: number
  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0

    // 将Observer实例绑定到 data 的 __ob__ 属性
    def(value, '__ob__', this)

    // 判断 data 是 Array or Object
    if(Array.isArray(value)) {
      /**
       * 若是value数组
       * 1. 定义（覆盖）数组对象的原生方法，以此来监听该数组的数据变化
       * 2. 对数组每个成员 observe
       */
      const augment = ('__proto__' in {})
      ? protoAugment  /*直接覆盖原型的方法来修改目标对象*/
      : copyAugment   /*定义（覆盖）目标对象或数组的某一个方法*/
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      // 是对象则遍历绑定
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    // walk方法会遍历对象的每一个属性进行defineReactive绑定
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.
  */
  observeArray (items: Array<any>) {
    // 数组需要遍历每一个成员进行observe
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}