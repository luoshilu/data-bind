import VM from './vm'
import initData from './observer/initData'
import { pushTarget, popTarget } from './observer/dep'
import Watcher from './observer/watcher'
import ele from './ele'
import _ from 'lodash'

const vm = new VM({
  data: {
    title: 'create VM',
    num: 2,
    info: {
      type: 'letter',
      action: 'chunk',
    },
    chunkArg: ['a', 'b', { deep: true }, ['c', 'd']],
  },
  props: {},
})

const readerWatcher = new Watcher(vm, () => {
  document.body.innerHTML = ''
  reader()
})

const hook = {
  'createBefore': () => {
    pushTarget(readerWatcher)
  },
  'created': () => {
    reader()
    popTarget()
  },
  'mounted': () => { },
}
// --------------

hook.createBefore()
initData(vm)
function reader() {
  ele(document.body, [
    ele('h2', `${vm.title}`),
    ele('div', [
      ele('p', `ARRAY: ${vm.chunkArg.toString()}`),
      ele('p', `CHUNK ${vm.num} AND JSON Stringify: ${JSON.stringify(_.chunk(vm.chunkArg, vm.num))}`),
      ele('div', [
        ele('h3', `INFO`),
        ele('p', `> type: ${vm.info.type}`),
        ele('p', `> action: ${vm.info.action}`),
      ]),
    ]),
  ])
}
hook.created()

setTimeout(() => {
  vm.info.type = 'settimeout type'
}, 1000)

setTimeout(() => {
  vm.chunkArg[2].deep = false
}, 2000)

setTimeout(() => {
  vm.num = 1
  // vm.chunkArg[3].push({'obj': 123})
}, 3000)
