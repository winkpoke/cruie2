/*by miya*/
import { stringify } from 'qs';
import axios from 'axios';

/**查询属性集列表*/
export const index = (params) => axios.get(`/api/attribute_set`);

/**查询单个属性集*/
export const show = (params)=> axios.get(`/api/attribute_set/${params}`);

/**新增属性集*/
export const store = (params) => axios.post(`/api/attribute_set`,params);

/**更新属性集*/
export const update = (id) => axios.post(`/api/attribute_set/${id}`,{_method:'put'});
/**删除属性集*/

export const remove = (id) => axios.post(`/api/attribute_set/${id}`,{_method:'delete'});
/**关联属性到属性集*/

export const asyncAttrs = (params)=> axios.post(`/api/attribute_set/syncAttrs/${id}`,params);

/*** 获取当前属性集下的所有属性 @param id*/
export const getAttrsBySet = (id) => axios.post(`/api/attribute_set/getAttrsBySet/${id}`);