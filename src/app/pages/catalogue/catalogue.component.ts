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
  constructor(private firebaseService: FirebaseService, private router: Router) { }
  isStatus :  string ='Verified';

  ngOnInit() {
    this.userMobile=localStorage.getItem('phone');
    this.fetchBusinessCataloguebyMobile(this.userMobile);
  }
//fetch catalogues by phone

  async fetchBusinessCataloguebyMobile(Mobile: string) {
    
    this.Allcatalogue = await this.firebaseService.getBusinessCatalog(Mobile);
    this.allActiveCatalogue = this.Allcatalogue.filter(catalog => catalog.isShown);
    this.allDisabledCatalogue = this.Allcatalogue.filter(catalog => !catalog.isShown);
    console.log(this.Allcatalogue.length);
  }
//fetch all categories 
  // async fetchBusinessCategories() {
  //   const snapshot = await this.firebaseService.getBusinessCatalogs();
  //   this.Allcatalogue = [];
  //   snapshot?.docs?.forEach((student) => {
  //     this.Allcatalogue.push({ ...student.data(), id: student.id });
  //   });
  //   this.allActiveCatalogue = this.Allcatalogue.filter(catalog => catalog.isShown);
  //   this.allDisabledCatalogue = this.Allcatalogue.filter(catalog => !catalog.isShown);
  //   // this.allActiveCatalogue = [];
  //   // this.allDisabledCatalogue = [];

  // }

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
    this.fetchBusinessCataloguebyMobile(this.userMobile);
    this.isUpdating = false;
    this.currentDocId = null;
  }, error => {
    console.error('Error updating toggle state:', error);
  });

  //navigate to crud for edit
 
}
navigateToCrud(mobile: string, id:string) {
  this.router.navigate(['crud-catalogue', id]);
}
//applying styles for badges
getBadgeClasses(status: string) {
  return {
    'badge': true,
    'badge-pending': status === 'Pending',
    'badge-rejected': status === 'Rejected',
    'badge-hidden': status === 'Hidden',
    'badge-verified': status === 'Verified'
  };
}


}
  

