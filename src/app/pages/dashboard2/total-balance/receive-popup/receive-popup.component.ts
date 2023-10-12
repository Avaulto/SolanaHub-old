import { Component, OnInit } from '@angular/core';
import QRCodeStyling from 'qr-code-styling';
import { SolanaUtilsService } from 'src/app/services';

@Component({
  selector: 'app-receive-popup',
  templateUrl: './receive-popup.component.html',
  styleUrls: ['./receive-popup.component.scss'],
})
export class ReceivePopupComponent implements OnInit {

  constructor(public solanaUtilsService: SolanaUtilsService) { }

  ngOnInit() {
    this.appendQr()
  }

  appendQr() {
    const qrCode = new QRCodeStyling({
      width: 350,
      height: 350,
      type: "svg",
      data: this.solanaUtilsService.getCurrentWallet().publicKey.toBase58(),
      image: 'assets/images/icons/solanahub-icon.svg',
      dotsOptions: {
        gradient: {
          type: 'linear',
          colorStops: [
            {
              offset: 0.5,
              color: "#FF845A"
            },
            {
              offset: 1,
              color: "#FD49AD"
            }
          ],
        },

        type: "rounded"
      },
      backgroundOptions: {
        color: "transparent",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
      }
    });

    qrCode.append(document.getElementById("canvas"));

  }
}
