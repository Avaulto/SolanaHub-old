import { Component, ElementRef, Input, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

import { PortfolioElementMultiple } from '@sonarwatch/portfolio-core';
import { CurrencyPipe } from '@angular/common';
import { UtilsService } from 'src/app/services';
import { PopoverController } from '@ionic/angular';
import { ReceivePopupComponent } from './receive-popup/receive-popup.component';

@Component({
  providers: [CurrencyPipe],
  selector: 'app-total-balance',
  templateUrl: './total-balance.component.html',
  styleUrls: ['./total-balance.component.scss'],
})
export class TotalBalanceComponent implements OnInit {
  @Input('portfolio') portfolio: PortfolioElementMultiple[] = null;
  private currencyPipe: CurrencyPipe
  @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef;
  chartData: any;
  public totalBalanceUsd: number = 0
  constructor(
    private _popoverController: PopoverController,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.portfolio) {

      this.createGroupCategory()
      this.totalBalanceUsd = this.portfolio.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);

    }
  }


  private createGroupCategory() {

    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart.nativeElement
    const filterPortfolioLowValue = this.portfolio.filter(group => group.value > 1)
    const groupNames = filterPortfolioLowValue.map((group) => group.platformId)
    const groupValue = filterPortfolioLowValue.map((group: any) => group.value)


    const randomColors = groupNames.map(name => {
      const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
      const r = randomBetween(0, 255);
      const g = randomBetween(0, 255);
      const b = randomBetween(0, 255);
      const rgb = `rgb(${r},${g},${b})`;


      let bgColor;

      console.log(name)
      switch (name) {
        case 'wallet-tokens':
          bgColor = '#13CFC6'
          break;
        case 'wallet-nfts':
          bgColor = '#FE5B94'
          break;
        case 'native-stake':
          bgColor = '#395DF0'
          break;
        case 'solend':
          bgColor = '#ff5b28'
          break;
        case 'orca':
          bgColor = '#ffd25c'
          break;
        case 'meteora':
          bgColor = '#ff536a'

          break;
        case 'marginfi':
          bgColor = '#0f1111'
          break;
        case 'raydium':
          bgColor = '#1f2d67'
        default:
          bgColor = rgb
          break;
      }

      return bgColor
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
  async openReceivePopup() {
    const popover = await this._popoverController.create({
      component: ReceivePopupComponent,
      alignment: 'start',
      backdropDismiss: true,
      cssClass: 'receive-assets-popup',
    });

    await popover.present();
  }
}
