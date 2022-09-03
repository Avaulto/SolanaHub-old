import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DataAggregatorService } from 'src/app/services/data-aggregator.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('lineChart') lineChart
  lines: any;
  colorArray: any;
  constructor(private dataAggregator: DataAggregatorService) { }

  ngAfterViewInit(): void {
    this.dataAggregator.getCoinChartHistory('solana','usd',30).subscribe(chartHistory =>{
      this.createLineChart(chartHistory[0], chartHistory[1]);
    })
  }
  onChangeDate(event){
    this.lines.destroy()
    this.dataAggregator.getCoinChartHistory('solana','usd',event.detail.value).subscribe(chartHistory =>{
      this.createLineChart(chartHistory[0], chartHistory[1]);
    })
  }
  createLineChart(labels, data) {
    this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      options:{
        plugins:{
          legend:{
            display: false
          }
        }
      },
      data: {
        
        labels,
        datasets: [{
          pointBackgroundColor:'white',
          pointRadius:0,
          // label: 'Viewers in millions',
          fill:true,
          data,
          backgroundColor: 'rgb(12 218 196 / 20%)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(0, 0, 0)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      // options: {
      //   scales: {
      //     yAxes: [{
      //       ticks: {
      //         beginAtZero: true
      //       }
      //     }]
      //   }
      // }
    });
  }
}
