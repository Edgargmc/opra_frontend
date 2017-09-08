import React, { Component } from 'react';
import './App.css';

import EndPoints from '../Api'


const INITIAL_STATE = {
    task: [],
    author: '',
    description: '',
    taskToUpdate: '',
    id_status: '',
    filterauthor: '',
    statusFilter: '',
    dateFilter: ''
};


class App extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentDidMount(){
        this.getTask();
    }

    getTask(){
        EndPoints.getTasks()
            .then((response) => {
                console.log(response);
                let task = response.data;
                this.setState({task});
            })
            .catch((error) =>{
                console.log(error);
            });
    }

    saveTask(data){
        EndPoints.setNewTask(data)
            .then((response) => {
                console.log(response);
                this.setState(()=> {
                    return {
                        author: '',
                        description: ''
                    }
                });

                this.getTask();
            })
            .catch((error) =>{
                console.log(error);
            });
    }

    deleteTask(id){
        EndPoints.deleteTask(id)
            .then((response) => {
                console.log(response);
                this.getTask();
            })
            .catch((error) =>{
                console.log(error);
            });
    }

    updateTask(id, data){

        EndPoints.updateTask(id, data)
            .then((response) => {
                this.setState({
                    author: '',
                    description: '',
                    id_status: '',
                    taskToUpdate: ''
                });

                this.getTask();
            })
            .catch((error) =>{
                console.log(error);
            });

    }

    toggleComplete = (id) => {
        console.log('delete');
        this.deleteTask(id);
    };

    MarkComplete = (task) => {
        let  data = {
            id_status: 3,
            author: task.author,
            description: task.description
        };

        this.updateTask(task.id, data );

    };

    editTask = (task) => {
        this.setState({
            author: task.author,
            description: task.description,
            id_status: task.id_status,
            taskToUpdate: task.id
        });

    };

    renderList = () => {
        return(  this.state.task.map((task, i) => (
                <span  key={i}>
                <li key={i}
                    className={"list-group-item clearfix " + (task.id_status === '3' ? 'list-group-item-success' : '')}
                >
                    <span>{task.description}</span>
                    <div className="pull-right" role="group">
                        <button
                            type="button"
                            className="btn btn-xs btn-primary img-circle"
                            onClick={this.editTask.bind(this, task)}
                        >&#x270f;</button>
                        <button
                            type="button"
                            className="btn btn-xs btn-success img-circle"
                            onClick={this.MarkComplete.bind(this, task)}
                        >&#x2713;</button>
                        <button
                            type="button"
                            className="btn btn-xs btn-danger img-circle"
                            onClick={this.toggleComplete.bind(this, task.id)}
                        >&#xff38;</button>

                    </div>
                </li>
                <ol className="breadcrumb">
                    <b>Author</b>: {task.author}
                </ol>
                    <span className="divider" ></span>
            </span>
            ))
        )
    };

    sendTask = (e) => {

        e.preventDefault();

        let idToUpdate = this.state.taskToUpdate;
        if(idToUpdate === ''){
            let  data = {
                id_status: 1,
                author: this.state.author,
                description: this.state.description
            };

            this.saveTask(data);
        }else{
            let  data = {
                id_status: this.state.id_status,
                author: this.state.author,
                description: this.state.description
            };

            this.updateTask(this.state.taskToUpdate, data );

        }

    };

    changeDescription =  (event) => {
        this.setState({[event.target.id]: event.target.value});
    };

    changeFilter =  (event) => {

        if(event.target.value === ''){
            this.setState({[event.target.id]: event.target.value});
            this.getTask();
        }else{
            this.setState({[event.target.id]: event.target.value});
        }

    };

    filter = (e) => {
        e.preventDefault();

        let  data = {
            author: this.state.filterauthor,
            statusFilter:  this.state.statusFilter,
            dateFilter:  this.state.dateFilter
        };

        console.log(data);
        EndPoints.filter(data)
            .then((response) => {
                let task = response.data;
                this.setState({task});
            })
            .catch((error) =>{
                console.log(error);
            });

    };


    filterStatus = (event) => {
        this.setState({
            statusFilter: parseInt(event.target.value, 10)
        });
    };

    filterDate = (event) => {
        this.setState({
            dateFilter: event.target.value
        });
    };



    renderFilter = () => {
        return(
            <form className="todoForm form-horizontal" onSubmit={this.filter}>
                <input type="text" id="filterauthor"
                       value={this.state.filterauthor}
                       ref="filterauthor"
                       className="form-control"
                       placeholder="Insert name of Author"
                       onChange = {this.changeFilter}
                />
                <div className="row">
                    <label className="radio-inline">
                        <input type="radio" name="optradio"
                               value="1"
                               id="pending" onChange={this.filterStatus}
                               checked={this.state.statusFilter  === 1}
                        />
                        Pending</label>
                    <label className="radio-inline">
                        <input type="radio" name="optradio"
                               value="3"
                               id="finished" onChange={this.filterStatus}
                               checked={this.state.statusFilter  === 3}
                        />Finished</label>
                    <div className="col-md-10 col-md-offset-2 text-right">
                        <input type="submit"
                               value="Search"
                               className="btn btn-primary"
                        />
                    </div>
                </div>
                <div className="row">
                    <label className="radio-inline">
                        <input type="radio" name="today"
                               value="DAY"
                               id="today" onChange={this.filterDate}
                               checked={this.state.dateFilter  === 'DAY'}
                        />
                        Today</label>
                    <label className="radio-inline">
                        <input type="radio" name="yesterday"
                               value="YESTERDAY"
                               id="yesterday" onChange={this.filterDate}
                               checked={this.state.dateFilter  === 'YESTERDAY'}
                        />
                        Yesterday</label>
                    <label className="radio-inline">
                        <input type="radio" name="week"
                               value="WEEK"
                               id="week" onChange={this.filterDate}
                               checked={this.state.dateFilter  === 'WEEK'}
                        />
                        This Week</label>
                    <label className="radio-inline">
                        <input type="radio" name="year"
                               value="YEAR"
                               id="year" onChange={this.filterDate}
                               checked={this.state.dateFilter  === 'YEAR'}
                        />
                        This Year</label>
                </div>
            </form>
        )
    };

    render() {
        return (
            <section className="container vert-offset-top-2">
                <div id="todoBox"
                     className="todoBox col-xs-6 col-xs-offset-3">
                    <div className="commentForm vert-offset-top-2">
                        <div>
                            {this.renderFilter()}
                        </div>
                        <hr />
                        <div className="clearfix">
                            <div className="well">
                                <form className="todoForm form-horizontal" onSubmit={this.sendTask}>
                                    <div className="form-group">
                                        <label htmlFor="task" className="col-md-2 control-label">Task</label>
                                        <div className="col-md-10">
                                            <input type="text" id="description"
                                                   value={this.state.description}
                                                   ref="description"
                                                   className="form-control"
                                                   placeholder="What do you need to do?"
                                                   onChange = {this.changeDescription}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="task" className="col-md-2 control-label">Author</label>
                                        <div className="col-md-10">
                                            <input type="text" id="author"
                                                   value={this.state.author}
                                                   ref="author"
                                                   className="form-control"
                                                   placeholder="Insert your name"
                                                   onChange = {this.changeDescription}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-10 col-md-offset-2 text-right">
                                            <input type="submit"
                                                   value="Save Item"
                                                   className="btn btn-primary"

                                            />
                                        </div>
                                    </div>
                                </form>
                                <h1 className="vert-offset-top-0">Tasks:</h1>
                                <ul className="list-group">
                                    {this.state.task.length > 0 && this.renderList() }
                                    {!this.state.task.length && <span>Empty</span> }

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default App;

