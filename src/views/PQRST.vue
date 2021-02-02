<template>
<div class="m-3">
    <!--
    <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="choose or drop a signal raw file here"
        drop-placeholder="drop a signal raw file here"
        @input="OnFileUpload"
    ></b-form-file>
    -->
    <img class="loading" src='https://media.tenor.com/images/97cc6a6dc0c7479a293b8071f32fbf74/tenor.gif' v-if="this.$store.state.PQRST.isLoading">
    <!--
    <PlotPQRSTSignal :rawData="this.$store.state.ECG" :label="this.$store.state.PQRST.label" v-if="this.$store.state.PQRST.label != null && this.$store.state.PQRST.isLoading == false"></PlotPQRSTSignal>
    -->
    <PlotSignal :rawData="this.$store.state.ECG" :label='this.$store.state.PQRST.label' :type='"PQRST"' v-if='this.$store.state.PQRST.label != null && this.$store.state.PQRST.isLoading == false'></PlotSignal>
</div>
</template>

<script>
//import PlotPQRSTSignal from '@/components/PlotPQRSTSignal.vue'
import PlotSignal from '@/components/PlotSignal.vue'
//import {apiPQRSTSendUploadFile} from '@/api.js'

export default{
    name: "PQRST",
    components: {
        PlotSignal,
    }
}
</script>

<style scoped>
</style>