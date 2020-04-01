//=================================increment part start=============================================================
import {takeEvery,put, call} from 'redux-saga/effects';

const delay = (ms) => new Promise(resolve => setTimeout(resolve,ms))
function* incrementAsync() {
    yield  call( delay,1000 );
    //2s 后dispatch一个increment
    yield put({type:'INCREMENT'})
}

export default function* watchIncrementAsync() {
    //takeEvery可以监听action 没点一次触发一次
    yield takeEvery("INCREMENT_ASYNC",incrementAsync)
}