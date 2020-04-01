import axios from 'axios';

export async function accountLogin(params) {
    return axios('/api/login', {
        method: 'POST',
        data: params,
    });
}

export async function fakeRegister(params) {
    return axios('/api/register', {
        method: 'POST',
        data: params,
    });
}

export async function getFakeCaptcha(mobile) {
    return axios(`/api/captcha?mobile=${mobile}`);
}

export async function query() {
  return axios('/api/users');
}

export async function queryCurrent() {
  return axios('/api/currentUser');
}
