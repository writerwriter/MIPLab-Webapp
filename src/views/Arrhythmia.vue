<template>
    <div class='m-3'>
        <img class="loading" src='https://media.tenor.com/images/97cc6a6dc0c7479a293b8071f32fbf74/tenor.gif' v-if="this.$store.state.Arrhythmia.isLoading">
        <PlotSignal :rawData="this.$store.state.ECG" :label2="this.$store.state.Arrhythmia.label" :type="'Arrhythmia'" v-if="this.$store.state.Arrhythmia.label != null && this.$store.state.Arrhythmia.isLoading == false"></PlotSignal>
    </div>
</template>

<script>
import PlotSignal from '@/components/PlotSignal.vue'

export default {
    name: "Arrhythmia",
    components: {
        PlotSignal,
    },
    
}
</script>

<style scoped>
.loading {
    height: 70vh;
}
</style>