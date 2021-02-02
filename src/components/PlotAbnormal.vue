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
    names: "PlotAbnormal",
    props: ['rawData', 'label'],
    data() {
        return {
            colors: ["black", "red", "green", "blue"],
        }
    },
    mounted(){
        var chart = am4core.create(this.$refs.chart, am4charts.XYChart);
        chart.paddingRight = 20;

        var data = [{
            "method": "ECG",
            "score": this.label[0] - 0.5,
            "tooltip": this.label[0] - 0.5 > 0 ? "abnormal" : "normal",
        },{
            "method": "PCG",
            "score": this.label[1] - 0.5,
            "tooltip": this.label[1] - 0.5 > 0 ? "abnormal" : "normal",
        },{
            "method": "Both",
            "score": this.label[2] - 0.5,
            "tooltip": this.label[2] - 0.5 > 0 ? "abnormal" : "normal",
        }];

        chart.data = data;
        chart.leftAxesContainer.layout = "vertical";

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "method";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = -0.5;
        valueAxis.max = 0.5;
        valueAxis.strictMinMax = true;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "score";
        series.dataFields.categoryX = "method";
        series.columns.template.tooltipText = "{tooltip}: {score}";
        series.columns.template.fillOpacity = 0.8;

        series.columns.template.adapter.add("fill", function(fill, target) {
            if(target.dataItem && (target.dataItem.valueY > 0)){
                return am4core.color("#f71111")
            }
            else return fill;
        })

        chart.responsive.enabled = true;

        this.chart = chart;
    },

}
</script>
<style scoped>
.chart {
  width: 100%;
  height: 50vh;
}
</style>
