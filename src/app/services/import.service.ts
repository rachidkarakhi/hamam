import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  params = new HttpParams().set("consumer_key","ck_859fe97955b32a8d5ec0694d78d8996d40ea3181").set("consumer_secret", "cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43");

  constructor(private http:HttpClient,private https:HttpClient) { }


  sendproprities(proprities:any,productsExpl:any){
    let URL = "http://localhost/pos-import/test.php";
     const headers = new HttpHeaders();
     headers.append('Content-Type', 'application/json');
    //  let data = [{lay:proprities}];
     let data = [proprities,productsExpl];

     return this.http
     .post(URL,JSON.stringify(data),{
         headers: headers
     })
   }
   sendfile(data:any){


    return this.http
    .post("http://localhost/pos-import/test2.php",data)
    // const upload$ = this.http.post("/api/thumbnail-upload", formData);

    // upload$.subscribe();
   }
   sendfilevariation(data:any,products:any){


    return this.http
    .post<any[]>("http://localhost/pos-import/variation.php",data)
    // const upload$ = this.http.post("/api/thumbnail-upload", formData);

    // upload$.subscribe();
   }
   insert(produit:any){
    return this.https.post<any>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products?consumer_key=ck_859fe97955b32a8d5ec0694d78d8996d40ea3181&consumer_secret=cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43",produit);

   }
   insertVariation(variation:any,id:number){
    return this.https.post<any>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products/"+id+"/variations?consumer_key=ck_859fe97955b32a8d5ec0694d78d8996d40ea3181&consumer_secret=cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43",variation);

   }
   findallprodvariable(search:any){
    return this.https.get<any[]>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products?sku="+search,{params: this.params});

   }

}
