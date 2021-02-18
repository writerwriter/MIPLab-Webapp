import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {apiPQRSTResult, apiArrResult, apiABResult, apiPCGResult} from '@/api'

export default new Vuex.Store({
  state: {
    file: null,
    isLoading: false,
    ECG: null,
    PCG: null,
    sample_rate_ECG: null,
    sample_rate_PCG: null,
    PQRST: {
      label: null,
      isLoading: false,
    },
    Arrhythmia: {
      label: null,
      isLoading: false,
    },
    Abnormal: {
      label: null,
      isLoading: false,
    },
    S1S2: {
      PCG: null,
      label: null,
      isLoading: false,
    },
  },
  mutations: {
    SaveFile(state, uploadfile){
      state.file = uploadfile;
    },
    SaveSnpData(state, snp) {
      state.ECG = snp.ECG;
      state.PCG = snp.PCG;
      
      state.sample_rate_ECG = snp.sample_rate_ECG;
      state.sample_rate_PCG = snp.sample_rate_PCG;
    },
    SavePQRSTLabel(state, label){
      state.PQRST.label = label;
    },
    SaveArrhythmiaLabel(state, label){
      state.Arrhythmia.label = label;
    },
    SaveAbnormalLabel(state, label){
      state.Abnormal.label = label;
    },
    SaveS1S2PCG(state, signal){
      state.S1S2.PCG = signal;
    },
    SaveS1S2Label(state, label){
      state.S1S2.label = label;
    },
    Loading(state, type){
      if(type == 'PQRST') state.PQRST.isLoading = true;
      else if(type == 'Arrhythmia') state.Arrhythmia.isLoading = true;
      else if(type == 'Abnormal') state.Abnormal.isLoading = true;
      else if(type == 'S1S2') state.S1S2.isLoading = true;
    },
    Loaded(state, type){
      if(type == 'PQRST') state.PQRST.isLoading = false;
      else if(type == 'Arrhythmia') state.Arrhythmia.isLoading = false;
      else if(type == 'Abnormal') state.Abnormal.isLoading = false;
      else if(type == 'S1S2') state.S1S2.isLoading = false;
    },
    Uploading(state){
      state.isLoading = true;
    },
    Uploaded(state){
      state.isLoading = false;
    }

  },
  actions: {
    AllTaskCalc({commit, state}){
      var data = {
        ECG: [state.ECG],
        PCG: [state.PCG],
      }
      /*
      var formdata = new FormData();

      formdata.append("ECG", state.ECG);
      formdata.append("PCG", state.PCG);
      */

      JSON.stringify(data);
      
      commit('Loading', 'PQRST');
      apiPQRSTResult(data)
      .then(res => {
        commit('SavePQRSTLabel', res.data.label[0]);
        commit('Loaded', 'PQRST');
      })
      .catch(err => {
        console.log(err);
      })

      commit('Loading', 'Arrhythmia');
      apiArrResult(data)
      .then(res => {
        commit('SaveArrhythmiaLabel', res.data.label);
        commit('Loaded', 'Arrhythmia');
      })
      .catch(err => {
        console.log(err);
      })

      commit('Loading', 'Abnormal');
      apiABResult(data)
      .then(res => {
        commit('SaveAbnormalLabel', res.data.label);
        commit('Loaded', 'Abnormal');
      })
      .catch(err => {
        console.log(err);
      })

      commit('Loading', 'S1S2');
      apiPCGResult(data)
      .then(res => {
        commit('SaveS1S2PCG', res.data.pcg[0][0]);
        commit('SaveS1S2Label', res.data.label);
        commit('Loaded', 'S1S2');
      })
      .catch(err => {
        console.log(err);
      })

    }
  },
  modules: {
  }
})
