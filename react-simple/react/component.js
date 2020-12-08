import { renderComponent } from "../react-dom/index";
import {enquequeSetState  } from "./set_state_queue";
class Component{
    constructor(props={}){
        this.props=props
        this.state={}
    }
    setState(stateChange){
        //对象拷贝
        // Object.assign(this.state,state)//可以不加
        // //渲染组件
        // renderComponent(this)
        enquequeSetState(stateChange,this) 
    }
}

export default Component