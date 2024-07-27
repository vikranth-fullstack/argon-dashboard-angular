import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  constructor(private firebaseService: FirebaseService) { }
image1;
image2;image3;
  ngOnInit() {
    
  }
  Save(){

let businessCatlog={

Image1:'from code',
Image2:'test',
Image3:'from code three',
//Country:this.country,
}


    this.firebaseService.addBusinessCatalog(businessCatlog.Image1,businessCatlog.Image2,businessCatlog.Image3);
  }

}
