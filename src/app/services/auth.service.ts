import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';


@Injectable()
export class AuthService {
  private user: Observable<firebase.User>
  private authState: any;  //authSatte wil be an observable hat is used to determine the authentication state of current  user and it wil have a user id to verify if user is not logged in 


  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) {
      this.user = afAuth.authState;
  }

  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }

  authUser(){
    return this.user;
  }
  
  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.setUserStatus('online');
        this.router.navigate(['chat']);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.setUserStatus('offline');
    this.router.navigate(['login']);
  }

  signUp(email: string, password: string, displayName: string){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then( (user) => {
          this.authState = user;
          // const status = 'online'
          this.setUserData(email, displayName, status);
        }).catch(error => console.log(error));        
  }

  setUserData(email: string, displayName: string, status: string): void {
    const path = `users/${this.currentUserId}`;
    const data = {
      email: email,
      displayName: displayName,
      status: status
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }  

  setUserStatus(status: string): void {
    const path = `users/${this.currentUserId}`;

    const data = {
      status: status
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }


  
}
