<template>
    <div>
        <div class='chart' ref='chart'></div>
    </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import Gradient from "javascript-color-gradient";
import * as math from "mathjs";

export default {
    names: "PlotHazard",
    props: ['data', 'type'],
    mounted(){
        var chart = am4core.create(this.$refs.chart, am4charts.XYChart);
        var train = [];
        var X_min = this.data['label'], X_max = this.data['label'];
        for(var i = 0; i < this.data['ypred'].length; i++){
            train.push({X: this.data['ypred'][i][0], Y: this.data['st'][i]});
            if(this.data['ypred'][i][0] > X_max) X_max = this.data['ypred'][i][0];
            if(this.data['ypred'][i][0] < X_min) X_min = this.data['ypred'][i][0];
            train[i].color = am4core.color(this.data['cs'][i] == 0 ? 'grey' : '#ff7b1c');
            train[i].opacity = this.data['cs'][i] == 0 ? 0.5 : 0.8;
        }
        chart.data = train;

        var XAxis = chart.xAxes.push(new am4charts.ValueAxis());
        XAxis.min = X_min;
        XAxis.max = X_max;
        XAxis.title.text = this.type=='readmit' ? 'predicted readmission time' : 'predicted event time';
        XAxis.renderer.labels.template.opacity = 0.5;

        var line = XAxis.axisRanges.create();
        line.value = this.data['label'];
        const colorGradient = new Gradient();
        colorGradient.setGradient('#ff0000', '#0000ff');
        var startPoint = 5; math.median(this.data['ypred']) - 2 * math.std(this.data['ypred'])
        var range = 4 * math.std(this.data['ypred']);
        line.grid.stroke = am4core.color(colorGradient.getColor(Math.max(1, Math.min(colorGradient.getArray().length, Math.floor(((this.data['label']-startPoint) / range) * colorGradient.getArray().length)+1))));
        line.grid.strokeWidth = 2;
        line.grid.strokeOpacity = 1;
        line.grid.above = true;
        line.label.text = (Math.round(this.data['label'] * 100)/100).toString();
        line.label.verticalCenter = "bottom";
        line.label.opacity = 1;
        line.label.fontWeight = "bold";
        line.label.fill = am4core.color(colorGradient.getColor(Math.max(1, Math.min(colorGradient.getArray().length, Math.floor(((this.data['label']-startPoint) / range) * colorGradient.getArray().length)+1))));

        var YAxis = chart.yAxes.push(new am4charts.ValueAxis());
        YAxis.title.text = 'event time (days)';

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = 'X';
        series.dataFields.valueY = 'Y';
        series.strokeOpacity = 0;
        series.data = train;
        var circle = series.bullets.push(new am4core.Circle());
        circle.propertyFields.fill = 'color';
        circle.propertyFields.fillOpacity = 'opacity';
        circle.horizontalCenter = 'middle';
        circle.verticalCenter = 'middle';
        circle.strokeWidth = 0;
        circle.radius = 1.5;
        circle.tooltipText = "X: [bold]{X}[/]\nY: [bold]{Y}[/]\n"

        chart.responsive.enabled = true;
        chart.responsive.useDefault = false;

        this.chart = chart;
    }
}
</script>

<style scoped>
.chart {
    width: 100%;
    aspect-ratio: 16/8;
}
</style>