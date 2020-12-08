import { setAttribute,setComponentProps,createComponent } from "./index";
export function  diff(dom,vnode,container) {

const ret=diffNode(dom,vnode)


if(container){
    container.appendChild(ret)
}
    
}

export function  diffNode(dom,vnode) {
    let out=dom
    //实现虚拟dom的渲染
    //如果是空
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return vnode = ''
    
    if(typeof vnode==='number')   vnode=String(vnode)

    //如果是字符串
    if (typeof vnode === 'string') {
        if(dom){
            if(dom&&dom.nodeType===3){//dom存在，并且是文本
                if(dom.textContent!==vnode){
                    //更新文本内容
                    dom.textContent=vnode
                }

            } 
        }else{
            out=  document.createTextNode(vnode)//创建文本节点 
        }
        return out
    }
    //如果是组件(函数组件和类组件)
    if(typeof vnode.tag==='function'){
        return diffComponent(out,vnode)
    }

    //非文本节点，分为组件和非文本dom节点
    if(!dom){
        out=document.createElement(vnode.tag)
    }

    diffAttribute(out,vnode)
     
    //比较子节点
    if(vnode.children&&vnode.children.length>0||(out.childNodes&&out.childNodes.length>0)){
        diffChildren(out,vnode.children)
    }
    return out

}

function diffAttribute(dom,vnode){//dom原有节点，vnode是虚拟dom
    const oldAttrs=[] //保存之前的dom所有属性
    const newAttrs=vnode.attrs //新的dom属性
    const domAttrs= [...document.querySelector('#root').attributes]
    domAttrs.forEach(item=>{
        oldAttrs[item.name]=item.value
    })
    //比较
    //如果原来的属性没在新的属性里，就移除
    for(let key in oldAttrs){
        if(!(key in newAttrs)){
            setAttribute(dom,key,undefined) //设置undefined就是移除属性
        }
    }

    //更新和新增
    for(let keys in newAttrs){
        if(oldAttrs[keys]!==newAttrs[keys]){
            setAttribute(dom,keys,newAttrs[keys])
        }
    }

}

// 对比子节点
function diffChildren(dom, vchildren) {
    const domChildren = dom.childNodes;
    const children = [];
    const keyed = {};
    // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开
    if (domChildren.length > 0) {
        [...domChildren].forEach(item => {
            // 获取key
            const key = item.key;
            if (key) {
                // 如果key存在,保存到对象中
                keyed[key] = item;
            } else {
                // 如果key不存在,保存到数组中
                children.push(item)
            }

        })
    }
    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length; //2
        [...vchildren].forEach((vchild, i) => {
            // 获取虚拟DOM中所有的key
            const key = vchild.key;
            let child;
            if (key) {
                // 如果有key,找到对应key值的节点
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (childrenLen > min) {
                // alert(1);
                // 如果没有key,则优先找类型相同的节点
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    if (c) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }
            // 对比
            child = diffNode(child, vchild);
            // 更新DOM
            const f = domChildren[i];
            if (child && child !== dom && child !== f) {
                // 如果更新前的对应位置为空，说明此节点是新增的
                if (!f) {
                    dom.appendChild(child);
                    // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
                } else if (child === f.nextSibling) {
                    removeNode(f);
                    // 将更新后的节点移动到正确的位置
                } else {
                    // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                    dom.insertBefore(child, f);
                }
            }
        })
    }
}


function diffComponent(dom,vnode){
     let comp=dom
    //如果组件没变化，重新设置props
    if(comp&&comp.constructor===vnode.tag){
        setComponentProps(comp,vnode.attrs)
        //赋值
        dom=comp.base
    }else{//组件发生变化
        if(comp){//移除旧组件
              unmountComponent(comp)
              comp=null
        }

        //1.创建新组件
        comp=createComponent(vnode.tag,vnode.attrs)
        //设置组件属性
        setComponentProps(comp,vnode.attrs)
        //挂载
        dom=comp.base

    }

    return dom


}
function unmountComponent(comp){
       removeNode(comp.base)

}

function removeNode(dom){
      if(dom&&dom.parentNode){
          dom.parentNode.removeNode(dom)
      }
}
