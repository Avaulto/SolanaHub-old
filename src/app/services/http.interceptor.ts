import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

import { LoaderService } from "../services";
import { finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CustomInterceptor implements HttpInterceptor {
  constructor(
    public loaderService: LoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      Accept: "*/*"
    };


    this.loaderService.show();
    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request).pipe(
      finalize(() => this.loaderService.hide())
      );
  }
}
