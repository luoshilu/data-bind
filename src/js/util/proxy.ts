/* 添加代理*/
export default function proxy(target: Object, sourceKey: string, key: string) {
  const that = target
  Object.defineProperty(target, key, {
    get: function() {
      return that[sourceKey][key]
    },
    set: function(val) {
      that[sourceKey][key] = val
    }
  })
}