import { Injectable } from "@angular/core";
import * as moment from "moment";
import { v4 as uuidv4 } from "uuid";
declare global {
  interface Date {
    addDays(): Function;
  }
}
@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor() {}
  generateUUID() {
    return uuidv4();
  }
  mmddFormat(date): string {
    return moment(date, "DD/MM/YYYY").format("MM/DD/YYYY");
  }
  dynamicFormat(date: any, format: string): string {
    return moment(date).format(format);
  }
  // return the distance between given and current dates
  dateDiff(date, by: "days" | "month"): number {
    return moment(date).diff(moment(), by);
  }
  // for chat use
  timeStamp(unixTime): string {
    let timeToMS = unixTime / Number("10000000");
    return (
      moment.unix(timeToMS).format("HH:mm") +
      " " +
      moment.unix(timeToMS).format("DD/MM/YYYY")
    );
  }
  // return custom date
  dynamicDate(date: Date, number: number, by: "days" | "month"): string {
    return moment(date).add(number, by).toString();
  }
}
