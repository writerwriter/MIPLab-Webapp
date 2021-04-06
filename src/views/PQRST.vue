<template>
<div class="m-3">\
    <img class="loading" src='https://media.tenor.com/images/97cc6a6dc0c7479a293b8071f32fbf74/tenor.gif' v-if="this.$store.state.PQRST.isLoading">\
    <PlotSignal :rawData="this.$store.state.ECG" :label='this.$store.state.PQRST.label' :type='"PQRST"' v-if='this.$store.state.PQRST.label != null && this.$store.state.PQRST.isLoading == false'></PlotSignal>
</div>
</template>

<script>
import PlotSignal from '@/components/PlotSignal.vue'

export default{
    name: "PQRST",
    components: {
        PlotSignal,
    }
}
</script>

<style scoped>
</style>