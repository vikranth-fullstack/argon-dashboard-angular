import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, where } from 'firebase/firestore'
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
  catlogCol: CollectionReference<DocumentData>;

  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  private basePath = '/uploads';
  uploadedFileUrl = '';

  constructor(private afDB: AngularFireDatabase, private storage: AngularFireStorage) {
    initializeApp(environment.firebaseConfig);
    this.db = getFirestore();
    this.studentCol = collection(this.db, 'students');
    this.businessCategoryCol = collection(this.db, 'businesscategories');
    this.catlogCol=collection(this.db,'BusinessCatalog');
    // Get Realtime Data
    onSnapshot(this.studentCol, (snapshot) => {
      this.updatedSnapshot.next(snapshot);
    }, (err) => {
      console.log(err);
    })
  }

  pushFileToStorage(fileUpload: FileUpload,basePath:String): Observable<string> {
    const filePath = `${basePath}/${fileUpload.file.name}`;
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
  async getBusinessCatalog(mobile:string) {
    //const snapshot = await getDocs(this.catlogCol);
    //return snapshot;
    const catalogRef = collection(this.db, 'BusinessCatalog'); // Adjust the collection name as needed

    // Create a query with a filter
    const q = query(catalogRef, where('Mobile', '==', mobile));

    // Fetch the filtered documents
    const snapshot = await getDocs(q);

    // Process the results as needed
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return results;

  }
  async getBusinessCatalogbyId(id:string) {
    //const snapshot = await getDocs(this.catlogCol);
    //return snapshot;
    const catalogRef = collection(this.db, 'BusinessCatalog'); // Adjust the collection name as needed

    // Create a query with a filter
    const q = query(catalogRef, where('id', '==', id));

    // Fetch the filtered documents
    const snapshot = await getDocs(q);

    // Process the results as needed
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return results;

  }
  async getBusinessCatalogs() {
    const snapshot = await getDocs(this.catlogCol);
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

  async addBusinessCatalog(Image1: string, Image2: string,Image3:string, ItemName:string, Country:string, Description:string, Link:string, MRP:string, SellingPrice:string, Mobile:string, isShown:boolean) {
    await addDoc(this.catlogCol, {
      Image1, 
      Image2,
      Image3,
      ItemName,
      Country, 
      Description,
      Link,
      MRP,
      SellingPrice,
      Mobile,
      isShown
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
  async updateBusinessCatalogue(docId: string, updatedFields: { [key: string]: any }) {
    const docRef = doc(this.db, 'BusinessCatalog', docId);
    await updateDoc(docRef, updatedFields)
    return;
  }
}
