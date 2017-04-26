import React,{Component} from 'react';
//footer的逻辑比较简单：
//一，未选中数量，props.num解决
//二，全部，未完成，已完成，得到点击，调用父组件回调函数，然后重新渲染
//三，清除完成项的显示与点击，显示取决于ele.check，点击调用父组件的回调函数
export default class Footer extends Component{
	constructor(props){
		super(props)
		//绑定两个处理函数
		//事件代理在ul上，然后事件处理在li a 上面
		this.changes = this.changes.bind(this);
		//这个点击意味着清除已完成todos
		this.click = this.click.bind(this);
	}
	//这个处理函数是事件代理啦，需要找到目标
	changes(e){
		//记得回父组件 定义并传送  这个回调函数啦！
		this.props.viewFn(e.target.dataset.view);
		console.log(this.props.viewFn)
	}
	//这个处理函数是点击已完成项产生的啦！
	click(){
		//记得回父组件 定义并传送  这个回调函数啦！
		this.props.deletBtn();
	}
		
		
		
	render(){
		let deletBtn=null;
		//只有当this.props.onOff为true时，即有todo的check为true
		//也就是意味原数组arr.length》num
		//num初始值等于arr.length，只要有一个todo的check为true。num--
		if(this.props.onOff){
			deletBtn=(
				<button
		          className="clear-completed"
		          onClick={this.click}
		        >清除完成项</button>
		    )
			
		}
		
		return(
			<footer className='footer'>
				<span className="todo-count">
					<strong>{this.props.num}</strong>
					<span>条未选中</span>
				</span>
				<ul className='filters' onClick={this.changes}>
					<li>
						<a
							href='#/all'
							/*这里不要有分号啦！！！*/
							className={this.props.changes==='all'?'selected':''}
							data-view='all'
						>全部</a>
					</li>
					<li>
						<a
							href='#/unfineshed'
							className={this.props.changes==='unfineshed'?'selected':''}
							data-view='unfineshed'
						>未完成</a>
					</li>
					<li>
						<a
							href='#/completed'
							className={this.props.changes==='completed'?'selected':''}
							data-view='completed'
						>已完成</a>
					</li>
				</ul>
				{deletBtn}
			
			</footer>
		)
	}
	
}