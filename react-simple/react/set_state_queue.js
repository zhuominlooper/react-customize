import {
    renderComponent
} from "../react-dom"

let setStateQueue = []
let renderQueue = []
function defer( fn ) {
    return Promise.resolve().then( fn );
}
export function enquequeSetState(stateChange, component) {
    if (setStateQueue.length === 0) {
        defer(flush);
    }

    //短时间合并多个state
    setStateQueue.push({
        stateChange,
        component
    })

    //如果renderQueue没有组件，才去添加
    let r = renderQueue.some(item => {
        return item === component
    })
    if (!r) {
        renderQueue.push(component)
    }

}

//一段时间后
function flush() {
    let item,component;
    // 遍历state
    while (item = setStateQueue.shift()) {
        const {stateChange,component} = item;
        // 如果没有prevState,则将当前的state作为初始的prevState
        if (!component.prevState) {
            component.prevState = Object.assign({}, component.state);
        }
        // 如果stateChange是一个方法,也就是setState的第一种形式
        if (typeof stateChange === 'function') {
            Object.assign(component.state, stateChange(component.prevState, component.props))
        } else {
            // 如果stateChange是一个对象,则直接合并到setState中
            Object.assign(component.state, stateChange);
        }
        component.prevState = component.state;
    }

    // 遍历组件
    while (component = renderQueue.shift()) {
        renderComponent(component);
    }
}
