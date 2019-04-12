import Dep from './dep'
import observe from './observe'

export default function defineReactive(obj: Object, key: string, val: any) {
  const dep = new Dep()

  // 检查其属性是否可更改
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // 将预定义的 get set 取出来，新定义的会将其执行
  const getter = property && property.get
  const setter = property && property.set

  // 对象的子对象递归进行observe并返回子节点的Observer对象
  let childOb = observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 如果原本对象拥有getter方法则执行
      const value = getter ? getter.call(obj) : val
      if(Dep.target) {
        // 依赖收集
        dep.depend()
        if(childOb) {
          // 子对象进行依赖收集 (存于 dep 属性中，当子对象<数组>发生改变时，通过 dep 该去通知 watcher)
          childOb.dep.depend()
        }
        if(Array.isArray(value)) {
          // 对数组每一个成员进行依赖收集
          dependArray(value)
        }
      }
      return value
    },
    set (newVal) {
      console.log(newVal)
      // 通过getter方法获取当前值，与新值进行比较，一致则不需要执行下面的操作
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {

        // 如果原本对象拥有setter方法则执行setter
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      //  新的值需要重新进行observe，保证数据响应式
      childOb = observe(newVal)

      // dep对象通知所有的观察者
      dep.notify()
    }
  })

  function dependArray (val: Array<any>) {
    for(let e, i = 0, l = val.length; i < l; i++) {
      e = val[i]
      e && e.__ob__ && e.__ob__.dep.depend()
      if(Array.isArray(e)) {
        dependArray(val[i])
      }
    }
  }
}