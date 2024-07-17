import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@firebase/firestore';
import { FirebaseService } from '../../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CountryISO,  SearchCountryField,PhoneNumberFormat } from "ngx-intl-tel-input";
import { FileUpload } from 'src/app/models/file-upload.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  imageUrl = '';
  studentDetails = {
    name: '',
    age: ''
  }
  studentCollectiondata: { id: string, name: string, age: string }[] | any = [];
  busineeCategoryCollectiondata: { id: string, name: string, age: string }[] | any = [];
  selectedCategory: any = "0"; // Ensure this matches your business category object structure
  businessDescription = 'My business';
  businessForm: FormGroup; // Reactive form instance

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  constructor(private fb: FormBuilder,private firebaseService: FirebaseService) { }
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      //File Upload
      this.currentFileUpload = new FileUpload(file);


      this.firebaseService.pushFileToStorage(this.currentFileUpload).subscribe({
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
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.India];


  initForm() {
    this.businessForm = this.fb.group({
      businessName: ['', [Validators.required]], // Default value for business name
      businessCategory: ['undefined', , [Validators.required]], // Default value for business category
      businessDescription: [''], // Default value for business description
      storeTimings: [''], // Default value for store timings
      businessEmail: ['', [Validators.required, Validators.email]], // Validators for business email,
      userType: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10) ]],
      userName: ['', [Validators.required]],
      // Accept Terms checkbox
      acceptTerms: [false, Validators.requiredTrue]
    });
  }
  ngOnInit() {

    this.get();
    this.firebaseService?.obsr_UpdatedSnapshot?.subscribe((snapshot) => {
      this.updateStudentCollection(snapshot);
    })
    this.fetchBusinessCategories();
    this.initForm();
    this.businessForm.patchValue({ businessCategory: '2V27pgnQrigqObYyrzSo' });
  }
  onMobileNumberInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    input.value = sanitizedValue;
    this.businessForm.get('mobileNumber').setValue(sanitizedValue); // Update form control value
  }
  async add() {
    const { name, age } = this.studentDetails;
    await this.firebaseService.addBusiness(name, age);
    this.studentDetails.name = "";
    this.studentDetails.age = "";
  }

  async get() {
    const snapshot = await this.firebaseService.getStudents();
    this.updateStudentCollection(snapshot);
  }

  updateStudentCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.studentCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.studentCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: string) {
    await this.firebaseService.deleteBusiness(docId);
  }

  async update(docId: string, name: HTMLInputElement, age: HTMLInputElement) {
    await this.firebaseService.updateBusiness(docId, name.value, age.value);
  }

  async fetchBusinessCategories() {
    const snapshot = await this.firebaseService.getBusinessCategories();

    this.busineeCategoryCollectiondata = [];
    snapshot?.docs?.forEach((student) => {
      this.busineeCategoryCollectiondata.push({ ...student.data(), id: student.id });
    });
  }
  submitForm() {
    if (this.businessForm.valid) {
      console.log(this.businessForm.value); // Replace with your form submission logic
    } else {
      // Mark form fields as touched to display validation messages
      this.businessForm.markAllAsTouched();
    }
  }
}
