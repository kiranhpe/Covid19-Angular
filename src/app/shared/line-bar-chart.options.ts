import * as Highcharts from 'highcharts';

export class LineBarChartOptions {
  chartOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      backgroundColor: 'rgba(0,0,0,0)',
      type: 'spline',
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
      lineWidth: 0,
      minorGridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: true,
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
