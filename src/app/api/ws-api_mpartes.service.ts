import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import firebase from 'firebase';
import auth = firebase.auth;
import {INPUTS_IDS} from '../client/sin-up/INPUTS_IDS';
import {map} from 'rxjs/operators';

export interface User {
  idAut: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  tipoDoc: string;
  tipoDocValue: string;
  fechaNacimiento: string;
  telefono: string;
  colegioAbogado: string;
  nroColegioAbo: string;
  sinoe: string;


}

@Injectable({
  providedIn: 'root'
})
export class WSAuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {

    /* Saving user data in localstorage when
       logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);

  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // actionCodeSettings = {
  //   // URL you want to redirect back to. The domain (www.example.com) for this
  //   // URL must be in the authorized domains list in the Firebase Console.
  //   url: 'https://www.example.com/finishSignUp?cartId=1234',
  //   // This must be true.
  //   handleCodeInApp: true,
  //   iOS: {
  //     bundleId: 'com.example.ios'
  //   },
  //   android: {
  //     packageName: 'com.example.android',
  //     installApp: true,
  //     minimumVersion: '12'
  //   },
  //   dynamicLinkDomain: 'example.page.link'
  // };

  // Send email verfificaiton when new user sign up
  // SendVerificationMail(email: any) {
  //   return this.afAuth.sendSignInLinkToEmail(email, this.actionCodeSettings)
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });
  // }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider);

  }


  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  SetUserData(dataForm) {
    return this.afs
      .collection('users')
      .add(Object.assign({}, dataForm));

  }


  getUserData(uid: string) {

    return this.afs.collection<any>('users', ref => ref.where('idAut', '==', uid)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }));
  }
}


