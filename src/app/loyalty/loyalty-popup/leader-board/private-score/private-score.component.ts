import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { WalletExtended } from 'src/app/models';
import { LoyaltyPoint } from 'src/app/models/loyalty.model';
import Chart, { ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-private-score',
  templateUrl: './private-score.component.html',
  styleUrls: ['./private-score.component.scss'],
})
export class PrivateScoreComponent implements OnInit {
  @Input() wallet: WalletExtended;
  @Input() leaderBoard: LoyaltyPoint[]
  @Input() totalRebates: number = 0;
  public myLoyaltyScore: LoyaltyPoint = null;
  @ViewChild('barChart',{static:true}) barChart: ElementRef;

  chartData: any;
  constructor(

  ) { }

  ngOnInit() {
    this.myLoyaltyScore = this.leaderBoard.filter(staker => staker.walletOwner === this.wallet.publicKey.toBase58())[0] || null

    this.createBarChart();
  }


  private createBarChart() {
    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.barChart.nativeElement

    const config2: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Personal score'],
        datasets: [{
          label: 'Native stake + Account aging',
          backgroundColor: '#13CFC6',
          data: [this.myLoyaltyScore?.pointsBreakDown?.nativeStakePts || 0],

        }
          , {
          label: 'Liquid stake',
          backgroundColor: '#395DF0',
          data: [this.myLoyaltyScore?.pointsBreakDown?.mSOLpts + this.myLoyaltyScore?.pointsBreakDown?.bSOLpts || 0],
        }, {
          label: 'DAO votes',
          backgroundColor: '#FE5B94',
          data: [this.myLoyaltyScore?.pointsBreakDown?.veMNDEpts],
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          easing: 'easeInOutQuad',
          duration: 1000
        },

        plugins: {
          tooltip: {

            padding: 10,
            callbacks: {
              title: () => ''
            }
          }
        },


        scales: {
          x: {

            stacked: true,
          },
          y: {
            stacked: true
          }
        },
        indexAxis: 'y',

      }
    }

    this.chartData = new Chart(chartEl, config2)

  }
}
