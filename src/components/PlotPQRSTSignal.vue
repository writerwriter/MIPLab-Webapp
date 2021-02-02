<template>
<div>
    <div class="chart" ref="chart"></div>
    <b-container fluid>
        <b-row fluid class="justify-content-center mb-2">
            <b-button-group>
                <b-button variant="primary" :pressed="mode=='View'" @click="OnModeChange">View</b-button>
                <b-button variant="primary" :pressed="mode=='Edit'" @click="OnModeChange">Edit</b-button>
            </b-button-group>
        </b-row>
        <b-row fluid class="justify-content-center">
            <b-button-group v-if="mode=='Edit'">
                <b-button variant="danger" :pressed="colorMode=='P'" @click="OnColorChange">P</b-button>
                <b-button variant="success" :pressed="colorMode=='QRS'" @click="OnColorChange">QRS</b-button>
                <b-button variant="primary" :pressed="colorMode=='T'" @click="OnColorChange">T</b-button>
            </b-button-group>
        </b-row>
        <b-row>
            <b-button variant="primary" @click="OnDownloadClick">Download</b-button>
        </b-row>
    </b-container>
</div>
</template>
<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
export default {
    names: "PlotPQRSTSignal",
    props: ['rawData', 'label'],
    data() {
        return {
            colors: ["black", "red", "green", "blue"],
            mode: "View",
            colorMode: "P",
            labels: {
                "p" : [],
                "qrs": [],
                "t": []
                },
        }
    },
    mounted(){
        var chart = am4core.create(this.$refs.chart, am4charts.XYChart);
        chart.paddingRight = 20;
        
        var data = [];
        for(var i = 0; i < this.rawData.length; i++){
            data.push({X: i ,Y: this.rawData[i]})
            data[i].color = am4core.color(this.colors[0]);
            for(var j = 0; j < this.label.length; j++){
                if(this.label[j][i] == 1){
                    data[i].color = am4core.color(this.colors[j]);
                    break;
                }
            }
        }
        chart.data = data;

        var XAxis = chart.xAxes.push(new am4charts.ValueAxis());
        XAxis.renderer.minGridDistance = 40;

        chart.yAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = "X";
        series.dataFields.valueY = "Y";
        series.strokeWidth = 2;
        series.propertyFields.stroke = "color";

        series.tooltipText = "{valueY.value}";
        series.tooltip.getStrokeFromObject = true;

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        chart.scrollbarX.minHeight = 30;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = XAxis;
        chart.cursor.snapToSeries = series;

        chart.responsive.enabled = true;

        this.chart = chart;
        this.xAxis = XAxis;
    },
    methods: {
        OnModeChange(e){
            this.mode = e.target.innerText;
            if(this.mode == "Edit"){
                this.chart.cursor.behavior = "selectX";
                this.chart.cursor.events.on("selectended", this.handleEditEvent);
            }
            else{
                this.chart.cursor.behavior = "zoomX";
                this.chart.cursor.events.off("selectended", this.handleEditEvent);
            }
        },
        handleEditEvent(e){
            var range = e.target.xRange;
            var axis = this.chart.xAxes.getIndex(0);
            var from = axis.getPositionLabel(axis.toAxisPosition(range.start));
            var to = axis.getPositionLabel(axis.toAxisPosition(range.end));
            console.log("Selected from " + from + "to" + to);


            this.labels[this.colorMode.toLowerCase()].push([Math.ceil(parseFloat(from.replace(/,/g, ''))), Math.floor(parseFloat(to.replace(/,/g, '')))]);

            var label = this.ConvertDicToLabel();
            for(var i = 0; i < this.rawData.length; i++){
                this.chart.data[i].color = am4core.color(this.colors[0]);
                for(var j = 0; j < label.length; j++){
                    if(label[j][i] == 1){
                        this.chart.data[i].color = am4core.color(this.colors[j]);
                        break;
                    }
                }
            }
            this.chart.invalidateRawData();
        },
        OnColorChange(e){
            this.colorMode = e.target.innerText;
        },
        ConvertDicToLabel(){
            var p_table = this.labels["p"];
            var qrs_table = this.labels["qrs"];
            var t_table = this.labels["t"];
            var label = [];
            var i, j;
            for(i = 0; i < 4; i++){
                label.push((new Array(this.rawData.length).fill(0)));
            }
            for(i = 0; i < p_table.length; i++){
                for(j = p_table[i][0]; j < p_table[i][1]; j++){
                    label[1][j] = 1;
                }
            }
            for(i = 0; i < qrs_table.length; i++){
                for(j = qrs_table[i][0]; j < qrs_table[i][1]; j++){
                    label[2][j] = 1;
                }
            }
            for(i = 0; i < t_table.length; i++){
                for(j = t_table[i][0]; j < t_table[i][1]; j++){
                    label[3][j] = 1;
                }
            }
            return label;
        },
        OnDownloadClick(){
            this.blob = new Blob([JSON.stringify(this.labels)], {type: "application/json"});
            this.url = window.URL.createObjectURL(this.blob);
            var a = document.createElement('a');
            a.href = this.url;
            a.download = 'label.json';
            a.click();
        }
    },

}
</script>
<style scoped>
.chart {
  width: 100%;
  height: 70vh;
}
</style>