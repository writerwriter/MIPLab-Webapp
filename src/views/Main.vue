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
        <b-row>
            <b-col cols="12">
                <img class="loading" src='https://media.tenor.com/images/97cc6a6dc0c7479a293b8071f32fbf74/tenor.gif' v-show="this.$store.state.Arrhythmia.isLoading || this.$store.state.PQRST.isLoading || this.$store.state.S1S2.isLoading || this.$store.state.Abnormal.isLoading">      
            </b-col>
        </b-row>
        <b-row no-gutters>
            <b-col cols="12" xl="9">
                <!--
                <PlotSignal :rawData="this.$store.state.ECG" :label='this.$store.state.PQRST.label' :label2='this.$store.state.Arrhythmia.label' :type='"PQRST&&Arrhythmia"' v-if='this.$store.state.PQRST.label != null && this.$store.state.PQRST.isLoading == false && this.$store.state.Arrhythmia.label != null && this.$store.state.Arrhythmia.isLoading == false'></PlotSignal>    
                <PlotSignal :rawData="this.$store.state.S1S2.PCG" :label="this.$store.state.S1S2.label" :type="'S1S2'" v-if="this.$store.state.S1S2.label != null && this.$store.state.S1S2.isLoading == false"></PlotSignal>
                -->
                <PlotECGnPCG :ECG="this.$store.state.ECG" :PCG="this.$store.state.S1S2.PCG" :label_ECG="this.$store.state.PQRST.label" :label_Arr="this.$store.state.Arrhythmia.label" :label_PCG="this.$store.state.S1S2.label" v-if="this.$store.state.PQRST.label != null && this.$store.state.PQRST.isLoading == false && this.$store.state.Arrhythmia.label != null && this.$store.state.Arrhythmia.isLoading == false && this.$store.state.S1S2.label != null && this.$store.state.S1S2.isLoading == false"></PlotECGnPCG>
                <PCGPlayback v-if="this.$store.state.S1S2.isLoading != true && this.$store.state.S1S2.PCG != null"></PCGPlayback>
                </b-col>
            <b-col cols="12" xl="3">
                <b-card class='report_card' v-if="this.$store.state.PQRST.isLoading == false && this.$store.state.S1S2.isLoading == false && this.$store.state.PQRST.interval_duration != null && this.$store.state.Abnormal.label != null && this.$store.state.S1S2.label != null">
                    <b-table outlined striped responsive :items="interval_duration_table"></b-table>
                    <PlotAbnormal :rawData="this.$store.state.ECG" :label="this.$store.state.Abnormal.label" :type="'Abnormal'" v-if="this.$store.state.Abnormal.label != null && this.$store.state.Abnormal.isLoading == false"></PlotAbnormal>
                    <PlotHazard :data="this.$store.state.Hazard.aft_normal" :type="'ordinary'" v-if="this.$store.state.Hazard.isLoading == false && this.$store.state.Hazard.aft_normal.ypred != null"></PlotHazard>
                    <PlotHazard :data="this.$store.state.Hazard.aft_abnormal" :type="'readmit'" v-if="this.$store.state.Hazard.isLoading == false && this.$store.state.Hazard.aft_abnormal.ypred != null"></PlotHazard>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
import store from '@/store';
import {apiFileUpload} from '@/api.js'
//import PlotSignal from '@/components/PlotSignal.vue'
import PlotAbnormal from '@/components/PlotAbnormal.vue'
import PlotECGnPCG from '@/components/PlotECGnPCG.vue'
import PlotHazard from '@/components/PlotHazard.vue'
import UploadModal from '@/components/UploadModal.vue'
import PCGPlayback from '@/components/PCGPlayback.vue'

