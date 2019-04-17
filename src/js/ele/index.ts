import _ from 'lodash'
export default function ele(tag, child?) {
  let element = _.isString(tag) ? document.createElement(tag) : _.isElement(tag) ? tag : document.body
  if (_.isString(child) && child) {
    element.appendChild(document.createTextNode(child))
  }

  if (_.isElement(child)) {
    element.appendChild(child)
  }

  if (_.isArray(child)) {
    child.forEach((e) => {
      element.appendChild(ele(e))
    })
  }
  return element
}