import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { getCssValues } from 'utils/css';

@Component({
  selector: 'app-sentiment-graph',
  imports: [BaseChartDirective],
  templateUrl: './sentiment-graph.html',
  styleUrl: './sentiment-graph.scss',
})
export class SentimentGraph {
  public barChartPlugins = [];
  backgroundColor = getCssValues([
    '--color-light-blue',
    '--color-light-yellow',
    '--color-light-red',
  ]);

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Satisfied', 'Neutral', 'Dissatisfied'],
    datasets: [
      {
        data: [45, 20, 60],
        label: 'Sentiment Count',
        backgroundColor: this.backgroundColor,
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          pointStyle: 'line',
        },
        onClick: () => {
          return;
        },
      },
    },
  };
}
