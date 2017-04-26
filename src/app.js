import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Li from './comm/Main.js';
import Footer from './comm/Footer.js';
require('./css/base.css');
require('./css/index.css');
import {Input,notification,Button,message} from 'antd';


class App extends Component{
	//class中的方法之间不需要加分号或者逗号
	constructor(props){
		super(props);
		this.state = {
			arr:[],
			val:'',
			//默认footer组件  全部   选项
			changes:'all'
			
			
		};
		//因为Input的value绑定this.state.val，所以需要这个函数展现内容
		this.change = this.change.bind(this);
		//填写完要做的todolist之后，按回车键，main部分，出现一条todolist
		this.keyDown = this.keyDown.bind(this);
		//全选checkbox，当点击时，全部选中或者全部不选
		this.allFn = this.allFn.bind(this);
		//子组件destroy按钮调用本组件的delet按钮，并且传参元素（todo=ele）
		this.delet = this.delet.bind(this);
		//子组件复选框input，点击之后，父组件更新子组件的状态，check=true
		this.toggle = this.toggle.bind(this);
		//子组件调用childChange，并且传入参数，更改this.state，然后重新渲染
		this.childChange = this.childChange.bind(this);
		//下面的是footer需要调用的回调函数
		//footer组件的filters 全部 未完成 已完成 点击事件处理函数的回调函数
		this.viewFn = this.viewFn.bind(this);
		//footer组件的 “清楚完成项” 处理函数的回调函数
		this.deletBtn = this.deletBtn.bind(this);
	}
	//Input的变化引起change函数，从而设置this.state.val，再渲染value = {this.state.val}
	change(e){
		this.setState({
			val:e.target.value
		})
	}
	/*
	 首先，判断key.code == 13,如果不等于，全部排除
	 其次，判断target.value是否为空以及是否为空格内容
	 再次，更新this.state中的数组，添加一个对象，包括内容，时间，勾选与否
	 最后，清空this.state中的val
	 
	 */
	keyDown(e){
		//先对获取的内容进行去除两边的空格
		let val = e.target.value.trim();
		if(e.keyCode!==13||!val)return;
		let {arr:newArr} = this.state;
		let data = {
			cont:val,
			check:false,
			//这个id很重要，一来，循环需要；二来，用来对比，方便delet方法
			id:new Date().getTime()	
		}
		//更新this.state中的数组
		newArr.push(data);
		this.setState({
			arr:newArr,
			//清空this.state中的val
			val:''
		})
	}
	//当点击all的时候，获取到当前的checked
    //用map遍历所有的数据，让所有数据的check变成checked
   	// 最后渲染
	allFn(e){
		//在这里不需要对每个todo的check作判断
		//也不需要对all的check作判断
		//只需要让ele.check=e.target.checked
		let {checked} = e.target;
		let {arr} = this.state;
		let list = arr.map((ele)=>{
			ele.check=checked;
			return ele;
		});
		this.setState({
			arr:list
		})
		
	}
	//子组件调用delet方法  传参todo 从而达到删除arr中的ele即上面的data
	delet(todo){
		let {arr} = this.state;
		//通过filter的方法，过滤掉todo，创建一个新数组list，赋值给state
		//注意Array.filter的用法
		let list = arr.filter((ele,i)=>{
			//每个ele都有一个id，通过id对比，不相符的全部返回新数组
			return ele.id != todo.id
		});
		this.setState({
			arr:list
		})
		
	}
	//子组件调用toggle方法，传参todo，从而达到更新子组件的复选框状态
	toggle(todo){
		let {arr} = this.state;
		//这次的filter与delet方法的filter用法不同
		//delet要删除arr中的一个，返回剩余的
		//toggle要返回所有，只是其中一个符合条件的要改变check
		let list = arr.filter((ele,i)=>{
			if(ele.id === todo.id){
				ele.check = !ele.check
			}
			return ele;
		});
		this.setState({
			arr:list
		})
	}
	//子组件调用childChange，并且传入参数，更改this.state，然后重新渲染
	childChange(id,val){
		//问题：console.log(id) 打印出undefined时，需要查找data.ele.id是否传递给子组件了
		let {arr} = this.state;
		//这次的filter依然是返回所有，跟toggle类似
		//只是其中一个符合条件的cont要变成子组件传过来的val（编辑过后的内容）
		let list = arr.filter((ele)=>{
			if(ele.id === id){
				ele.cont = val;
			}
			return ele;
		});
		this.setState({
			arr:list
		})
	}
	//根据footer组件传来的data-view数据，更改state.changes状态
	//与allFn区别开来
	viewFn(view){
		this.setState({
			changes:view
		})
	}
	//保留未选中的（未完成），清除已选中的（已完成）
	//footer没有传入todo，所以就没有id可以对照，不想delet函数
	//但这个清除与delet不一样，每个ele.check都经过toggle传到父组件了
	deletBtn(){
		let {arr} = this.state;
		let list = arr.filter((ele)=>{//这里不要写成map
			return !ele.check
		})
		this.setState({
			arr:list
		})
	}

	
	
