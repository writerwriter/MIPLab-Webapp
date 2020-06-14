import axios from 'axios';
import store from './store';

const PQRSTRequest = axios.create({
  baseURL: 'http://127.0.0.1:5000'
});

PQRSTRequest.interceptors.request.use((config) => {
    store.commit("Loading");
    return config;
  }, (error) => {
    store.commit("Loaded");
    return Promise.reject(error);
});
  
PQRSTRequest.interceptors.response.use((response) => {
    store.commit("Loaded");
    return response;
  }, (error) => {
    store.commit("Loaded");
    return Promise.reject(error);
});


export const apiPQRSTSendUploadFile = data => PQRSTRequest.post('/UploadFile', data);