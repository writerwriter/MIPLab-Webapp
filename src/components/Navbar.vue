<template>
<div>
    <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">CardioTool</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item to="Main" :active="$route.name=='Main'">Main</b-nav-item>
                <b-nav-item to="PQRST" :active="$route.name=='PQRST'">PQRST</b-nav-item>
                <b-nav-item to="Abnormal" :active="$route.name=='Abnormal'">Abnormal</b-nav-item>
                <b-nav-item to="Hazard" :active="$route.name=='Hazard'">Hazard</b-nav-item>
                <b-nav-item to="Arrhythmia" :active="$route.name=='Arrhythmia'">Arrhythmia</b-nav-item>
                <b-nav-item to="PCg" :active="$route.name=='PCG'">PCG</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-text right>powered by</b-nav-text>
                <b-nav-item right href="https://www.nycu.edu.tw/" target="_blank" rel="noopener noreferrer">國立陽明交通大學</b-nav-item>
                <b-nav-item right href="https://www.vghtpe.gov.tw/Index.action" target="_blank" rel="noopener noreferrer">台北榮總</b-nav-item>
                <b-nav-item right href="https://www.leadtek.com/cht/" target="_blank" rel="noopener noreferrer">麗臺科技</b-nav-item>
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