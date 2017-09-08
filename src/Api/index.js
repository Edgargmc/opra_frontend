import axios from 'axios';
const URL =  'http://localhost/php_framework/codeigneiter/opratel/';


const EndPoints = {

    getTasks(){
        return axios.get(URL + 'tasks');
    },
    setNewTask(data){
        return axios.post(URL + 'tasks', data);
    },
    deleteTask(id){
        return axios.delete(URL + 'task/delete/' + id);
    },
    updateTask(id, data){
        return axios.put(URL + 'task/update/' + id, data);
    },
    filter(data){
        return axios.post(URL + 'filter/', data);
    }

};


export default EndPoints;