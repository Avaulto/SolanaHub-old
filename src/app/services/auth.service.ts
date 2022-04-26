import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
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
  public anonymousAuth() {
    return this.afAuth.signInAnonymously();
  }
  // Sign in with Google
  public createUserWithEmailAndPassword(email: string, password: any): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }
  // Sign in with Google
  public emailAndPwAuth(email: string, password: any): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
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
