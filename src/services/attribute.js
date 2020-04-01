/*by miya*/
import { stringify } from 'qs';
import axios from 'axios';

export const index = () => axios(`/api/attribute`);
export const show = (id,locale) => axios.get(`/api/attribute/${id}?locale=${locale}`);
export const getAttrOptionList = (params) => axios.post(`/api/getAttrOptionList`,params);
export const store = params => axios.post(`/api/attribute`,params);
export const update = (id,params) => axios.post(`/api/attribute/${id}`,{...params,_method:'put'});
export const remove = params => axios.post(`/api/attribute/${id}`,{...params,_method:'delete'});
