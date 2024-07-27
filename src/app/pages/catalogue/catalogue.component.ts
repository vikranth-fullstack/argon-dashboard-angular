import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase.service';
import { FileUpload } from 'src/app/models/file-upload.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  constructor(private firebaseService: FirebaseService) { }
image1=null;
image2=null;
image3=null;
selectedFile;
imageUrl;
currentFileUpload;
  ngOnInit() {
    
  }
  onSubmit(form: NgForm) {
    this.markAllAsTouched(form);
    if (form.valid) {
      // Form is valid, proceed with form submission logic
      let businessCatlog={
        Image1:this.image1,
        Image2:this.image2,
        Image3:this.image3,
      }
    let catalogObj = form.value['catalogue'];
    this.firebaseService.addBusinessCatalog(businessCatlog.Image1,businessCatlog.Image2,businessCatlog.Image3,catalogObj.ItemName, catalogObj.Country, catalogObj.Description, catalogObj.Link, catalogObj.MRP, catalogObj.SellingPrice ).then(
        () => alert('Catalog submitted successfully'),
        error => console.error('Error submitting catalog:', error)
      );
    }else  if (!this.image1 && !this.image2 && !this.image3) {
        alert('At least one image is required.');
      }
     else {
      // Form is invalid, mark all controls as touched to trigger validation messages
      this.markAllAsTouched(form);
    }
  }

  markAllAsTouched(form: NgForm) {
    if (form && form.controls) {
      Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        control.markAsTouched({ onlySelf: true });
        if (control['controls']) { // Handle nested controls if any
          this.markAllAsTouched(control as any); 
        }
      });
    }
  }
  // Save(catalog:any){
  //   let businessCatlog={

  //       Image1:this.image1,
  //       Image2:this.image2,
  //       Image3:this.image3,
       
  //   }
  //  let catalogObj = catalog.value;

  //   this.firebaseService.addBusinessCatalog(businessCatlog.Image1,businessCatlog.Image2,businessCatlog.Image3,catalogObj.ItemName, catalogObj.Country, catalogObj.Description, catalogObj.Link, catalogObj.MRP, catalogObj.SellingPrice );
  // }
  async onFileSelected(event: any, fileNumber: number) {
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
          if(fileNumber==1){
            this.image1=downloadURL; 
          }else  if(fileNumber==2){
            this.image2=downloadURL; 
          }else{
            this.image3=downloadURL;
          }
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
