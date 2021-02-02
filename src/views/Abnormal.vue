<template>
    <div class="m-3">
        <img class="loading" src='https://media.tenor.com/images/97cc6a6dc0c7479a293b8071f32fbf74/tenor.gif' v-if="this.$store.state.Abnormal.isLoading">
        <PlotAbnormal :rawData="this.$store.state.ECG" :label="this.$store.state.Abnormal.label" :type="'Abnormal'" v-if="this.$store.state.Abnormal.label != null && this.$store.state.Abnormal.isLoading == false"></PlotAbnormal>
    </div>
</template>
<script>
import PlotAbnormal from '@/components/PlotAbnormal.vue'
export default {
    name: "Abnormal",
    components: {
        PlotAbnormal,
    },
}
</script>
<style scoped>

</style>