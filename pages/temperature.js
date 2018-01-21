function TemperatureShow(props) {
    if(props.temperature >38) {
      return <p>天气热</p>
    }else if(props.temperature<=38 && props.temperature >=0){
      return <p>天气正合适</p>
    }else {
      return <p>天气冷</p>
    }
  }

  function TemperatureInput(props) {
    function handleTemp(e) {
        // 接受父组件传递过来的函数，调用并传值
        props.onTemperateChange(e.target.value)
    }
    return (
      <p>
        <label htmlFor="tempInput">请输入天气温度</label>
         {/* onChange 事件调用函数*/}
        <input type="text" name="tempInput" value={props.temperature} onChange={handleTemp}/>
      </p>
    )
  }


  export default  class TemperatureContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        temperature: ''
      };
      this.handleTemp = this.handleTemp.bind(this); // 不要忘记 this 绑定
    }
    // 父组件中的函数,接受一个参数
    handleTemp(temperature) {
        this.setState({
            temperature:temperature
        })
    }
    render() {
      let temperature = this.state.temperature
      return (
        <div>
            {/* 传递给子组件*/}
            <TemperatureInput temperature={temperature} onTemperateChange={this.handleTemp}/>
            <TemperatureShow  temperature={parseFloat(temperature) } />
        </div>
      ) 
  }
}
