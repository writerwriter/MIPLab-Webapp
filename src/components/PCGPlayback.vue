<template>
<div class="container-playback">
    <div id="waveform"></div>
    <b-button @click="onPlayButtonClick" variant="primary">Play / Pause</b-button>
</div>
</template>

<script>
import store from '@/store';
import WaveSurfer from 'wavesurfer.js'
import createBuffer from 'audio-buffer-from'
export default {
    name: "PCGPlayback",
    mounted(){
        const waveform = document.getElementById("waveform");
        waveform.textContent = '';
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor : '#47e0ff',
            progressColor: 'blue',
            hideScrollbar: true,
            normalize: true,
            responsive: true,
        });
        store.commit('SaveWavesurfer', wavesurfer);
        var audioBuffer = createBuffer(new Float32Array(store.state.S1S2.PCG_resampled), {sampleRate: 3000});

        store.state.wavesurfer.loadDecodedBuffer(audioBuffer);
    },
    methods: {
        onPlayButtonClick(){
            store.state.wavesurfer.playPause();
        },
    }
}
</script>

<style scoped>
.container-playback {
    padding: 0;
    margin: 0;
}
</style>
