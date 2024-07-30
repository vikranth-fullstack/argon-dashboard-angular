import { Injectable } from '@angular/core';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from '@angular/fire/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private recaptchaVerifier: RecaptchaVerifier;

  constructor(private auth: Auth) {
    initializeApp(environment.firebaseConfig);
    this.initializeRecaptcha();
  }

  private initializeRecaptcha() {
    this.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible', // Use 'normal' if you want a visible reCAPTCHA widget
      callback: (response) => {
        // Handle reCAPTCHA solved
        console.log('Recaptcha solved', response);
      },
      'expired-callback': () => {
        // Handle reCAPTCHA expiration
        console.log('Recaptcha expired');
      }
    }, this.auth);
  }

  sendOtp(phoneNumber: string): Promise<ConfirmationResult> {
    if (!phoneNumber || !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phoneNumber)) {
      return Promise.reject(new Error('Invalid phone number format'));
    }

    return signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        // Store confirmationResult for verifying the OTP
        return confirmationResult;
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        throw error;
      });
  }

  verifyOtp(confirmationResult: ConfirmationResult, otp: string): Promise<any> {
    if (!otp) {
      return Promise.reject(new Error('OTP is missing'));
    }

    return confirmationResult.confirm(otp)
      .then((userCredential) => {
        // OTP verified, user signed in
        console.log('OTP verified successfully', userCredential);
        return userCredential;
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        throw error;
      });
  }
}
