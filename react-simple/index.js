import React from "./react";
import ReactDOM from "./react-dom";

const ele=(
    <div className="active" title='111'>
    hello,<button>react</button>
</div>
)
// function Home(){
//     return (
//         <div className="active" title='111'>
//         hello,<button>react</button>
//     </div>
//     )
// }

class Home extends React.Component{
    constructor(){
            super()
        this.state={
            num:0
        }
    }
  
     componentDidMount(){
        console.log('加载完成')
    }
    componentWillMount(){
        console.log('加载即将完成')
    }
    componentWillReceiveProps(props){
        console.log('props')
    }
    componentWillUpdate(){
        console.log('加载即将更新')
    }
    componentDidUpdate(){
        console.log('加载更新完成')
    }
    click(){
            this.setState((prevState)=>{
                return {
                    num:prevState.num+1  
                }
            })


        this.setState((prevState)=>{
            return {
                num:prevState.num+1  
            }
        })
    }

    render(){
        return (
            <div className="active" title='111'>
            hello,<button onClick={this.click.bind(this)}>react</button>
            {this.state.num}
        </div>
        )  
    }
}

ReactDOM.render(<Home/>,document.getElementById('root'))