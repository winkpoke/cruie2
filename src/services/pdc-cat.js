/*by miya*/
import { stringify } from 'qs';
import axios from 'axios';

export const index = (lng)=> axios.get(`/api/cat?lng=${lng}`);

export const show = (params,lng) => axios.get(`/api/cat/${params}?lng=${lng}`);

export const upload = (params) => axios.post(`/api/imageupload`,params);

export const store = (params) =>  axios.post(`/api/cat`,params);

export const update = (id,params) =>  axios.post(`/api/cat/${id}`,{...params, _method: 'put' });

export const remove = (id) => axios.post(`/api/cat/${id}`,{_method: 'delete'});
