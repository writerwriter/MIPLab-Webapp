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
    props: ['rawData'],
    data() {
        return {
            colors: ["black", "red", "green", "blue"],
        }
    },
    watch: {
        rawData: function(){
            var colors = [am4core.color("#FF0000"),am4core.color("#FF3d66"),am4core.color("#FF75AD"),
                        am4core.color("#FFa6e0"),am4core.color("#F8D1FC"),am4core.color("#EDCDFD"),
                        am4core.color("#E0CAFE"),am4core.color("#D2C7FF"),am4core.color("#B19DFF"),
                        am4core.color("#8D73FF"),am4core.color("#6147FF"),am4core.color("#0000FF")]

            var data = [];

            var max = Math.max(...this.rawData[0]);
            var min = Math.min(...this.rawData[0]);
            var interval = (max - min) / 12;

            for(var i = 0; i < this.rawData[0].length; i++){
                data.push({X: i ,Y1: this.rawData[0][i], color1: colors[Math.floor((this.rawData[0][i] - min) / interval)], Y2: this.rawData[1][i], color2: colors[Math.floor((this.rawData[1][i] - min) / interval)]})
            }
            this.chart.data = data;
            this.chart.invalidateRawData();
        }
    },
    mounted(){
        var chart = am4core.create(this.$refs.chart, am4charts.XYChart);
        chart.paddingRight = 20;
        
        var colors = [am4core.color("#FF0000"),am4core.color("#FF3d66"),am4core.color("#FF75AD"),
                    am4core.color("#FFa6e0"),am4core.color("#F8D1FC"),am4core.color("#EDCDFD"),
                    am4core.color("#E0CAFE"),am4core.color("#D2C7FF"),am4core.color("#B19DFF"),
                    am4core.color("#8D73FF"),am4core.color("#6147FF"),am4core.color("#0000FF")]

        var data = [];

        var max = Math.max(...this.rawData[0]);
        var min = Math.min(...this.rawData[0]);
        var interval = (max - min) / 12;

        for(var i = 0; i < this.rawData[0].length; i++){
            data.push({X: i ,Y1: this.rawData[0][i], color1: colors[Math.floor((this.rawData[0][i] - min) / interval)], Y2: this.rawData[1][i], color2: colors[Math.floor((this.rawData[1][i] - min) / interval)]})
        }
        chart.data = data;
        chart.leftAxesContainer.layout = "vertical";

        var XAxis = chart.xAxes.push(new am4charts.ValueAxis());
        XAxis.renderer.grid.template.disabled = true;
        XAxis.renderer.ticks.template.disabled = false;

        var Y1Axis = chart.yAxes.push(new am4charts.ValueAxis());
        Y1Axis.height = am4core.percent(40);
        Y1Axis.zIndex = 1;
        Y1Axis.renderer.labels.template.verticalCenter = "bottom";

        var Y2Axis = chart.yAxes.push(new am4charts.ValueAxis());
        Y2Axis.marginTop = 30;
        Y2Axis.height = am4core.percent(40);
        Y2Axis.zIndex = 3;
        Y2Axis.renderer.labels.template.verticalCenter = "bottom";

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = "X";
        series.dataFields.valueY = "Y1";
        series.propertyFields.stroke = "color1";
        series.yAxis = Y1Axis;
        series.strokeWidth = 2;
        series.name = "first";
        series.tooltip.getStrokeFromObject = true;

        series.tooltipText = "{valueY.value}";

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.valueX = "X";
        series2.dataFields.valueY = "Y2";
        series2.propertyFields.stroke = "color2";
        series2.yAxis = Y2Axis;
        series2.strokeWidth = 2;
        series2.name = "second";
        series2.tooltip.getStrokeFromObject = true;

        series2.tooltipText = "{valueY.value}";

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        chart.scrollbarX.minHeight = 30;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = XAxis;
        chart.cursor.snapToSeries = [series, series2];

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