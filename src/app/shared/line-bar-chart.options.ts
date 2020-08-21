import * as Highcharts from 'highcharts';

export class LineBarChartOptions {
  chartOptions: Highcharts.Options = {
    navigator: {
        enabled: true
    },
    chart: {
      renderTo: 'container',
      backgroundColor: 'rgba(0,0,0,0)',
      type: 'spline',
    },
    plotOptions: {
      series: {
        lineWidth: 4
      },
      column: {
        dataLabels: {
            enabled: false,
            crop: false,
        }
    }
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
          color: 'white'
        }
      }
    },
    yAxis: {
      
      title: {
        text: null,
      },
      labels: {
        enabled: true,
        style: {
          color: 'white'
        }
      },
      grid: {
        enabled: false,
      },
    },
    tooltip: {
      shared: true
    },
    series: [],
    credits: {
      enabled: false,
    },
  };
}
