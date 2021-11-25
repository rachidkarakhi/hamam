import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Variation } from '../models/variation';
@Injectable({
  providedIn: 'root'
})
export class VariationService {
  params = new HttpParams().set("consumer_key","ck_859fe97955b32a8d5ec0694d78d8996d40ea3181").set("consumer_secret", "cs_3906caf4acb06cc53fe537e4ff13c9e2bd9b9f43");


  constructor(private http:HttpClient) { }
  findall(id:number){
     return this.http.get<Variation[]>("https://elfadel.hamam.ma/index.php/wp-json/wc/v3/products/"+id+"/variations",{params: this.params});
  }
}
