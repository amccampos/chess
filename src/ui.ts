
interface Props {
  [key: string]: string
}

type ButtonCallback = (ev: MouseEvent) => any

function setProps(elm: HTMLElement, props?: Props) {
  if (props) {
    Object.keys(props).forEach(k => {
      elm.setAttribute(k, props[k])
    })
  }
}

export function createButton(label: string, callback: ButtonCallback, props?: Props) {
  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.appendChild(document.createTextNode(label))
  button.onclick = callback
  setProps(button, props)
  return button
}

export function createHeading(title: string, level: number = 1, props?: Props) {
  if (level <= 0 && level > 5) {
    level = 1 // default level
  }
  const heading = document.createElement(`h${level}`)
  heading.appendChild(document.createTextNode(title))
  setProps(heading, props)
  return heading
}

export function createDiv(props?: Props) {
  const div = document.createElement('div')
  setProps(div, props)
  return div
}

export function setChildren(id: string, children: HTMLElement[]) {
  const elm = document.getElementById(id)
  if (elm && children) {
    children.forEach(c => elm.appendChild(c))
  }
}