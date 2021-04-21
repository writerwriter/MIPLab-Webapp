<template>
<div class="hazard-container">
    <img class="loading" src='https://media.tenor.com/images/97cc6a6dc0c7479a293b8071f32fbf74/tenor.gif' v-show="this.$store.state.Hazard.isLoading == true">      
    <PlotHazard :data="this.$store.state.Hazard.aft_normal" :type="'ordinary'" v-if="this.$store.state.Hazard.isLoading == false && this.$store.state.Hazard.aft_normal.ypred != null"></PlotHazard>
    <PlotHazard :data="this.$store.state.Hazard.aft_abnormal" :type="'readmit'" v-if="this.$store.state.Hazard.isLoading == false && this.$store.state.Hazard.aft_abnormal.ypred != null"></PlotHazard>   
</div>
</template>
<script>
import PlotHazard from '@/components/PlotHazard.vue'
export default {
    name: "Hazard",
    components: {
        PlotHazard,
    }
    
}
</script>
<style scoped>
.hazard-container{
    width: min(100vw, 1200px);
    margin: auto;
}

</style>