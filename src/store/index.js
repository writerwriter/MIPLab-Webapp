import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {apiPQRSTResult, apiArrResult, apiABResult, apiPCGResult, apiHazardBackground, apiHazardHash, apiHazardResult} from '@/api'

export default new Vuex.Store({
  state: {
    file: null,
    isLoading: false,
    ECG: null,
    PCG: null,
    sample_rate_ECG: null,
    sample_rate_PCG: null,
    age: null,
    sex: null,
    PQRST: {
      label: null,
      interval_duration: null,
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
      PCG_resampled: null,
      label: null,
      isLoading: false,
    },
    Hazard: {
      aft_abnormal: {hash: null, cs: null, st: null, ypred: null, label: null},
      aft_normal: {hash: null, cs: null, st: null, ypred: null, label: null},
      isLoading: false,
    },
    wavesurfer: null,
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
    SavePatientData(state, info) {
      state.age = info.age;
      state.sex = info.gender;
    },
    SavePQRSTLabel(state, label){
      state.PQRST.label = label;
    },
    SavePQRSTIntervalDuration(state, intervalduration){
      state.PQRST.interval_duration = intervalduration;
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
    SaveS1S2PCGResampled(state, signal){
      state.S1S2.PCG_resampled = signal;
    },
    SaveS1S2Label(state, label){
      state.S1S2.label = label;
    },
    SaveHazardNormal(state, normal){
      if("hash" in normal) state.Hazard.aft_normal.hash = normal.hash;
      if("cs" in normal) state.Hazard.aft_normal.cs = normal.cs;
      if("st" in normal) state.Hazard.aft_normal.st = normal.st;
      if("ypred" in normal) state.Hazard.aft_normal.ypred = normal.ypred;
      if("label" in normal) state.Hazard.aft_normal.label = normal.label;
    },
    SaveHazardAbnormal(state, abnormal){
      if("hash" in abnormal) state.Hazard.aft_abnormal.hash = abnormal.hash;
      if("cs" in abnormal) state.Hazard.aft_abnormal.cs = abnormal.cs;
      if("st" in abnormal) state.Hazard.aft_abnormal.st = abnormal.st;
      if("ypred" in abnormal) state.Hazard.aft_abnormal.ypred = abnormal.ypred;
      if("label" in abnormal) state.Hazard.aft_abnormal.label = abnormal.label;
    },
    Loading(state, type){
      if(type == 'PQRST') state.PQRST.isLoading = true;
      else if(type == 'Arrhythmia') state.Arrhythmia.isLoading = true;
      else if(type == 'Abnormal') state.Abnormal.isLoading = true;
      else if(type == 'S1S2') state.S1S2.isLoading = true;
      else if(type == 'Hazard') state.Hazard.isLoading = true;
    },
    Loaded(state, type){
      if(type == 'PQRST') state.PQRST.isLoading = false;
      else if(type == 'Arrhythmia') state.Arrhythmia.isLoading = false;
      else if(type == 'Abnormal') state.Abnormal.isLoading = false;
      else if(type == 'S1S2') state.S1S2.isLoading = false;
      else if(type == 'Hazard') state.Hazard.isLoading = false;
    },
    Uploading(state){
      state.isLoading = true;
    },
    Uploaded(state){
      state.isLoading = false;
    },
    SaveWavesurfer(state, wavesurfer){
      state.wavesurfer = wavesurfer;
    },

  },
  actions: {
    AllTaskCalc({commit, state}){
      var data = {
        ECG: [state.ECG],
        PCG: [state.PCG],
      }

      JSON.stringify(data);
      
      commit('Loading', 'PQRST');
      apiPQRSTResult(data)
      .then(res => {
        commit('SavePQRSTLabel', res.data.label[0]);
        commit('SavePQRSTIntervalDuration', res.data.interval[0]);
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
        commit('SaveS1S2PCGResampled', res.data.resample_pcg);
        commit('Loaded', 'S1S2');
      })
      .catch(err => {
        console.log(err);
      })

      commit('Loading', 'Hazard');
      apiHazardHash()
      .then(resHash => {
        var hazardData = {
          ECG: [state.ECG],
          PCG: [state.PCG],
          age: state.age,
          sex: state.sex,
        }
        apiHazardResult(hazardData)
        .then(resResult => {
          commit('SaveHazardNormal', {label: resResult.data.label.ordinary});
          commit('SaveHazardAbnormal', {label: resResult.data.label.readmit});
          
          if(state.Hazard.aft_normal.hash != resHash.data.ordinary || state.Hazard.aft_abnormal.hash != resHash.data.readmit){
            commit('SaveHazardNormal', {hash: resHash.data.ordinary});
            commit('SaveHazardAbnormal', {hash: resHash.data.readmit});

            apiHazardBackground()
              .then(resBackground => {
                if(resBackground.data.ordinary != -1) commit('SaveHazardNormal', resBackground.data.ordinary);
                if(resBackground.data.readmit != -1) commit('SaveHazardAbnormal', resBackground.data.readmit);
                commit('Loaded', 'Hazard');
              })
              .catch(err => {
                console.log(err);
              })
          }
          else{
            commit('Loaded', 'Hazard');
          }
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch(err => {
        console.log(err);
      })
    }
  },
  modules: {
  }
})
