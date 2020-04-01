/*by miya*/
import { stringify } from 'qs';
import axios from 'axios';

export const index = (lng,page)=> axios.get(`/api/product?lng=${lng}&page=${page}`);

export const show = (params,lng) => axios.get(`/api/product/${params}?lng=${lng}`);

export const upload = (params) => axios.post(`/api/imageupload`,params);

export const store = (params) => axios.post(`/api/product`,params);

export const update = (id,params) => axios.post(`/api/product/${id}`,{ ...params, _method: 'put' });

export const remove = (id) =>axios.post(`/api/product/${id}`,{ _method: 'delete' });

export const asyncAttrs = (id,params) => axios.post(`/api/product/syncAttrs/${id}`,params);

