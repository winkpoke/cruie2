/**
 * Created by miyaye on 2020/1/21.
 */
import axios from 'axios'
/*获取订单列表*/
export const getOrderList = () => axios.get(`/api/orderListBk`);
/*获取订单详情*/
export const getOrderDetail = (id) => axios.get(`/api/orderDetailBk/${id}`);
/*发货*/
export const ship = (id) => axios.post(`/api/ship/${id}`);


/*项目管理*/
export const catList = () => axios.get(`/cat/index`);
export const catAdd = (params) => axios.post(`/cat/add`,params);
export const catUpdate = (id,params) => axios.post(`/cat/update/${id}`,params);
export const catDelete = (id) => axios.post(`/cat/delete/${id}`);

/*页面管理*/
export const pageIndex = () => axios.get(`/page/index`);
export const pageAdd = (params) => axios.post(`/page/add/`,params);
export const pageUpdate = (id) => axios.post(`/page/update/${id}`);
export const pageDelete = (id) => axios.post(`/page/delete/${id}`);
export const pageDetail = (id) => axios.get(`/page/detail/${id}`);

/*页面配置*/
export const pageCIndex = () => axios.get(`/pageC/index`);
export const pageCAdd = (params) => axios.post(`/pageC/add/`,params);
export const pageCUpdate = (id,params) => axios.post(`/pageC/update/${id}`,params);
export const pageCDelete = (id) => axios.post(`/pageC/delete/${id}`);
export const pageCDetail = (id) => axios.get(`/pageC/${id}`);

