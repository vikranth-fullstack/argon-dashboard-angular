import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationResult } from 'firebase/auth';
import { OtpService } from 'src/app/otp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private otpService: OtpService) { }
  phoneNumber: string = '';
  otp: string = '';
  verificationId: ConfirmationResult | undefined;
  ngOnInit() {
    if (localStorage.getItem('user') != null) {
      this.router.navigate(['/register']);
    }
  }
  ngOnDestroy() {
  }
  login() {
    localStorage.setItem('user', 'vik');
    this.router.navigate(['/dashboard']);
  }
  sendOtp() {
    this.otpService.sendOtp(this.phoneNumber)
      .then((confirmationResult) => {
        this.verificationId = confirmationResult;
        console.log('OTP sent to phone number');
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
      });
  }

  verifyOtp() {
    if (this.verificationId) {
      this.otpService.verifyOtp(this.verificationId, this.otp)
        .then((result) => {
          localStorage.setItem('phone', this.phoneNumber);
          localStorage.setItem('user', 'vik');
          localStorage.setItem('phone',this.phoneNumber);
          console.log('OTP verified successfully:', result);
          this.router.navigate(['/dashboard']);
        })
        .catch((error) => {
          console.error('Error verifying OTP:', error);
        });
    }
  }
}
