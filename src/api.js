import axios from 'axios';
import store from './store';

const PQRSTRequest = axios.create({
  baseURL: 'http://127.0.0.1:5000'
});

const ABRequest = axios.create({
  baseURL: 'http://127.0.0.1:5001'
})

const HPRequest = axios.create({
  baseURL: 'http://127.0.0.1:5002'
})

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

export const apiABResult = data => ABRequest.post('/submit_ekg', data);

export const apiHPResult = data => HPRequest.post('/submit_ekg', data);