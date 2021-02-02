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
                <b-button variant="danger" :pressed="colorMode=='EMAT'" @click="OnColorChange">EMAT</b-button>
                <b-button variant="success" :pressed="colorMode=='S3'" @click="OnColorChange">S3</b-button>
                <b-button variant="primary" :pressed="colorMode=='S4'" @click="OnColorChange">S4</b-button>
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
    names: "PlotBigExam",
    props: ['rawData'],
    data() {
        return {
            colors: ["black", "red", "green", "blue"],
            mode: "View",
            colorMode: "EMAT",
            labels: {
                "EMAT" : [],
                "S3": [],
                "S4": []
                },
        }
    },
    mounted(){
        var chart = am4core.create(this.$refs.chart, am4charts.XYChart);
        chart.paddingRight = 20;
        
        var data = [];
        for(var i = 0; i < this.rawData[1].length; i++){
            data.push({X: i ,ECG: this.rawData[1][i], PCG: this.rawData[8][i]});
            data[i].color = am4core.color(this.colors[0]);
        }
        chart.data = data;
        chart.leftAxesContainer.layout = "vertical";

        var XAxis = chart.xAxes.push(new am4charts.ValueAxis());
        XAxis.renderer.minGridDistance = 40;

        var yAxes1 = chart.yAxes.push(new am4charts.ValueAxis());
        yAxes1.height = am4core.percent(50);
        yAxes1.zIndex = 1;

        var yAxes2 = chart.yAxes.push(new am4charts.ValueAxis());
        yAxes2.height = am4core.percent(50);
        yAxes2.marginTop = 30;
        yAxes2.zIndex = 3;

        var series1 = chart.series.push(new am4charts.LineSeries());
        series1.dataFields.valueX = "X";
        series1.dataFields.valueY = "ECG";
        series1.yAxis = yAxes1;
        series1.strokeWidth = 2;
        series1.propertyFields.stroke = "color";
        series1.tooltipText = "{valueY.value}";
        series1.tooltip.getStrokeFromObject = true;

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.valueX = "X";
        series2.dataFields.valueY = "PCG";
        series2.yAxis = yAxes2;
        series2.strokeWidth = 2;
        series2.propertyFields.stroke = "color";
        series2.tooltipText = "{valueY.value}";
        series2.tooltip.getStrokeFromObject = true;


        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series1);
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        chart.scrollbarX.minHeight = 30;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = XAxis;
        chart.cursor.snapToSeries = series1;

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


            this.labels[this.colorMode].push([Math.ceil(parseFloat(from.replace(/,/g, ''))), Math.floor(parseFloat(to.replace(/,/g, '')))]);

            var label = this.ConvertDicToLabel();
            for(var i = 0; i < this.rawData[0].length; i++){
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
            var EMAT_table = this.labels["EMAT"];
            var S3_table = this.labels["S3"];
            var S4_table = this.labels["S4"];
            var label = [];
            var i, j;
            for(i = 0; i < 4; i++){
                label.push((new Array(this.rawData.length).fill(0)));
            }
            for(i = 0; i < EMAT_table.length; i++){
                for(j = EMAT_table[i][0]; j < EMAT_table[i][1]; j++){
                    label[1][j] = 1;
                }
            }
            for(i = 0; i < S3_table.length; i++){
                for(j = S3_table[i][0]; j < S3_table[i][1]; j++){
                    label[2][j] = 1;
                }
            }
            for(i = 0; i < S4_table.length; i++){
                for(j = S4_table[i][0]; j < S4_table[i][1]; j++){
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