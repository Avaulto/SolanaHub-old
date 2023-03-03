import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { faPlugCircleExclamation, faPlugCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Chart  from 'chart.js/auto';
import { firstValueFrom } from 'rxjs';
import { UtilsService } from 'src/app/services';
import { DataAggregatorService } from 'src/app/services/data-aggregator.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnChanges {
  @ViewChild('lineChart') lineChart: ElementRef;
  @Input() pairOne: string = ''
  @Input() pairTwo: string = '';
  chartDuration = "1";
  currentPricePair: number;
  lines: any;
  colorArray: any;
  public chartUnavailableIcon = faPlugCircleXmark
  public hasPairData: boolean = true;
  constructor(private dataAggregator: DataAggregatorService, private utilsService:UtilsService) { }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.getChartData()
  }

  public onChangeDate(event) {
    this.chartDuration = event.detail.value
    this.getChartData();
  }
  private async getChartData() {
    this.lines ? this.lines.destroy() : null
    try {
      let chartDataOne, chartDataTwo;
      
      // get chart data & remove nulls
      chartDataOne = await firstValueFrom(this.dataAggregator.getCoinChartHistory(this.pairOne, 'usd', this.chartDuration))
      chartDataTwo = await firstValueFrom(this.dataAggregator.getCoinChartHistory(this.pairTwo, 'usd', this.chartDuration))

         const sortedPriceChart = chartDataOne[1].filter(n => n);
         const sortedChartDataTwo = chartDataTwo[1].filter(n => n);

        const ratio = sortedPriceChart.map((item,i) => item / sortedChartDataTwo[i]).filter(n => n);;
         this.currentPricePair =  this.utilsService.shortenNum(ratio[ratio.length - 1])
         this.createLineChart(chartDataOne[0],ratio);
    } catch (error) {
      this.hasPairData = false
      console.warn(error)
    }
    // .subscribe({
    //   next: chartHistory => {
    //     this.hasPairData = true;
    //     this.createLineChart(chartHistory[0], chartHistory[1]);
    //   },
    //   error: err => {
    //     this.hasPairData = false;
    //     console.error(err);
    //   }
    // })

    // this.dataAggregator.getCoinChartHistory(pairOne, 'usd', duration)
    // .subscribe({
    //   next: chartHistory => {
    //     this.hasPairData = true;
    //     this.createLineChart(chartHistory[0], chartHistory[1]);
    //   },
    //   error: err => {
    //     this.hasPairData = false;
    //     console.error(err);
    //   }
    // })
  }
  private createLineChart(labels, data) {
    this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      },
      data: {

        labels,
        datasets: [{
          pointBackgroundColor: 'white',
          pointRadius: 0,
          // label: 'Viewers in millions',
          fill: true,
          data,
          backgroundColor: 'rgb(12 218 196 / 20%)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(0, 0, 0)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
    });
  }
}
