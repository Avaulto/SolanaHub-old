import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import { ToasterService } from './toaster.service';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private toasterService: ToasterService,
    private userService: UserService,
    private afAuth: AngularFireAuth // Inject Firebase auth service
  ) {
    // Setting logged in user in localstorage else null
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userService.setAuth(user)
        localStorage.setItem('user', JSON.stringify(this.userService.getCurrentUser()));
        JSON.parse(localStorage.getItem('user')!);
        console.log(user)
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
        console.log(user)
      }
    });
  }
  private formatErrors(error: any) {
    console.log('my err', error.message)
    this.toasterService.msg.next({
      message: error.message.replaceAll('Firebase: Error','').replaceAll('(','').replaceAll(')',''),
      icon:'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError(error);
  }

  public anonymousAuth() {
    return this.afAuth.signInAnonymously();
  }
  // Sign in with Google
  public async createUserWithEmailAndPassword(email: string, password: any): Promise<any> {
    try {
      const newUser = await this.afAuth.createUserWithEmailAndPassword(email, password)
      return newUser
      // this.userService.setAuth(result);
    } catch (error) {
      this.formatErrors(error)
    }
  }
  // Sign in with Google
  public async signInWithEmailAndPw(email: string, password: any): Promise<any> {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(email, password)
      return user;
      // this.userService.setAuth(result);
    } catch (error) {
      this.formatErrors(error)
    }
  }
  // Sign in with Google
  public GoogleAuth(): Promise<any> {
    return this._AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  private _AuthLogin(provider): Promise<any> {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.userService.setAuth(result);
        console.log(result, 'You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  public SignOut(): Promise<any> {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.userService.purgeAuth();
    });
  }
}
