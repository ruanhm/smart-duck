import React from 'react'


class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.setState({
            date: new Date()
        });
    }
    render() {
        return <div>
            <h1>{this.props.hide?'隐藏':'显示'}</h1>
            <h2>It is {this.state.date.toLocaleTimeString()}</h2>
        </div>
    };
}

export default class Tick extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isHide: false };
        this.hide=this.hide.bind(this);
    }
    hide(){
        this.setState({
            isHide:this.state.isHide?false:true
        })
    }
    render() {
        return <div>
        <Clock hide={this.state.isHide} name="aa"/>
        <button onClick={()=>{this.hide()}}>{this.state.isHide?'隐藏':'显示'}</button>
        </div>
    };
}