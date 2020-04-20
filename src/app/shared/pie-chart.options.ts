import * as Highcharts from 'highcharts';

export class PieChartOptions {
  chartOptions: Highcharts.Options = {
    chart: {
     
      backgroundColor: 'rgba(0,0,0,0)',
      type: 'pie'
    },
    plotOptions: {
      pie: {
        innerSize: 70,
        
      },
      column: {
        dataLabels: {
          enabled: true,
          crop: false,
        },
      },
    },
    title: {
      text: '',
    },
    legend: {
      enabled: false,
    },
    subtitle: {
      text: '',
    },
    xAxis: {
      type: 'category',
      lineWidth: 0,
      minorGridLineWidth: 0,
      labels: {
        style: {
          color: 'white',
        },
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: true,
        style: {
          color: 'white',
        },
      },
      grid: {
        enabled: false,
      },
    },
    tooltip: {},
    series: [],
    credits: {
      enabled: false,
    },
  };
}
