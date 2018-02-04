import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountUIWrapper from './AccountUIWrapper.js';




export class App extends Component {


    constructor(props){
	super(props);

	this.state = {
	    hideCompleted: false,
	};
    }


    toggleHideCompleted(){
	this.setState({
	    hideCompleted: !this.state.hideCompleted,
	});
    }
    
    handleSubmit(event){


	console.log('cliked!!!');
	
	event.preventDefault();

	const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
	//	alert({text}.toString());
	//	alert({text}.toString());
	//	alert(String({text}));
	
	Tasks.insert({
	    text,
	    createdAt: new Date(),
	    owner: Meteor.userId(),
	    username: Meteor.user().username,
	});

	ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }
    
    getTasks(){
	return [
	    { _id:1, text: 'This is task 1' },
	    { _id:2, text: 'This is task 2' },
	    { _id:3, text: 'This is task 3' }
	];
    }

    renderTasks(){
	//	return this.getTasks().map((task) => (
//	return this.props.tasks.map((task) => (
//		<Task key={task._id} task={task} />
	//	));
	let filteredTasks = this.props.tasks;
	if(this.state.hideCompleted){
	    filterTasks = filteredTasks.filter(task => !task.checked);
	}
	return filteredTasks.map((task) => (
		<Task key={task._id} task={task} />
	));
    }

    render(){
	return (
		<div  className="container">
		<header>
		<h1>Todo List ({this.props.incompletedCount})</h1>

		<label className="hide-completed">
		<input type="checkbox"
	    readOnly
	    checked={this.state.hideCompleted}
	    onClick={this.toggleHideCompleted.bind(this)}
		/>
		Hide Completed Tasks
	    </label>
		<AccountUIWrapper/>
		
		<form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
		<input
	    type="text"
	    ref="textInput"
	    placeholder="Type to add new tasks"
		/>
		<input className="button-submit" type="submit" value="Submit"/>
		</form>
		</header>

		<ul>
		{this.renderTasks()}
	    </ul>
		</div>
	);
    }
}
export default withTracker(() => {
    return {
	tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
	incompleteCount: Tasks.find({checked: { $ne: true}}).count(),
	currentUser: Meteor.user(),
    };
})(App);
