<template>
<div class="m-3">
    <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="choose or drop a signal raw file here"
        drop-placeholder="drop a signal raw file here"
        @input="OnFileUpload"
    ></b-form-file>
    <img class="loading" src='https://cdn.dribbble.com/users/267/screenshots/1927432/loading.gif' v-if="this.$store.state.isLoading">
    <PlotSignal :rawData="signal" :label="label" v-if="show_plot"></PlotSignal>
</div>
</template>

<script>
import PlotSignal from '@/components/PlotSignal.vue'
import {apiPQRSTSendUploadFile} from '@/api.js'

export default{
    name: "PQRST",
    components: {
        PlotSignal,
    },
    data(){
        return{
            file: null,
            signal: "",
            label: "",
            show_plot: false, 
        }
    },
    methods: {
        OnFileUpload(e){
            this.show_plot = false;
            var formdata = new FormData();
            this.file = e;
            formdata.append("raw", this.file);
            apiPQRSTSendUploadFile(formdata)
            .then(res => {
                this.signal = res.data.raw[0][0];
                this.label = res.data.label[0];
                this.show_plot = true;
            })
            .catch(res => {
                console.log(res);
            });
        }
    }
}

</script>
<style scoped>
.loading {
    height: 70vh;
}
</style>