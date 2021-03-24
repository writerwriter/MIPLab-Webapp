<template>
    <div>
        <div class='chart' ref='chart'></div>
    </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

export default {
    names: "PlotSignal",
    props: ['ECG', 'PCG', 'label_ECG', 'label_Arr', 'label_PCG'],
    data(){
        return {
            colors: ["black", "#47e0ff", "#ffaf38", "#f71111", "black", "#47e0ff", "red", "green"],
        }
    },
    mounted(){
        var chart = am4core.create(this.$refs.chart, am4charts.XYChart);
        chart.paddingRight = 20;
        chart.leftAxesContainer.layout = "vertical";

        var data = [];
        for(var i = 0; i < this.ECG.length; i++){
            data.push({X: i, ECG: this.ECG[i], PCG: this.PCG[i]});

            data[i].color_ECG = am4core.color(this.colors[0]);
            data[i].color_PCG = am4core.color(this.colors[0]);

            for(var j = 0; j < this.label_ECG.length; j++){
                if(this.label_ECG[j][i] == 1){
                    data[i].color_ECG = am4core.color(this.colors[j+4]);
                    break;
                }
            }
        }
        chart.data = data;

        var XAxis = chart.xAxes.push(new am4charts.ValueAxis());
        XAxis.renderer.minGridDistance = 40;
        XAxis.renderer.ticks.template.disabled = false;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.height = am4core.percent(50);
        valueAxis.max = Math.max(...this.ECG) * 1.75

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = 'X';
        series.dataFields.valueY = 'ECG';
        series.strokeWidth = 2;
        series.propertyFields.stroke = 'color_ECG';
        series.tooltipText = '{valueY.value}';
        series.tooltip.getStrokeFromObject = true;
        series.data = data;

        //this is for arrhythmia labeling
        var label_data = []
        for(i = 0; i < this.label_Arr.length; i++){
            label_data.push({
                X: this.label_Arr[i][0], 
                Y: Math.max(...this.ECG) * 1.5, 
                color: am4core.color(this.colors[this.label_Arr[i][1]+1])});
            switch(this.label_Arr[i][1]){
                case 0: label_data[i].label = 'N'; break;
                case 1: label_data[i].label = 'S'; break;
                case 2: label_data[i].label = 'V'; break;
                case 3: label_data[i].label = 'Other'; break;
            }
        }
        if(label_data.length != 0){
            var series2 = chart.series.push(new am4charts.LineSeries());
            series2.dataFields.valueX = 'X';
            series2.dataFields.valueY = 'Y';
            series2.strokeOpacity = 0;
            series2.data = label_data;
            var bullet = series2.bullets.push(new am4charts.Bullet());
            bullet.propertyFields.fill = 'color';
            var arrow = bullet.createChild(am4core.Triangle);
            arrow.opacity = 0.8;
            arrow.horizontalCenter = "middle";
            arrow.verticalCenter = "middle";
            arrow.direction = "bottom";
            arrow.strokeWidth = 0;
            arrow.width = 25;
            arrow.height = 35;
            var labelBullet = series2.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{label}";
            labelBullet.label.dy = -5;
            labelBullet.label.fontSize = 13;
            labelBullet.label.fill = am4core.color("white");
        }

        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.height = am4core.percent(50);
        valueAxis2.marginTop = 20;
        valueAxis2.max = Math.max(...this.PCG) * 1.75

        var series3 = chart.series.push(new am4charts.LineSeries());
        series3.dataFields.valueX = 'X';
        series3.dataFields.valueY = 'PCG';
        series3.yAxis = valueAxis2;
        series3.strokeWidth = 2;
        series3.propertyFields.stroke = 'color_PCG';
        series3.tooltipText = '{valueY.value}';
        series3.tooltip.getStrokeFromObject = true;
        series3.data = data;

        // this is for s1s2 labeling
        var label_data2 = [];
        for(i = 0; i < this.label_PCG[0].length; i++){
            label_data2.push({
                X: this.label_PCG[0][i],
                Y: Math.max(...this.PCG) * 1.5,
                color: am4core.color(this.colors[1])});
            label_data2[i].label = '1';
        }
        for(i = 0; i < this.label_PCG[1].length; i++){
            label_data2.push({
                X: this.label_PCG[1][i],
                Y: Math.max(...this.PCG) * 1.5,
                color: am4core.color(this.colors[2])});
            label_data2[i+this.label_PCG[0].length].label = '2';
        }
        for(i = 0; i < this.label_PCG[2].length; i++){
            label_data2.push({
                X: this.label_PCG[2][i],
                Y: Math.max(...this.PCG) * 1.5,
                color: am4core.color(this.colors[3])});
            label_data2[i+this.label_PCG[0].length+this.label_PCG[1].length].label = 'O';
        }
        

        if(label_data2.length != 0){
            var series4 = chart.series.push(new am4charts.LineSeries());
            series4.dataFields.valueX = 'X';
            series4.dataFields.valueY = 'Y';
            series4.yAxis = valueAxis2;
            series4.strokeOpacity = 0;
            series4.data = label_data2;

            bullet = series4.bullets.push(new am4charts.Bullet());
            bullet.propertyFields.fill = 'color';

            arrow = bullet.createChild(am4core.Triangle);
            arrow.opacity = 0.8;
            arrow.horizontalCenter = "middle";
            //arrow.verticalCenter = "middle";
            arrow.direction = "bottom";
            arrow.strokeWidth = 0;
            arrow.width = 25;
            arrow.height = 35;

            labelBullet = series4.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{label}";
            labelBullet.label.dy = 15;
            labelBullet.label.fontSize = 13;
            labelBullet.label.fill = am4core.color("white");
        }
            

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        chart.scrollbarX.minHeight = 30;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = XAxis;

        let rectangle = chart.plotContainer.createChild(am4core.Rectangle)
        rectangle.fillOpacity = 1;
        rectangle.width = am4core.percent(100);
        rectangle.fill = am4core.color("#ffffff")
        rectangle.isMeasured = false;
        rectangle.height = 19;
        rectangle.zIndex = 1000;

        valueAxis2.events.on("positionchanged", function(){
            rectangle.y = valueAxis2.pixelY - rectangle.pixelHeight - 1;
        })

        chart.responsive.enabled = true;

        this.chart = chart;
        this.xAxis = XAxis;
    }
}
</script>

<style scoped>
.chart {
    width: 100%;
    height: 75vh;
}
</style>