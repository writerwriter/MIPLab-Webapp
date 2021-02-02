<template>
<div>
    <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">MIPLab</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item to="Main" :active="$route.name=='Main'">Main</b-nav-item>
                <b-nav-item to="PQRST" :active="$route.name=='PQRST'">PQRST</b-nav-item>
                <b-nav-item to="Abnormal" :active="$route.name=='Abnormal'">Abnormal</b-nav-item>
                <b-nav-item to="Hazard" :active="$route.name=='Hazard'" v-if=false>Hazard</b-nav-item>
                <b-nav-item to="Arrhythmia" :active="$route.name=='Arrhythmia'">Arrhythmia</b-nav-item>
                <b-nav-item to="PCg" :active="$route.name=='PCG'">PCG</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</div>
</template>

<script>
export default {
}
</script>
<style scoped>

</style>