<template>
<div class='plot_container'>
    <b-container fluid>
        <b-row no-gutters>
            <b-col cols="11">
                <b-form-file
                    v-model="file"
                    :state="Boolean(file)"
                    placeholder="choose or drop a snp file here"
                    drop-placeholder="drop a snp file here"
                    @input="OnFileUpload"
                ></b-form-file>
            </b-col>
            <b-col>
                <UploadModal></UploadModal>
            </b-col>
        </b-row>
    </b-container>
    <img class="loading" src='https://media.tenor.com/images/97cc6a6dc0c7479a293b8071f32fbf74/tenor.gif' v-show="this.$store.state.Arrhythmia.isLoading || this.$store.state.PQRST.isLoading || this.$store.state.S1S2.isLoading || this.$store.state.Abnormal.isLoading">
    <!--
    <PlotSignal :rawData="this.$store.state.ECG" :label='this.$store.state.PQRST.label' :label2='this.$store.state.Arrhythmia.label' :type='"PQRST&&Arrhythmia"' v-if='this.$store.state.PQRST.label != null && this.$store.state.PQRST.isLoading == false && this.$store.state.Arrhythmia.label != null && this.$store.state.Arrhythmia.isLoading == false'></PlotSignal>    
    <PlotSignal :rawData="this.$store.state.S1S2.PCG" :label="this.$store.state.S1S2.label" :type="'S1S2'" v-if="this.$store.state.S1S2.label != null && this.$store.state.S1S2.isLoading == false"></PlotSignal>
    -->
    <PlotECGnPCG :ECG="this.$store.state.ECG" :PCG="this.$store.state.S1S2.PCG" :label_ECG="this.$store.state.PQRST.label" :label_Arr="this.$store.state.Arrhythmia.label" :label_PCG="this.$store.state.S1S2.label" v-if="this.$store.state.PQRST.label != null && this.$store.state.PQRST.isLoading == false && this.$store.state.Arrhythmia.label != null && this.$store.state.Arrhythmia.isLoading == false && this.$store.state.S1S2.label != null && this.$store.state.S1S2.isLoading == false"></PlotECGnPCG>
    <PlotAbnormal :rawData="this.$store.state.ECG" :label="this.$store.state.Abnormal.label" :type="'Abnormal'" v-if="this.$store.state.Abnormal.label != null && this.$store.state.Abnormal.isLoading == false"></PlotAbnormal>
    </div>    
</template>

<script>
import store from '@/store';
import {apiFileUpload} from '@/api.js'
//import PlotSignal from '@/components/PlotSignal.vue'
import PlotAbnormal from '@/components/PlotAbnormal.vue'
import PlotECGnPCG from '@/components/PlotECGnPCG.vue'

import UploadModal from '@/components/UploadModal.vue'

export default {
    name: "Main",
    components: {
        //PlotSignal,
        PlotAbnormal,
        PlotECGnPCG,
        UploadModal,
    },
    data(){
        return{
            file: null,
        }
    },
    methods: {
        OnFileUpload(e){
            store.commit('SaveFile', this.file);

            var vue_instance = this;
            if(e != null){
                var formdata = new FormData();
                
                var unzip = require('unzip-js');
                unzip(e, function(err, zipFile){
                    if(!err){
                        zipFile.readEntries(function(err, entries){
                            if(!err){
                                entries.forEach(function(entry){
                                    if(entry.name == 'snapshot.raw'){
                                        zipFile.readEntryData(entry, false, async function(err, readStream){
                                            if(!err){
                                                vue_instance.file = await vue_instance.streamToBlob(readStream);
                                                
                                                formdata.append("snp", vue_instance.file);

                                                store.commit('Uploading');
                                                apiFileUpload(formdata)
                                                .then(res => {
                                                    store.commit('SaveSnpData', res.data);
                                                    store.commit('Uploaded');
                                                    store.dispatch('AllTaskCalc');
                                                })
                                                .catch(res => {
                                                    console.log(res);
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        },
        streamToBlob(stream, mimeType){
            if (mimeType != null && typeof mimeType !== 'string') {
                throw new Error('Invalid mimetype, expected string.')
            }
            return new Promise((resolve, reject) => {
                const chunks = []
                stream
                .on('data', chunk => chunks.push(chunk))
                .once('end', () => {
                    const blob = mimeType != null
                    ? new Blob(chunks, { type: mimeType })
                    : new Blob(chunks)
                    resolve(blob)
                })
                .once('error', reject)
            })
        }
    }
    
}
</script>

<style scoped>
.plot_container {
    margin: 0;
    padding: 0;
    padding-top: 15px;
    height: 70vh;
}
</style>