	render(){
		//原数据
		let {arr,changes} = this.state;
		let num = arr.length;
		//拷贝原数据，之后footer 全部 未完成 已完成 再处理数据
		let {arr:newArr} = this.state;
		
		let Main = null;
		let list =null;
		
		let footer = null;
		let footerList =null;
		
		//newArr中只要有todo的check=true，num--
		newArr = arr.map((ele)=>{
			if(ele.check)num--;
			return ele;
		})
		//footer要在main之前进行定义，这样经过 全部 未完成 已完成处理的数据才方便到main中进行渲染
		if(arr.length){
			let data = {
				num:num,
				viewFn:this.viewFn,
				changes:this.state.changes,
				onOff:(arr.length>num),
				deletBtn:this.deletBtn
			}
			footer=(
				<Footer {...data} />
			)
			//根据state.changes的值，对newArr进行处理，方便main进行渲染
			//如果是all的话，newArr就不处理，直接走下面的程序，相当于是原数据
			//let {arr,changes} = this.state; 已经拿到了changes，直接用
			switch(changes){
				case 'unfineshed':
					newArr = arr.filter((ele)=>{
						return !ele.check
					});
					break;
				case 'completed':
					newArr = arr.filter((ele)=>{
						return ele.check
					});
					break;
					
			}
		}
		//如果state的arr没有值的话，那么return
		//或者，如果有值的话，才进行下一步程序
		if(newArr.length){
			list =newArr.map((ele,i)=>{
				let data = {
					//多个平级元素需要key值
					key:ele.id,
					//元素的主要内容
					cont:ele.cont,
					//toggle时，check有用
					check:ele.check,
					//当前这个元素，可以身上寻找任何属性
					todo:ele,
					//当前子组件的id
					id:ele.id,
					//一下为往子组件传递的回调函数
					delet:this.delet,
					toggle:this.toggle,
					childChange:this.childChange
				}
				return <Li {...data}/>
			})
			//如果不存在arr的话，那么main就不出现，也就是说，不存在all全选框
			
			Main = (
				<section className="main">
		            <input
		              className="toggle-all"
		              type="checkbox"
		              onChange={this.allFn}
		              //check取决于两个因素，num和arr.length
		              //todo只要有一个呗勾中，num--
		              //只有当arr.length存在时
		              //综合起来，逻辑是：必须有todo且被全部勾选
		              checked={(num===0)&&(arr.length)}
		              />
		            <ul className="todo-list">
		              {list}
		            </ul>
	        	</section>
			)
		}
		
		
		
		
		return(
			<div>
				<header className='header'>
					<h1>Todo List</h1>
					<Input
						className = 'new-todo'
						placeholder = 'Write your Todo-list'
						value = {this.state.val}
						onChange = {this.change}
						onKeyDown = {this.keyDown}
						
					/>	
				</header>
				{Main}
				{footer}
            </div>
		)
	}
}


//render函数里面的是参数
ReactDOM.render(
	<App />,
	document.getElementById('todoapp') //这里不要有分号
)
