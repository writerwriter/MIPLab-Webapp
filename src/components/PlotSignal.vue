<template>
<div>
    <div class="chart" ref="chart"></div>
</div>
</template>
<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
export default {
    names: "PlotSignal",
    props: ['rawData', 'label'],
    data() {
        return {
            colors: ["black", "red", "green", "blue"],
        }
    },
    watch: {
        rawData: function(){        
            console.log("test");
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
            this.chart.data = data;
            this.chart.invalidateRawData();
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

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        chart.scrollbarX.minHeight = 30;

        chart.responsive.enabled = true;

        this.chart = chart;
    },
    methods:{

    },

}
</script>
<style scoped>
.chart {
  width: 100%;
  height: 70vh;
}
</style>