export default {
    name: "Main",
    components: {
        //PlotSignal,
        PlotAbnormal,
        PlotECGnPCG,
        UploadModal,
        PCGPlayback,
        PlotHazard,
    },
    data(){
        return{
            file: null,
        }
    },
    computed: {
        interval_duration_table: function(){
            return [
                {interval: "P duration", 
                mean: store.state.PQRST.interval_duration.p_duration.mean.toFixed(2), 
                variance: store.state.PQRST.interval_duration.p_duration.var.toFixed(2)},
                {interval: "PQ interval", 
                mean: store.state.PQRST.interval_duration.pq_interval.mean.toFixed(2), 
                variance: store.state.PQRST.interval_duration.pq_interval.var.toFixed(2)},
                {interval: "QRS duration", 
                mean: store.state.PQRST.interval_duration.qrs_duration.mean.toFixed(2), 
                variance: store.state.PQRST.interval_duration.qrs_duration.var.toFixed(2)},
                {interval: "QT interval", 
                mean: store.state.PQRST.interval_duration.qt_interval.mean.toFixed(2), 
                variance: store.state.PQRST.interval_duration.qt_interval.var.toFixed(2)},
                {interval: "EMAT",
                mean: this.emat[0].toFixed(2),
                variance: this.emat[1].toFixed(2)}
            ]
        },
        emat: function(){
            var qrs = store.state.PQRST.label[2];
            var s1_peak = store.state.S1S2.label[0];
            var qrs_onset = [];
            for(var i = 0; i < qrs.length - 1; i++){
                if(qrs[i] == 0 && qrs[i+1] == 1){
                    qrs_onset.push(i+1);
                }
            }
            var emat = [];
            var s1_pointer = 0;
            for(i = 0; i < qrs_onset.length; i++){
                if(s1_pointer >= s1_peak.length) break;
                if(s1_peak[s1_pointer] >= qrs_onset[i] && (i == qrs_onset.length-1 || s1_peak[s1_pointer] < qrs_onset[i+1])){
                    emat.push(2 * (s1_peak[s1_pointer] - qrs_onset[i]));
                }
                else if(!(i == qrs_onset.length-1 || s1_peak[s1_pointer] < qrs_onset[i+1])){
                    continue;
                }
                else{
                    s1_pointer++;
                    i--;
                }
            }
            var mean = 0;
            for(i = 0; i < emat.length; i++) mean += emat[i]/emat.length;
            var variance = 0;
            for(i = 0; i < emat.length; i++) variance += Math.pow(emat[i]-mean, 2) / emat.length;
            return [mean, variance]
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
                                                    //var blob = new window.Blob([new Float32Array(store.state.PCG)]);
                                                    //wavesurfer.loadBlob(blob);

                                                    //wavesurfer.loadArrayBuffer(new Float32Array(store.state.PCG).buffer);
                                                })
                                                .catch(res => {
                                                    console.log(res);
                                                })
                                            }
                                        })
                                    }
                                    else if(entry.name == 'snapshot.xml'){
                                        zipFile.readEntryData(entry, false, async function(err, readStream){
                                            var snapshot_xml = await vue_instance.streamToBlob(readStream);
                                            snapshot_xml.text().then(text=>{
                                                var parser = new DOMParser();
                                                var xmlDoc = parser.parseFromString(text, "text/xml");
                                                //console.log(xmlDoc.getElementsByTagName("Gender")[0].childNodes[0].nodeValue);
                                                //console.log(xmlDoc.getElementsByTagName("DateOfBirth")[0].childNodes[0].nodeValue);
                                                var birth = Date.parse(xmlDoc.getElementsByTagName("DateOfBirth")[0].childNodes[0].nodeValue);
                                                var today = Date.parse(xmlDoc.getElementsByTagName("Created")[0].childNodes[0].nodeValue);
                                                var age = Math.floor((today - birth) / 86400000 / 365);
                                                //console.log(age);
                                                store.commit('SavePatientData', {age: age, gender: xmlDoc.getElementsByTagName("Gender")[0].childNodes[0].nodeValue});
                                            })
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
        },
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
.report_card {
    margin-top: 14px;
}
</style>