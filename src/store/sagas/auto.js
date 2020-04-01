import axios from 'axios';
//takeLatest 连续点只触发一次, 防止并发
//takeEvery 点一次触发一次

import {takeEvery,put, call,all} from 'redux-saga/effects';

//=================================user part start===================================================================
function* fetchUser() {
    console.log('fetchUser async')
    try{
        const [user,todos] = yield  all([
            call( axios.get, "https://jsonplaceholder.typicode.com/users" ),
            call( axios.get, "https://jsonplaceholder.typicode.com/todos" )
        ]);
        //dispatch
        yield put({type:"FETCH_USER_SUCCESS",user})
    }catch (e) {
        yield put({type:"FETCH_USER_ERROR",error:e.message})
    }
}
/*
function* fetchTodos() {
    const todos = yield call( axios.get, "https://jsonplaceholder.typicode.com/todos" );
    console.log(todos)
}

export function* watchFetchUserAsync() {
    yield takeEvery('FETCH_USER_REQUEST',fetchUser)
}

export function* watchFetchTodosAsync() {
    yield takeEvery('FETCH_TODO_REQUEST',fetchTodos)
}*/
