import axios from 'axios';

export const accountLogin = (params) => axios.post(`${window.reqPrefix}/user/login`,params);
export const logout = () => axios.post(`${window.reqPrefix}/user/logout`);
export const fakeRegister = params => axios.post(`${window.reqPrefix}/user/sign`,params);
export const getFakeCaptcha = mobile => axios.get(`${window.reqPrefix}/captcha?mobile=${mobile}`);
export const query = axios.get(`${window.reqPrefix}/users`);
export const queryCurrent = axios.get(`${window.reqPrefix}/currentUser`);
