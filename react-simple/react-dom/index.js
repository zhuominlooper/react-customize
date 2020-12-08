import Component from "../react/component";
import {diff,diffNode} from "./diif";
const ReactDOM = {
    render
}

function render(vnode, container,dom) {
    return diff(dom,vnode,container)
   // return container.appendChild(_render(vnode)) //_render返回节点对象
}

export function createComponent(comp, props) {
    let inst
    //如果是类定义的组件，就创建实例
    if (comp.prototype && comp.prototype.render) { //由于类组件需要继承component，实现render方法，所以在原型上有render
        inst = new comp(props)
    } else { //函数组件
        //如果是函数组件，转换成类组件，方便统一管理
        inst = new Component(props)
        inst.constructor = comp //将类的构造函数指向该函数
        //定义dender函数
        inst.render = function () {
            return this.constructor(props)
        }
    }

    return inst //返回类组件
}

export function setComponentProps(comp,props) { //comp已经是类组件
        //更新props
    comp.props = props;
      if(!comp.base){
         if(comp.componentWillMount){
             comp.componentWillMount()//执行第一个声明周期
         } else if(comp.componentWillReceiveProps){
            comp.componentWillReceiveProps()//所以第一次不会执行该方法
         }
      }

    //渲染组件
    renderComponent(comp)
}

export function renderComponent(comp) {
    let base
    const renderer=comp.render()
    if(comp.base&&comp.componentWillUpdate){
        comp.componentWillUpdate()
    }
    //base = _render(render)//得到真实的dom对象
   base= diffNode(comp.base,renderer)
    if(comp.base){
        if(comp.componentDidUpdate){
            comp.componentDidUpdate()
        }
    }else if(comp.componentDidMount){
        comp.componentDidMount()   
    }

    comp.base = base//挂在实例上

}

function _render(vnode) {
    //实现虚拟dom的渲染
    //如果是空
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return vnode = ''
    
    if(typeof vnode==='number')   vnode=String(vnode)

    //如果是字符串
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode)
    }
    //如果是组件(类组件和函数组件)
    if (typeof vnode.tag === 'function') { //函数组件
        // 1.创建组件，可能是函数组件和类组件，都转换成类组件通一处理
        const comp = createComponent(vnode.tag, vnode.attrs)
        // 2.设置组件属性
        setComponentProps(comp)
        // 3.转换成节点对象返回
        return comp.base //返回组装好的实例对象
    }

    //剩下的就是虚拟dom
    //解构出虚拟dom
    const {
        tag,
        attrs,
        children
    } = vnode

    //创建根dom
    const dom = document.createElement(tag)

    //绑定属性
    if (attrs) {
        Object.keys(attrs).forEach(key => {
            const value = attrs[key]
            setAttribute(dom, key, value)
        })
    }

    //渲染子节点，递归
    if(children){
        children.forEach(node => render(node, dom))
    }


    //加载到div上并返回
    return dom
}

export function setAttribute(dom, key, value) {

    //将classname转成class
    if (key === 'className') {
        key = 'class'
    }

    //事件监听，onClick，onBlur
    if (/on\w+/.test(key)) {
        //转小写
        key = key.toLowerCase()
        dom[key] = value || ''
    } else if (key === 'style') { //样式属性
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || ''
        } else if (value && typeof value == 'object') {
            for (let k in value) {
                if (typeof value[k] === 'number') {
                    dom.style[k] = value[k] + 'px'
                } else {
                    dom.style[k] = value[k]
                }
            }
        }
    } else { //其他属性，title='123'
        if (key in dom) {
            dom[key] = value || ''
        }
        if (value) {
            dom.setAttribute(key, value)
        } else {
            dom.removeAttribute(key)
        }
    }
}

export default ReactDOM