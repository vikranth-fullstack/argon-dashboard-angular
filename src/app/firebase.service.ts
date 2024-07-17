import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot } from 'firebase/firestore'
import { finalize, Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FileUpload } from './models/file-upload.model';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  db: Firestore;
  studentCol: CollectionReference<DocumentData>;
  businessCategoryCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  private basePath = '/uploads';
  uploadedFileUrl = '';

  constructor(private afDB: AngularFireDatabase, private storage: AngularFireStorage) {
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

  pushFileToStorage(fileUpload: FileUpload): Observable<string> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);



    return new Observable<string>(observer => {
      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await storageRef.getDownloadURL().toPromise();
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.uploadedFileUrl = `${this.basePath}/${fileUpload.url}`;
          // Optionally save file data or perform other operations

          observer.next(fileUpload.url); // Emit the download URL
          observer.complete();
        })
      ).subscribe();
    });


    // uploadTask.snapshotChanges().pipe(
    //   finalize(() => {
    //     storageRef.getDownloadURL().subscribe(downloadURL => {
    //       fileUpload.url = downloadURL;

    //       fileUpload.name = fileUpload.file.name;
    //       debugger;
    //       this.uploadedFileUrl = this.basePath + fileUpload.url;
        
    //       //this.saveFileData(fileUpload);
    //     });
    //   })
    // ).subscribe();

    //return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.afDB.list(this.basePath).push(fileUpload);

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
