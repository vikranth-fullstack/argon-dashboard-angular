import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@firebase/firestore';
import { FirebaseService } from '../../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  selectedCategory: any; // Ensure this matches your business category object structure
  businessDescription='My business';
  businessForm: FormGroup; // Reactive form instance

  constructor(private fb: FormBuilder, // FormBuilder for creating reactive forms
    private firebaseService: FirebaseService) { }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  initForm() {
    this.businessForm = this.fb.group({
      businessName: ['lucky.jesse'], // Default value for business name
      businessCategory: [''], // Default value for business category
      businessDescription: [''], // Default value for business description
      storeTimings: [''], // Default value for store timings
      businessEmail: ['', [Validators.required, Validators.email]] // Validators for business email
    });
  }
  ngOnInit(): void {

    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateStudentCollection(snapshot);
    })
    this.fetchBusinessCategories();
    this.initForm();
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
    snapshot.docs.forEach((student) => {
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
