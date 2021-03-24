import axios from 'axios';
import store from './store';

//const proxyurl = 'https://cors-anywhere.herokuapp.com/'

const FileIO = axios.create({
  baseURL: '/fileIO'
});

const PQRSTRequest = axios.create({
  baseURL: '/PQRST'
});

const ABRequest = axios.create({
  baseURL: '/Abnormal'
});

const ArrRequest = axios.create({
  baseURL: '/Arrhythmia'
});

const PCGRequest = axios.create({
  baseURL: '/PCG'
});

const HazardRequest = axios.create({
  baseURL: '/Hazard'
});

FileIO.interceptors.request.use((config) => {
  store.commit("Loading");
  return config;
}, (error) => {
  store.commit("Loaded");
  return Promise.reject(error);
});

FileIO.interceptors.response.use((response) => {
  store.commit("Loaded");
  return response;
}, (error) => {
  store.commit("Loaded");
  return Promise.reject(error);
})

export const apiFileUpload = data => FileIO.post('/UploadFile', data);

export const apiFileSave = data => FileIO.post('/SaveFile', data);

export const apiPQRSTResult = data => PQRSTRequest.post('/submit_PQRST', data);

export const apiABResult = data => ABRequest.post('/submit_abnormal', data);

export const apiArrResult = data => ArrRequest.post('/submit_arrhythmia', data);

export const apiPCGResult = data => PCGRequest.post('/submit_S1', data);

export const apiHazardBackground = () => HazardRequest.get('/background');

export const apiHazardHash = () => HazardRequest.get('/hash');

export const apiHazardResult = data => HazardRequest.post('/submit_hazard', data);