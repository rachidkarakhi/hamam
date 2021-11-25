import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ImportService } from 'src/app/services/import.service';
import {MenuItem} from 'primeng/api';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
 productsExpl = { name: 'Nom du produit', slug: 'slug de produit.', type: 'variable', status: 'publish', catalog_visibility: 'visible', description: 'description de produit', short_description: 'mini description de produit', sku: 'sku de produit', regular_price: '30.00', sale_price: '25.00', manage_stock: true, stock_quantity: 10, stock_status: 'instock', weight: '10' , categories: 'catégorie 1,catégorie 2' , parent_id: 10 , images: 'url de l image 1,url de l image 1..' , attributes: 'size:M:S,color:red:black 3' , determinator2: ',' , determinator1: ':' };
 variationsExpl={ regular_price: '30.00',sale_price: '20',status: 'publish',manage_stock: true,stock_quantity: 2,stock_status: 'instock',weight:  '10',image: 'url de l image',attributes: 'size:M,color:red', determinator2: ',' , determinator1: ':' };
  items: MenuItem[] = [];
  imp='gnr1';
  varproduits:any = [];
  skus:any = [];
  addtest=false;
  impoSpinner=false;
  impoSpinner2=false;
  addtestvariation=false;
  msg=false;
  msgvariation=false;
  dropdownList:any = [];
  variationList:any = [];
  products:any = [];
  variations:any = [];
  admin='';
  errors:any = [];
  errorsvariation:any = [];
  selectedItems:string[]=[];
  selectedVariations= [];
  olinkhref=true;
  olinkhrefvariation=true;
  fileName = '';
  fileNameVariation = '';
  percentage:number=0;
  percentagevariation:number=0;
  calc:number=0;
  calcvariation:number=0;
  file:File=new File([],"",) ;
  fileVariation:File=new File([],"",) ;
  dropdownSettings : IDropdownSettings={};
  olink = document.createElement('a');
  olinkvariation = document.createElement('a');
  // orders: Order[]=[];
  constructor(private  importService:ImportService,private router: Router,private authService:AuthService) {
    if (! localStorage.getItem('currentUser')) {
      this.router.navigate(['/login']);
    }else{
      this.admin=String(localStorage.getItem('currentUsername'));

    }

   }

   ngOnInit() {
    this.items = [
      {label: 'Produits', icon: 'pi pi-fw pi-file-excel',command: (event) => {
        this.imp='gnr1'
      } },
      {label: 'Ajouter les produits', icon: 'pi pi-fw pi-download',command: (event) => {
        this.imp='imp1'
      }},
      {label: 'Variations', icon: 'pi pi-fw pi-file-excel',command: (event) => {
        this.imp='gnr2'
      }},
      {label: 'Ajouter les variations', icon: 'pi pi-fw pi-download',command: (event) => {
        this.imp='imp2'
      }}

  ];
    this.dropdownList = ['name','slug','type','status','catalog_visibility','description','short_description','sku','regular_price','sale_price','manage_stock','stock_quantity','stock_status','weight','categories','parent_id','images','attributes'];
    this.variationList = ['regular_price','sale_price','status','manage_stock','stock_quantity','stock_status','weight','image','attributes'];

    this.selectedItems = [];
    this.selectedVariations=[];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onItemSelectvariation(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onSelectAllvariation(items: any) {
    console.log(items);
  }
  downloadfile(){
    this.olink.click();
  }
  downloadfilevariation(){
    this.olinkvariation.click();
  }
  init(){
    this.selectedItems = [];

    this.olink.href ='';
    this.olink.download = "";
    this.olinkhref=true;


  }
  initvariation(){

    this.selectedVariations= [];
    this.olinkvariation.href ='';
    this.olinkvariation.download = "";

    this.olinkhrefvariation=true;

  }
  sendvariation(){

    if (this.selectedVariations.length >0) {
      this.impoSpinner2=true;
      if (this.selectedItems.filter((selectedItem)=>selectedItem.includes('sku')) != ["sku"]) {
        this.selectedItems.push("sku");
      }
      if (this.selectedItems.filter((selectedItem)=>selectedItem.includes('attributes')) != ["attributes"]) {
        this.selectedItems.push("attributes");
      }

      this.selectedItems.push("product_sku");

      this.importService.sendproprities(this.selectedVariations,this.variationsExpl).subscribe(
        data => {
          this.impoSpinner2=false;
          this.olinkvariation.href = "http://localhost/pos-import/"+data;
          this.olinkvariation.download = "help.xlsx";
          this.olinkhrefvariation=false;

          console.log('works good', data);

      },
        error => {

           console.log('oops', error);
           this.impoSpinner2=false;

      }

      )
    }else{
    alert('Merci de choisir les propriétés des variations ')
    }

  }
  send(){
    if (this.selectedItems.length >0) {
      this.impoSpinner=true;

      if (this.selectedItems.filter((selectedItem)=>selectedItem.includes('sku')) != ["sku"]) {
        this.selectedItems.push("sku");
      }
      if (this.selectedItems.filter((selectedItem)=>selectedItem.includes('name')) != ["name"]) {
        this.selectedItems.push("name");
      }

      this.importService.sendproprities(this.selectedItems,this.productsExpl).subscribe(
        data => {

          this.olink.href = "http://localhost/pos-import/"+data;
          this.olink.download = "help.xlsx";
          this.olinkhref=false;

          console.log('works good', data);
          this.impoSpinner=false;

      },
        error => {

           console.log('oops', error);
           this.impoSpinner=false;
      }

      )
    }else{
    alert('Merci de choisir les propriétés du produit ')
    }

  }
  sendfile(){
    this.msg=false;
    if (this.file) {

      this.fileName = this.file.name;

      const formData = new FormData();

      formData.append("file", this.file);

     formData.append('name', this.fileName);

      this.importService.sendfile(formData).subscribe(
        data => {

        this.products=data;

          console.log('works good', data);
          this.errors= [];
          if (data ==['determinator not found']) {
            alert( data);
          }else{

           this.insert(0);
          console.log('works good', data);

          }


      },
        error => {
           console.log('oops', error);
            alert(error.error.text);

      }

      )

    }else{
      alert('merci de telecharger le fichier excel !')
    }
  }
  insert(index:number){


    let shand = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    shand[0].style.display = "block";



  console.log('try',index);

    this.importService.insert(this.products[index]).subscribe(
      data => {



        console.log('works good', data);
        if (index  <this.products.length-1) {
          this.percentage=((index+1)*100)/this.products.length;
          this.calc++;
          this.insert(index+1)
        }else{
          shand[0].style.display = "none";
          this.percentage=0;
          this.msg=true;
          this.calc=0;
        }

    },
      error => {
        this.errors.push('ligne '+ (index+1) +' :' +error.error.message);
         console.log('oops', error.error.message);
         if (index  <this.products.length-1) {
          this.percentage=((index+1)*100)/this.products.length;
          this.calc++;
          this.insert(index+1)
        }else{
          shand[0].style.display = "none";
          this.percentage=0;
          this.msg=true;
          this.calc=0;
        }

    }

    )





  }
  onFileSelected(event:any) {
    this.addtest=true;
    this.file = event.target.files[0];


}
onFileSelectedVariation(event:any) {
  this.addtestvariation=true;
  this.fileVariation = event.target.files[0];


}
sendfileVariation(){
  this.msgvariation=false;
  if (this.fileVariation) {

    this.fileNameVariation = this.fileVariation.name;

    const formData = new FormData();

    formData.append("file", this.fileVariation);

   formData.append('name', this.fileVariation.name);

    this.importService.sendfilevariation(formData,this.varproduits).subscribe(
      data => {

      this.variations=data[0];
      this.skus=data[1];
 console.log(data);

        this.errors= [];
        if (data ==['determinator not found']) {
          alert( data);
        }else{
           console.log('works good 2', data);
         this.insertVariation(0);

        }

    },
      error => {
         console.log('oops', error);

    }

    )

  }else{
    alert('merci de telecharger le fichier excel !')
  }
}
insertVariation(index:number){

if(this.variations[index]){
  let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
  shand[0].style.display = "block";



console.log('try',index);
this.importService.findallprodvariable(this.skus[index]).subscribe(ret =>{
      if (ret.length) {
            this.importService.insertVariation(this.variations[index],ret[0].id).subscribe(
              data => {

                console.log('works good', data);
                if (index  <this.variations.length-1) {
                  this.percentagevariation=((index+1)*100)/this.variations.length;
                  this.calcvariation++;
                  this.insertVariation(index+1)
                }else{
                  shand[0].style.display = "none";
                  this.percentagevariation=0;
                  this.msgvariation=true;
                  this.calcvariation=0;
                }

            },
              error => {
                this.errorsvariation.push('ligne '+ (index+1) +' :' +error.error.message);
                 console.log('oops', error.error.message);
                 if (index  <this.variations.length-1) {
                  this.percentagevariation=((index+1)*100)/this.variations.length;
                  this.calcvariation++;
                  this.insertVariation(index+1)
                }else{
                  shand[0].style.display = "none";
                  this.percentagevariation=0;
                  this.msgvariation=true;
                  this.calcvariation=0;
                }

            }

            )
      } else{
        console.log('kinchay');
        this.errorsvariation.push('ligne '+ (index+1) +' :' +"sku de produit  non valide");
        this.insertVariation(index+1)
      }
},
er=>{

}

)


}else{
  let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
  shand[0].style.display = "none";
}





}
}
