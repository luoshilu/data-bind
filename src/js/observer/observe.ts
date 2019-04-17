
import Observer from './observer'
import _ from 'lodash'
export default function observe(value: any, asRootData?: boolean): Observer | void {
  let ob: Observer | void
  // 判断是否为对象
  if (!_.isObject(value)) return
  // 使用属性 __ob__ 判断是否已经有 Observer 实例 (防止重复 observer)
  if (value.hasOwnProperty('__ob__')) { ob = value.__ob__ }
  else if (
    /* value 是否是单纯的 object 以及其他一些需要进行 observer 的条件 */
    Array.isArray(value) || Object.prototype.toString.call(value) === '[object Object]'
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}