import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('lineChart') lineChart
  lines: any;
  colorArray: any;
  constructor() { }

  ngAfterViewInit(): void {
    this.createLineChart();
  }
  createLineChart() {
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
        
        labels: ['01/01/21', '04/01/21', '06/01/21', '07/01/21', '08/01/21', '23/01/21', '25/01/21', '28/01/21'],
        datasets: [{
          pointBackgroundColor:'white',
          pointRadius:0,
          // label: 'Viewers in millions',
          fill:true,
          data: [5000, 3000, 5341, 6139, 6009, 7115, 4233, 5000, 3426],
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
