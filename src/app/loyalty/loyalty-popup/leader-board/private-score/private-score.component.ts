import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { WalletExtended } from 'src/app/models';
import { LoyaltyPoint } from 'src/app/models/loyalty.model';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { LoyaltyService } from 'src/app/loyalty/loyalty.service';
import { shareReplay } from 'rxjs';
@Component({
  selector: 'app-private-score',
  templateUrl: './private-score.component.html',
  styleUrls: ['./private-score.component.scss'],
})
export class PrivateScoreComponent implements OnInit, AfterViewInit {
  @Input() wallet: WalletExtended;
  @Input() leaderBoard: LoyaltyPoint[]
  @Input() totalRebates: number = 0;
  public myLoyaltyScore: LoyaltyPoint = null;
  @ViewChild('barChart') barChart: ElementRef;
  public loyaltyScore$ = this._loyaltyService.getLoyaltyScore().pipe(shareReplay())
  chartData: any;
  constructor(private _loyaltyService: LoyaltyService ) { }

  ngOnInit() {

    if (this.wallet && this.leaderBoard) {
      this.myLoyaltyScore = this.leaderBoard.filter(staker => staker.walletOwner === this.wallet.publicKey.toBase58())[0] || null
    }

    try {


    } catch (error) {
      console.log(error)
    }
  }
  ngAfterViewInit(): void {

    this.createBarChart();
  }



  private createBarChart() {
    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.barChart.nativeElement
    const ctx = chartEl.getContext('2d');
    console.log(this.barChart, chartEl, ctx)
    var background_1 = ctx.createLinearGradient(0, 0, 0, 600);
    background_1.addColorStop(0, '#13CFC6');
    background_1.addColorStop(1, '#395DF0');

    var background_2 = ctx?.createLinearGradient(0, 0, 0, 600);
    background_2.addColorStop(0, '#395DF0');
    background_2.addColorStop(1, '#FE5B94');

    var background_3 = ctx?.createLinearGradient(0, 0, 0, 600);
    background_3.addColorStop(0, '#FE5B94');
    background_3.addColorStop(1, '#FE5B94');
    const config2:ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Personal score'],
        datasets: [{
          label: 'Native stake + Account aging',
          backgroundColor: background_1,
          data: [this.myLoyaltyScore?.pointsBreakDown?.nativeStakePts || 0 ],
          
        }
          , {
          label: 'Liquid stake',
          backgroundColor: background_2,
          data: [this.myLoyaltyScore?.pointsBreakDown?.mSOLpts  || 0 + this.myLoyaltyScore?.pointsBreakDown?.bSOLpts || 0],
        }, {
          label: 'DAO votes',
          backgroundColor: background_3,
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
    
            padding:10,
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
    // const config2: any = {
    //   type: 'bar',
    //   data: {
    //     labels: ['Personal score'],
    //     datasets: [{
    //       label: 'Native stake + account aging',
    //       backgroundColor: "#13CFC6",
    //       data: [90],
    //     }, {
    //       label: 'Liquid stake',
    //       backgroundColor: "#395DF0",
    //       data: [82],
    //     }, {
    //       label: 'DAO votes',
    //       backgroundColor: "#FE5B94",
    //       data: [62],
    //     }],
    //     fill: true,
    //   },
    //   options: {
    //     responsive: true,
    //     tooltips: {
    //       displayColors: true,
    //       callbacks: {
    //         mode: 'x',
    //       },
    //     },
    //     scales: {
    //       x: {
    //         stacked: true,
    //       },
    //       y: {
    //         stacked: true
    //       }
    //     },
    //     indexAxis: 'y',
    //     animations: {
    //       tension: {
    //         duration: 750,
    //         easing: 'easeInBounce',
    //         from: 1,
    //         to: 0,
    //         loop: true
    //       }
    //     },
    //   }
    // }

    this.chartData = new Chart(chartEl, config2)

  }
}
