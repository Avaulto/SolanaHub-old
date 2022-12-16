import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { BehaviorSubject, filter, Observable } from "rxjs";
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
Number.prototype.toFixedNoRounding = function(n) {
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
  constructor(private factory:RendererFactory2, @Inject(DOCUMENT) private document: Document,private localStore: LocalStorageService) {
    this.renderer = this.factory.createRenderer(null,null);
    this.changeTheme(this._systemTheme);
  }
  private renderer: Renderer2;
  private _systemPair = new BehaviorSubject<string>('USD' as string);
  private _systemExplorer = new BehaviorSubject<string>( this.localStore.getData('explorer') || 'https://solana.fm' as string);
  public _systemTheme = this.localStore.getData('theme') || 'dark';

  public explorer$ = this._systemExplorer.asObservable();

  public updateSystemPair(pair: string): void{
    this.localStore.saveData('pair',pair);
    this._systemPair.next(pair);
  }
  changeTheme(name: string){
    this._systemTheme = name;
    this.localStore.saveData('theme',this._systemTheme);
    if(name.toLocaleLowerCase() == 'light'){
      this.enableLightTheme()
    }else{
      this.enableDarkTheme();
    }
  }
  public enableLightTheme(){
    this.renderer.addClass(this.document.body,'light-theme');
  }
  public enableDarkTheme(){
    this.renderer.removeClass(this.document.body,'light-theme');
  }
  public changeExplorer(name: string){
    this.localStore.saveData('explorer',name);
    this._systemExplorer.next(name);
  }
  get explorer(){
    return this._systemExplorer.value;
  }
  public addrUtil(addr: string): {addr: string, addrShort:string} {
    return {addr, addrShort: addr?.substring(0, 4) + '...' + addr.substring(addr.length - 4, addr.length[addr.length])}
  }
  public calcPair(){
    this._systemPair.value
  }
  public getBlockchainAssets(addr: string){
    let assets = {};
  }
  public shortenNum(number,aftetDot = 3): number{
    if(number){
      return Number(number).toFixedNoRounding(aftetDot)
    }else{
      return 0
    }
 
  }
  public numFormater(number: number): any{
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number)
  }
  isNotNull = <T>(source: Observable<T | null>) => source.pipe(filter((item: T | null): item is T => item !== null));
  isNotUndefined = <T>(source: Observable<T | null>) => source.pipe(filter((item: T | null): item is T => item !== undefined));
  // generateUUID() {
  //   return uuidv4();
  // }
  // mmddFormat(date): string {
  //   return moment(date, "DD/MM/YYYY").format("MM/DD/YYYY");
  // }
  // dynamicFormat(date: any, format: string): string {
  //   return moment(date).format(format);
  // }
  // // return the distance between given and current dates
  // dateDiff(date, by: "days" | "month"): number {
  //   return moment(date).diff(moment(), by);
  // }
  // // for chat use
  // timeStamp(unixTime): string {
  //   let timeToMS = unixTime / Number("10000000");
  //   return (
  //     moment.unix(timeToMS).format("HH:mm") +
  //     " " +
  //     moment.unix(timeToMS).format("DD/MM/YYYY")
  //   );
  // }
  // // return custom date
  // dynamicDate(date: Date, number: number, by: "days" | "month"): string {
  //   return moment(date).add(number, by).toString();
  // }
}
