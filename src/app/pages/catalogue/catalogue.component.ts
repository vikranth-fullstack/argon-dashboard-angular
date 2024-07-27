import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase.service';
import { FileUpload } from 'src/app/models/file-upload.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  constructor(private firebaseService: FirebaseService) { }
image1;
image2;image3;
selectedFile;
imageUrl;
currentFileUpload;
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
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file; 
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      //File Upload
      this.currentFileUpload = new FileUpload(file);


      this.firebaseService.pushFileToStorage(this.currentFileUpload, "/business_catalog_images").subscribe({
        next: downloadURL => {
          debugger;
          console.log('File uploaded successfully. Download URL:', downloadURL);
          // Handle further operations (e.g., save download URL to database)
        },
        error: error => {
          console.error('Error uploading file:', error);
          // Handle error gracefully
        }
      });


    }
  }
}
