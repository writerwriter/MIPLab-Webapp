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
    props: ['rawData', 'label', 'label2', 'type'],
    data(){
        return {
            colors: ["black", "#47e0ff", "#ffaf38", "#f71111", "black", "blue", "red", "green"],
        }
    },
    mounted(){
        var chart = am4core.create(this.$refs.chart, am4charts.XYChart);
        chart.paddingRight = 20;

        var data = [];
        for(var i = 0; i < this.rawData.length; i++){
            data.push({X: i, Y: this.rawData[i]});
            data[i].color = am4core.color(this.colors[0]);
            /*
            change color based on label format
            */
            if(this.type == 'PQRST' || this.type == 'PQRST&&Arrhythmia'){
                for(var j = 0; j < this.label.length; j++){
                    if(this.label[j][i] == 1){
                        data[i].color = am4core.color(this.colors[j+4]);
                        break;
                    }
                }
            }
            else if(this.type == 'S1S2'){
                data[i].Y_label = this.label[i];
                data[i].color = am4core.color(this.colors[0]);
                data[i].color_label = am4core.color(this.colors[6]);
            }
        }
        chart.data = data;

        var XAxis = chart.xAxes.push(new am4charts.ValueAxis());
        XAxis.renderer.minGridDistance = 40;

        chart.yAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = 'X';
        series.dataFields.valueY = 'Y';
        series.strokeWidth = 2;
        series.propertyFields.stroke = 'color';
        series.tooltipText = '{valueY.value}';
        series.tooltip.getStrokeFromObject = true;
        series.data = data;

        if(this.type == 'Arrhythmia' || this.type == 'PQRST&&Arrhythmia'){
            var label_data = []
            for(i = 0; i < this.label2.length; i++){
                label_data.push({
                    X: this.label2[i][0], 
                    Y: Math.max(...this.rawData) * 1.5 + 20, 
                    color: am4core.color(this.colors[this.label2[i][1]+1])});
                switch(this.label2[i][1]){
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
        }

        else if(this.type == 'S1S2'){
            label_data = [];
            for(i = 0; i < this.label[0].length; i++){
                label_data.push({
                    X: this.label[0][i],
                    Y: Math.max(...this.rawData) * 1.5,
                    color: am4core.color(this.colors[1])});
                label_data[i].label = '1';
            }
            for(i = 0; i < this.label[1].length; i++){
                label_data.push({
                    X: this.label[1][i],
                    Y: Math.max(...this.rawData) * 1.5,
                    color: am4core.color(this.colors[2])});
                label_data[i+this.label[0].length].label = '2';
            }

            if(label_data.length != 0){
                series2 = chart.series.push(new am4charts.LineSeries());
                series2.dataFields.valueX = 'X';
                series2.dataFields.valueY = 'Y';
                series2.strokeOpacity = 0;
                series2.data = label_data;

                bullet = series2.bullets.push(new am4charts.Bullet());
                bullet.propertyFields.fill = 'color';

                arrow = bullet.createChild(am4core.Triangle);
                arrow.opacity = 0.8;
                arrow.horizontalCenter = "middle";
                //arrow.verticalCenter = "middle";
                arrow.direction = "bottom";
                arrow.strokeWidth = 0;
                arrow.width = 25;
                arrow.height = 35;

                labelBullet = series2.bullets.push(new am4charts.LabelBullet());
                labelBullet.label.text = "{label}";
                labelBullet.label.dy = 15;
                labelBullet.label.fontSize = 13;
                labelBullet.label.fill = am4core.color("white");
            }
            
        }

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        chart.scrollbarX.minHeight = 30;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = XAxis;

        chart.responsive.enabled = true;

        this.chart = chart;
        this.xAxis = XAxis;
    }
}
</script>

<style scoped>
.chart {
    width: 100%;
    height: 40vh;
}
</style>