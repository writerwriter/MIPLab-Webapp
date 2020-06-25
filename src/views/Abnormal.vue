<template>
    <div class="m-3">
        <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="choose or drop a signal raw file here"
        drop-placeholder="drop a signal raw file here"
        @input="OnFileUpload"
    ></b-form-file>
        <PlotAbnormal :rawData=shap v-if="show"></PlotAbnormal>
    </div>
</template>
<script>
import PlotAbnormal from '@/components/PlotAbnormal.vue'
import {apiABResult} from '@/api.js'
export default {
    data() {
        return {
            file: null,
            shap: [],
            abnormal_rate: 0,
            show: false,
        }
    },
    components: {
        PlotAbnormal,
    },
    methods: {
        data_generate() {
            var data_length = 100;
            var dim = 2;
            for(var i = 0; i < dim; i++){
                this.shap.push([]);
                for(var j = 0; j < data_length; j++){
                    this.shap[i].push(Math.random() * 2 - 1);
                }
            }
            this.show = true;
        },
        OnFileUpload(e){
            this.show = false;
            var formdata = new FormData();
            this.file = e;
            formdata.append("raw", this.file);
            apiABResult(formdata)
            .then(res => {
                this.shap = res.data.raw;
                this.abnormal_rate = res.data.abnormal_rate;
                this.show = true;
            })
            .catch(res => {
                console.log(res);
            })
        }
    },
    mounted(){
        this.data_generate();
    },
}
</script>
<style scoped>

</style>