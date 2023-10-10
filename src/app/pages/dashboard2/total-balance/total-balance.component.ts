import { Component, ElementRef, Input, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

import { PortfolioElementMultiple } from '@sonarwatch/portfolio-core';
import { CurrencyPipe } from '@angular/common';
import { UtilsService } from 'src/app/services';

@Component({
  providers: [CurrencyPipe],
  selector: 'app-total-balance',
  templateUrl: './total-balance.component.html',
  styleUrls: ['./total-balance.component.scss'],
})
export class TotalBalanceComponent implements OnInit {
  public menu: string[] = ['asset', 'group'];
  public currentTab: string = this.menu[0]
  @Input('portfolio') portfolio: PortfolioElementMultiple[] = null;
  private currencyPipe:CurrencyPipe
  @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef;
  chartData: any;
  public totalBalanceUsd: number = 0
  constructor(private _utilsService:UtilsService) { }

  ngOnInit() {

  }

  ngOnChanges(changes): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.portfolio) {

      this.createGroupCategory()
      this.totalBalanceUsd = this.portfolio.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
      // (group => group.label === 'Wallet')
    }
  }

  changeBreakDown(event) {
    this.currentTab = event
    if (this.currentTab === 'asset') {
      this.createTokenChart()
    }
    if (this.currentTab === 'group') {
      this.createGroupCategory()
    }
  }
  private createGroupCategory() {

    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart.nativeElement
    const filterPortfolioLowValue = this.portfolio.filter(group=>group.value > 1)
    const groupNames = filterPortfolioLowValue.map((group) => group.platformId)
    const groupValue = filterPortfolioLowValue.map((group: any) => group.value)

    const randomColors = groupNames.map(names => {
      const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
      const r = randomBetween(0, 255);
      const g = randomBetween(0, 255);
      const b = randomBetween(0, 255);
      const rgb = `rgb(${r},${g},${b})`;

      return rgb
    })
    const config2: ChartConfiguration = {
      type: 'doughnut',

      data: {
        labels: groupNames,
        datasets: [{
          // label: '',
          data: groupValue,
          backgroundColor: randomColors,
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          legend: {
            position: "left",
            align: "center"
          },
          tooltip: {
            callbacks: {
              label: (d) => {
                const total: number | any = d.dataset.data.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
                const percentage = `$${this._utilsService.numFormater(Number(d.raw))} (${(Number(d.raw) / total * 100).toFixedNoRounding(2)}%)`
                return percentage
              },
            },
          },
        },

        responsive: true,
        maintainAspectRatio: false,

      }
    }

    this.chartData = new Chart(chartEl, config2)
  }
  private createTokenChart() {
    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart.nativeElement
    const tokensBreakdown = this.portfolio.map(assets => assets.data)//.map((asset) => asset.data).map((asset: any) => asset.symbol)
    // const tokensNames = tokensBreakdown.map((asset) => asset.data).map((asset: any) => asset.symbol)
    // const tokensValue = tokensBreakdown.map((asset: any) => asset.value)
    console.log(tokensBreakdown);
    const config2: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['tokensNames'],
        datasets: [{
          // label: '',
          data: [1],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(55, 15, 86)',
            'rgb(154, 62, 135)',
            'rgb(254, 12, 35)',
          ],
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          legend: {
            position: "left",
            align: "center"
          },
          tooltip: {
            callbacks: {
              label: (d) => {
                const total: number | any = d.dataset.data.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
                console.log(d, total)
                const percentage = `$${Number(d.raw).toFixedNoRounding(2)} (${(Number(d.raw) / total * 100).toFixedNoRounding(2)}%)`

                return percentage
              },
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,

      }
    }

    this.chartData = new Chart(chartEl, config2)

  }
}
