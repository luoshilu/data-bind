import proxy from '../util/proxy'
import observe from './observe'

export default function initData(vm) {
  let data = vm.$options.data
  data = vm._data = data || {}
  // let props = vm.$options.props
  // 遍历 data
  let keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    // 检查 data 和 props 中的属性不能重复

    // 将 data 代理 到 vm._data 上 (为啥要代理？ 每次修改 data 的某个属性时，需要 vm._data.text 才能修改，为了方便访问和修改，将其代理到 vm.text )
    proxy(vm, `_data`, keys[i])
  }
  observe(data, true /* asRootData */) // 将所有数据变成 observable （这里作为 根数据）
}