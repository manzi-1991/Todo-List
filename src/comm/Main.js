import React,{Component} from 'react';

export default class Li extends Component{
	constructor(props){
		super(props);
		this.state={
			//由db的布尔值来确定li的class是否需要加上editing
			//db的值由todo的双击事件来确定
			//val的值是给编辑时input的，回车后，数据传给父组件
			//然后父组件再进行渲染
			db:false,
			val:''
		}
		//点击button时，删除这条todos
		this.dele = this.dele.bind(this);
		//点击复选框时，标记已完成，更新这条todos的状态
		this.toggle = this.toggle.bind(this);
		//以下均是重新编辑todo时依次产生的函数，dbClcik，change，blur，keyDown
		//双击todo时，对todo进行重新编辑
		this.dbClcik = this.dbClcik.bind(this);
		//当编辑时产生的新内容，需要更新state.val
		this.change = this.change.bind(this);
		//当编辑中途点击到其他地方是，失焦
		this.blur = this.blur.bind(this);
		//当编辑完毕时，按回车键，传送数据给父组件，重新渲染
		this.keyDown = this.keyDown.bind(this);
	}
	//点击button时，删除这条todos
	//点击调用dele，回调父组件的delet方法，传入当前这个数据
	//从而达到在父组件中删除this.state.arr中的指定元素
	//react再次渲染时，这个todos将不复存在
	dele(){//这里不需要传参
		this.props.delet(this.props.todo)
	}
	//点击这个复选框，调用父组件的toggle事件
	toggle(){
		this.props.toggle(this.props.todo)
	}
	//注意：编辑todo，第一步，双击；第二步，按回车
	//当双击时，todo的className添加editing，并且input获得焦点
	//---------重要-------setState(updater, [callback])
	dbClcik(){
		this.setState({//不要忘记（{}）的小括号，！！！不要有等号
			db:true,
			//双击后的编辑框需要获得原来存在的数据
			val:this.props.cont
		},()=>{
			this.refs.modify.focus();
		}
		)
	}
	//当inout内容有所改变时，更新state的val
	change(){
		//有了ref，就不需要e.target.value
		this.setState({
			val:this.refs.modify.value
		})
	}
	//在blur后，保存当前编辑的内容，通过childChange回调将内容传给父组件进行重新渲染
	//同时更新state.db状态，true=》false
	blur(){
		this.props.childChange(this.props.id,this.refs.modify.value);
		this.setState({
			db:false
		})
	}
	//在keyDown后，保存当前编辑的内容，通过childChange回调将内容传给父组件进行重新渲染
	//同时更新state.db状态，true=》false
	//与blur不一样的是，需要对keycode进行判断
	keyDown(e){
		
		if(e.keyCode === 13	){
			this.props.childChange(this.props.id,this.refs.modify.value);
			this.setState({
			db:false
			})
		}
		
		
	}
	render(){
		//通过this.props.check来判断todo是否已经做完，然后给li添加completedclassName
		let stateClass = '';
		if(this.props.check){
			stateClass = 'completed';
		}
		//通过this.state.db来判断这个todo是否在重新编辑，true则className加上editing 
		if(this.state.db){
			stateClass = 'editing';
		}
		if(this.state.db&&this.props.check){
			stateClass = 'completed editing';
		}
		return(
		<li className = {stateClass}>
			<div className="view">
              <input
                className="toggle"
                type="checkbox"
                checked={this.props.check}
                onChange = {this.toggle}
              />
              <label onDoubleClick={this.dbClcik}>{this.props.cont}</label>
              <button
                className="destroy"
                onClick = {this.dele}
              ></button>
          	</div>
          	<input
          		className='edit' /*单词不要写错eidt*/
          		value={this.state.val}
          		ref='modify'
          		onChange={this.change}
          		onKeyDown={this.keyDown}
          		onBlur={this.blur}
          	/>
          </li>
		)
	}
}
