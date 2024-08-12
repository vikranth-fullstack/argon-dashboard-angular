import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../firebase.service';
import { FileUpload } from 'src/app/models/file-upload.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  @ViewChild('catalogueForm') catalogueForm: NgForm;
  image1: string | null = null;
  image2: string | null = null;
  image3: string | null = null;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  currentFileUpload: FileUpload | null = null;
  Allcatalogue: any[] = [];
  allActiveCatalogue: any[] = [];
  allDisabledCatalogue: any[] = [];
  activeTab: string = 'all';
  editCatalogDdetails: any[] = [];
  data: any = {};
  isUpdating = false;
  currentDocId: string | null = null;
  userMobile:string=null;
  constructor(private firebaseService: FirebaseService, private router: Router, private router: Router) { }
  isStatus :  string ='Verified';

  ngOnInit() {
    this.fetchBusinessCategories();
  }
//fetch all categories
  async fetchBusinessCategories() {
    const snapshot = await this.firebaseService.getBusinessCatalogs();
    this.Allcatalogue = [];
    snapshot?.docs?.forEach((student) => {
      this.Allcatalogue.push({ ...student.data(), id: student.id });
    });
    this.allActiveCatalogue = this.Allcatalogue.filter(catalog => catalog.isShown);
    this.allDisabledCatalogue = this.Allcatalogue.filter(catalog => !catalog.isShown);
  }
//edit Catalogue
  async geteditCatalogue(Mobile: string, docId:string) {
    this.currentDocId=docId;
    this.isUpdating=true;
    this.editCatalogDdetails = await this.firebaseService.getBusinessCatalog(Mobile);
    this.bindDataToFields();
  }

  onSubmit(form: NgForm) {
    this.markAllAsTouched(form);
    if (form.valid) {
      const businessCatlog = {
        Image1: this.image1,
        Image2: this.image2,
        Image3: this.image3,
      };
      const catalogObj = form.value['catalogue'];
      this.firebaseService.addBusinessCatalog(
        businessCatlog.Image1,
        businessCatlog.Image2,
        businessCatlog.Image3,
        catalogObj.ItemName,
        catalogObj.Country,
        catalogObj.Description,
        catalogObj.Link,
        catalogObj.MRP,
        catalogObj.SellingPrice,
        catalogObj.MobileNumber,
        true
      ).then(
        () => {
          alert('Catalog submitted successfully');
          this.fetchBusinessCategories();
          this.catalogueForm.resetForm();
          this.isUpdating = false;
          this.currentDocId = null;
        },
        error => console.error('Error submitting catalog:', error)
      );
    } else if (!this.image1 && !this.image2 && !this.image3) {
      alert('At least one image is required.');
    } else {
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

  async onFileSelected(event: any, fileNumber: number) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.currentFileUpload = new FileUpload(file);

      this.firebaseService.pushFileToStorage(this.currentFileUpload, "/business_catalog_images").subscribe({
        next: downloadURL => {
          if (fileNumber === 1) {
            this.image1 = downloadURL;
          } else if (fileNumber === 2) {
            this.image2 = downloadURL;
          } else {
            this.image3 = downloadURL;
          }
          console.log('File uploaded successfully. Download URL:', downloadURL);
        },
        error: error => {
          console.error('Error uploading file:', error);
        }
      });
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  bindDataToFields() {
    this.data = this.editCatalogDdetails[0];
    this.catalogueForm.setValue({
      catalogue: {
        ItemName: this.data.ItemName || '',
        Country: this.data.Country || '',
        Description: this.data.Description || '',
        Link: this.data.Link || '',
        MRP: this.data.MRP || '',
        SellingPrice: this.data.SellingPrice || '',
        MobileNumber: this.data.Mobile || '',
        isStatus:this.data.isStatus || ''
      }
    });

    this.image1 = this.data.Image1 || null;
    this.image2 = this.data.Image2 || null;
    this.image3 = this.data.Image3 || null;
  }



  
 // Method to handle toggle changes
 onToggleChange(item: any) {
  this.firebaseService.updateBusinessCatalogue(item.id, { isShown: item.isShown }).then(() => {
    console.log('Toggle state updated successfully');
    this.fetchBusinessCategories();
    this.isUpdating = false;
    this.currentDocId = null;
  }, error => {
    console.error('Error updating toggle state:', error);
  });

  //navigate to crud for edit
 
}
navigateToCrud(mobile: string, id:string) {
  this.router.navigate(['/crud-catalogue', mobile, id]);
}
}
  

