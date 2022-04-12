import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, ReplaySubject, throwError } from "rxjs";

import { ApiService } from "./api.service";
import { User } from "../models";
import { map, distinctUntilChanged, catchError } from "rxjs/operators";
import { toastMessageService } from "./toast-message.service";
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private messages: toastMessageService
  ) {}

  // catch error
  private formatErrors(error: any) {
    this.messages.msg.next({
      message: error.error,
      segmentClass: "toastError",
    });
    return throwError(error);
  }
  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (true) {
        // this.setAuth(data)
    } else {
      // Remove any potential remnants of previous auth states
      // this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

    // switch redirect by first visin or not
    this.navCtrl.navigateForward("/on-bording", { replaceUrl: true });
  }

  purgeAuth() {
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);

    this.navCtrl.navigateRoot("/home", { animated: true });
  }

  // attemptAuth(credentials, type): Observable<User> {
  //   const route = type === "login" ? "signin" : "signup";
  //   return this.apiService.post(`/user/${route}`, credentials).pipe(
  //     map((data) => {
  //       this.setAuth(data);
  //       return data;
  //     }),
  //     catchError((error) => this.formatErrors(error))
  //   );
  // }

  resetPassword(email): Observable<Error> {
    return this.apiService.post("/user/reset-password", email).pipe(
      map((data) => {
        return data;
      }),
      catchError((error) => this.formatErrors(error))
    );
  }
  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService.put("/user/edit", user).pipe(
      map((user) => {
        // Update the currentUser observable
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError((error) => this.formatErrors(error))
    );
  }
}
