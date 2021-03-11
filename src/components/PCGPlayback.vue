<template>
<div class="container-playback">
    <div id="waveform"></div>
    <b-button v-if="this.$store.state.S1S2.isLoading==false && this.$store.state.S1S2.PCG!=null" @click="onPlayButtonClick" variant="primary">Play / Pause</b-button>
</div>
</template>

<script>
import store from '@/store';
import WaveSurfer from 'wavesurfer.js'
import createBuffer from 'audio-buffer-from'
export default {
    name: "PCGPlayback",
    watch: {
        '$store.state.S1S2.isLoading': function() {
            if(this.$store.state.S1S2.isLoading == false){
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
                var tmp = new Array(store.state.S1S2.PCG.length*6);
                for(var i = 0; i < tmp.length; i++){
                    tmp[i] = store.state.S1S2.PCG[Math.floor(i/6)] / 3;
                }
                var buffer = new Float32Array(tmp);
                var audioBuffer = createBuffer(buffer, {sampleRate: 3000});

                store.state.wavesurfer.loadDecodedBuffer(audioBuffer);
            }
        }
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