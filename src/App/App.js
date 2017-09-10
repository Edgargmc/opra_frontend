import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

import EndPoints from '../Api'


const INITIAL_STATE = {
    task: [],
    author: '',
    description: '',
    taskToUpdate: '',
    id_status: '',
    filterauthor: '',
    statusFilter: '',
    dateFilter: '',
    httpRequest : false
};


class App extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentDidMount(){
        this.getTask();
    }

    controlLoading = (state) =>{
        this.setState({httpRequest: state});
    };

    getTask(){
        this.controlLoading(true);
        EndPoints.getTasks()
            .then((response) => {
                let task = response.data;
                this.setState({task});
                this.controlLoading(false);
            })
            .catch((error) =>{
                this.controlLoading(false);
                console.log(error);
            });

    }

    saveTask(data){
        this.controlLoading(true);
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
                this.controlLoading(false);
            })
            .catch((error) =>{
                this.controlLoading(false);
                console.log(error);
            });

    }

    deleteTask(id){
        this.controlLoading(true);
        EndPoints.deleteTask(id)
            .then((response) => {
                this.getTask();
                this.controlLoading(false);
            })
            .catch((error) =>{
                console.log(error);
                this.controlLoading(false);
            });

    }

    updateTask(id, data){
        this.controlLoading(true);
        EndPoints.updateTask(id, data)
            .then((response) => {
                this.setState({
                    author: '',
                    description: '',
                    id_status: '',
                    taskToUpdate: ''
                });
                this.getTask();
                this.controlLoading(false);
            })
            .catch((error) =>{
                console.log(error);
                this.controlLoading(false);
            });

    }

    toggleComplete = (id) => {
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

                    <span htmlFor="task" className="col-md-6 control-label">
                        <b>Date:</b> {moment(task.date_create).format("DD/MM/YYYY")}</span>
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

        this.controlLoading(true);
        EndPoints.filter(data)
            .then((response) => {
                let task = response.data;
                this.setState({task});
                this.controlLoading(false);
            })
            .catch((error) =>{
                this.controlLoading(false);
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

    cancelFilter = () => {
        this.setState({
            author: '',
            description: '',
            taskToUpdate: '',
            id_status: '',
            filterauthor: '',
            statusFilter: '',
            dateFilter: ''
        });
        this.getTask();
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
                        <input type="radio" name="month"
                               value="MONTH"
                               id="week" onChange={this.filterDate}
                               checked={this.state.dateFilter  === 'MONTH'}
                        />
                        This Month</label>
                    <label className="radio-inline">
                        <input type="radio" name="year"
                               value="YEAR"
                               id="year" onChange={this.filterDate}
                               checked={this.state.dateFilter  === 'YEAR'}
                        />
                        This Year</label>
                </div>
                <div className="col-md-10 col-md-offset-2 text-right" style={{display: 'flex'}}>
                    <input
                        type="button"
                        value="Cancel"
                        className="btn btn-primary"
                        style={{marginTop: '10px', marginRight: '10px',     width: '88px'  }}
                        onClick = {this.cancelFilter}
                    />
                    <input type="submit"
                           value="Search"
                           className="btn btn-primary"
                           style={{marginTop: '10px',  marginRight: '10px'}}
                    />

                </div>
                <div className="clearfix"></div>
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
                        <br/>
                        {
                            this.state.httpRequest === true ?
                                <div className="row">

                                    <div className="col-md-2 col-md-offset-5">
                                        <div className="loader"></div>
                                        <img src="" alt=""/>
                                    </div>
                                    <br/>
                                </div>
                                :
                                <span></span>
                        }

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
                                    {!this.state.task.length && <span style={{ textAlign: 'center' }}><h5> <i>no results</i></h5> </span> }

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

