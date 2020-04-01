//takeLatest 连续点只触发一次, 防止并发
//takeEvery 点一次触发一次
import {index,asyncAttrs, show, update, store, remove} from '@/services/attributeset'
import {index as indexAttrs} from '@/services/attribute'

import {takeEvery,put, call,all} from 'redux-saga/effects';
const namespace = "attributeset";

const InitialState = {
    detail:{},
    list: [],
    attrList:[]}

const effects = {
    *asyncAttrs({payload,attrs}, {call, put,select}){
            const response = yield call(asyncAttrs, payload,{attrs});
        },
    *fetch({payload}, {call, put}) {
            const response = yield call(index, payload);
            yield put({
                type: 'save',
                payload: response.data.data,
                key:'list'
            });
        },
    *fetchAttrs({payload},{call,put}){
            const response = yield call(indexAttrs, payload);
            yield put({
                type: 'save',
                payload: response.data.data,
                key:'attrList'
            });
        },
    *detail({payload}, {call, put}) {
            const response = yield call(show, payload);
            yield put({
                type: 'save',
                payload: response.data,
                key:'detail'
            });
        },
    *store({payload, callback}, {call, put}) {
            const response = yield call(store, payload);
            if (response.status == 'success') {
                message.success('新增成功', 1);
                yield put(routerRedux.push({
                    pathname: '/category/attribute-set/index'
                }))
            }
            if (callback) callback();
        },
    *remove({payload, callback}, {call, put}) {
            const response = yield call(remove, payload);
            yield put({
                type: 'fetch'
            });
            if (callback) callback();
        },
    *update({payload, id, callback}, {call, put}) {
            const response = yield call(update, payload, id);
            if (response.status == 'success') {
                message.success('修改成功', 1);
                yield put(routerRedux.push({
                    pathname: '/category/attribute-set/index'
                }))
            }
            if (callback) callback();
        },
};

//这是saga
export function *watchFechAttributeSetAsync() {
    yield takeEvery('attributeset/fetchAttrs',effects.fetchAttrs);
}
