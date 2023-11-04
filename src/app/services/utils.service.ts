import { DecimalPipe, DOCUMENT } from "@angular/common";
import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Params } from "@angular/router";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { PriorityFee } from "../models/priorityFee.model";
import { LocalStorageService } from "./local-storage.servic";
// import * as moment from "moment";
// import { v4 as uuidv4 } from "uuid";


declare global {
  interface Date {
    addDays(): Function;
  }
  interface Number {
    toFixedNoRounding: Function;
  }
}
Number.prototype.toFixedNoRounding = function (n) {
  const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
  const a = this.toString().match(reg)[0];
  const dot = a.indexOf(".");
  if (dot === -1) { // integer, insert decimal dot and pad up zeros
    return a + "." + "0".repeat(n);
  }
  const b = n - (a.length - dot) + 1;
  return b > 0 ? (a + "0".repeat(b)) : a;
}

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor(private factory: RendererFactory2, 
    private _decimalPipe: DecimalPipe,
    @Inject(DOCUMENT) private document: Document, 
    private localStore: LocalStorageService) {
    this.renderer = this.factory.createRenderer(null, null);
    this.changeTheme(this._systemTheme.value);
  }
  public serverlessAPI = location.hostname === "localhost" ? 'http://localhost:3000' : 'https://api.SolanaHub.app'
  private renderer: Renderer2;
  private _systemPair = new BehaviorSubject<string>('USD' as string);
  private _systemExplorer = new BehaviorSubject<string>(this.localStore.getData('explorer') || 'https://solana.fm' as string);
  private _systemTheme = new BehaviorSubject<string>(this.localStore.getData('theme') || 'dark' as string);

  private _PriorityFee = PriorityFee.None;

  public explorer$ = this._systemExplorer.asObservable();
  public systemTheme$ = this._systemTheme.asObservable();

  public updateSystemPair(pair: string): void {
    this.localStore.saveData('pair', pair);
    this._systemPair.next(pair);
  }


  public get priorityFee(): PriorityFee {
    return this._PriorityFee;
  }


  public set priorityFee(v: PriorityFee) {
    this._PriorityFee = v;
  }

  public changeTheme(name: string) {
    this.localStore.saveData('theme', name);
    this._systemTheme.next(name);
    if (name.toLocaleLowerCase() == 'light') {
      this.enableLightTheme()
    } else {
      this.enableDarkTheme();
    }
  }
  public toLower(params: Params): Params {
    const lowerParams: Params = {};
    for (const key in params) {
      lowerParams[key.toLowerCase()] = params[key];
    }

    return lowerParams;
  }
  public formatBigNumbers = n => {
    if (n < 1e3) return this._decimalPipe.transform(n, '1.2-2');
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
  };
  public enableLightTheme() {
    this.renderer.addClass(this.document.body, 'light-theme');
  }
  public enableDarkTheme() {
    this.renderer.removeClass(this.document.body, 'light-theme');
  }
  public changeExplorer(name: string) {
    this.localStore.saveData('explorer', name);
    this._systemExplorer.next(name);
  }
  get explorer() {
    return this._systemExplorer.value;
  }
  public addrUtil(addr: string): { addr: string, addrShort: string } {
    return { addr, addrShort: addr?.substring(0, 4) + '...' + addr.substring(addr.length - 4, addr.length[addr.length]) }
  }
  public calcPair() {
    this._systemPair.value
  }
  public getBlockchainAssets(addr: string) {
    let assets = {};
  }
  public shortenNum(number, aftetDot = 3): number {
    if (number) {
      return Number(number).toFixedNoRounding(aftetDot)
    } else {
      return 0
    }

  }
  public sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))
  public numFormater(number: number): any {
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number)
  }
  isNotNull = <T>(source: Observable<T | null>) => source.pipe(filter((item: T | null): item is T => item !== null));
  isNotUndefined = <T>(source: Observable<T | null>) => source.pipe(filter((item: T | null): item is T => item !== undefined));
}
