import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FirebaseService } from '../../firebase.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  registerDetails: any[]=[];
  logoURL:string=''
  mobileNumber:string='';
  businessCategory:string='';
  constructor(private router: Router, private firebaseservice :FirebaseService) { }

  ngOnInit() {
    this.getRegisterDetailsByMobile();
   
  }

  async getRegisterDetailsByMobile() {
    try {
      const storedPhone = localStorage.getItem('phone');
      if (storedPhone) {
        this.mobileNumber = storedPhone.split(' ')[1];
        console.log(this.mobileNumber);
        this.registerDetails=[];
        const res  = await this.firebaseservice.getRegisterCatalog(this.mobileNumber)
       
        if(res.length>0){
          this.registerDetails = res;
          this.logoURL = this.registerDetails[0]['LogoUrl'];
          this.businessCategory = this.registerDetails[0]['businessCategory']
        }else{
            this.navaigateToAddRegister()
        }
       
      }
    } catch (error) {
      console.error('Error fetching register details', error);
    }
  }
  editRegister(){
    this.router.navigate(['/register', this.mobileNumber]);
  }
  navaigateToAddRegister(){
    this.router.navigate(['/register', '']);
  }

}
