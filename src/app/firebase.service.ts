import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot } from 'firebase/firestore'
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  db: Firestore;
  studentCol: CollectionReference<DocumentData>;
  businessCategoryCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();

  constructor() {
    initializeApp(environment.firebaseConfig);
    this.db = getFirestore();
    this.studentCol = collection(this.db, 'students');
    this.businessCategoryCol = collection(this.db, 'businesscategories');

    // Get Realtime Data
    onSnapshot(this.studentCol, (snapshot) => {
      this.updatedSnapshot.next(snapshot);
    }, (err) => {
      console.log(err);
    })
  }
  async getBusinessCategories() {
    const snapshot = await getDocs(this.businessCategoryCol);
    return snapshot;
  }

  async getStudents() {
    const snapshot = await getDocs(this.studentCol);
    return snapshot;
  }

  async addBusiness(name: string, age: string) {
    await addDoc(this.studentCol, {
      name,
      age
    })
    return;
  }

  async deleteBusiness(docId: string) {
    const docRef = doc(this.db, 'students', docId)
    await deleteDoc(docRef);
    return;
  }

  async updateBusiness(docId: string, name: string, age: string) {
    const docRef = doc(this.db, 'students', docId);
    await updateDoc(docRef, { name, age })
    return;
  }

  
}
