
import { Component, OnInit } from '@angular/core';

import { SafeHtml } from '@angular/platform-browser';

import {DialogModule} from 'primeng/dialog';


import { Cart } from 'src/app/models/cart';
import { Categorie } from 'src/app/models/categorie';
import { Item } from 'src/app/models/item';
import { Order } from 'src/app/models/order';
import { Produit } from 'src/app/models/produit';
import { PrinterService } from 'src/app/services/printer.service';
import {Router} from "@angular/router"
import {formatDate } from '@angular/common';

import { ProduitService } from 'src/app/services/produit.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { FundService } from 'src/app/services/fund.service';
import { Fund } from 'src/app/models/fund';
import { VariationService } from 'src/app/services/variation.service';
import { Variation } from 'src/app/models/variation';
import { Produitpanier } from 'src/app/models/produitpanier';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {
  inputshowed=0;
  searchText='';
  payement='Espèce';
  total=0.00;
  produits: Produit[]=[];
  resultProduits: Produit[]=[];
  resultCategories: Categorie[]=[];
  carts: Cart[]=[];
  showloader=false;
  myOrder=new Order();
  produit = {};
  variations: Variation[];
  msgs="message de merde ";
  selectedVariation: Variation;
  selectedVariationoption:string="";
  // item=;
  /////printer declaration ///
  status: boolean = false;
  ip: string = '';
  montantclient=0;
  admin='';
  parentProduct: any={};
  qtyVariation: number=1;
   selectedVariations: [{
     variation: Variation,
     qty:number }];
     updateVariationTest=false;
     totalvariation=0;
     navitems: MenuItem[]=[];
     display: boolean = false;
     auth:any = {
      username:'',
      password:'',
    };
    showloaderpop=false;
    data: SafeHtml | undefined;
  ////////////////////////
  dataloadervar=true;
  constructor(private  fundService:FundService,private  produitService:ProduitService,private  printer:PrinterService,private router: Router,private authService:AuthService,private variationService:VariationService ) {
    this.variations = [];
    this.selectedVariations= [{variation:new Variation,qty:0}];
    this.selectedVariations.splice(0,1);
    this.selectedVariation= new Variation();
    if (! localStorage.getItem('currentUser')) {

      this.router.navigate(['/login']);
    }else{
      this.admin=String(localStorage.getItem('currentUsername'));

    }
  }


  ngOnInit(): void {
    this.navitems = [
      {label: 'حمام', icon: 'pi pi-fw pi-home',command: (event) => {this.getProduitsbyCat(16,1)}},
      {label: 'المنتجات', icon: 'pi pi-shopping-cart',command: (event) => {this.getProduitsbyCat(17,1)}},
      {label: 'الطلبيات', icon: 'pi pi-list',routerLink: ['/orders']},

      {label: 'تسجيل الخروج', icon: 'pi pi-sign-out',routerLink: ['/logout']}
  ];
    this.getCategories();
    // this.getProduits(1);

    console.log(this.resultCategories);
    this.getProduitsbyCat(16,1);

  }
  showDialog() {

    if (localStorage.getItem("currentUser") == "1") {
      this.fermercaisse();
    }else{

      this.display = true;

     this.auth= {
      username:'',
      password:'',
    };
    this.showloaderpop=false;
    }

}

verify(){
  this.showloaderpop=true;

  if (this.auth.password=='' || this.auth.username=='') {

    this.data="حقل اسم المستخدم أو حقل كلمة المرور فارغ";
    this.showloaderpop=false;

  }else{
    this.connect();
  }
}
connect(){
  this.authService.connect(this.auth).subscribe(
    data => {
       console.log('success 1', data);
this.authService.getuser(data.user_email).subscribe(
  data2 => {
    // ila makhedematch katmchi l '/www/wp-includes/rest-api/endpoints/class-wp-users-controller commenti line
    // 301 // $prepared_args['has_published_posts'] = get_post_types( array( 'show_in_rest' => true ), 'names' );
    // console.log('success', data2);

    //  localStorage.setItem('currentUser', data2[0].id);
    //  localStorage.setItem('currentUsername', data2[0].name);
    console.log('success 2', data2[0].id);
    if(data2[0].id == 1){
      this.fermercaisse()

    }else{
      Swal.fire({

        icon: 'error',
        title: 'لا يسمح لك بإغلاق الصندوق',
        showConfirmButton: false,
        timer: 1500
      })
      this.display = false;

      this.auth= {
       username:'',
       password:'',
     };
     this.showloaderpop=false;
    }



},
  error => {
     console.log('oops', error);


}

)


    this.showloaderpop=false;
  },
    error => {
      // console.log('oops', error);
    this.data=error.error.message;
    this.showloaderpop=false;
  }

  );
}
  navigate(nav:string){
    this.router.navigate([nav]);
  }
  addtocartallvariation(){
    this.selectedVariations.forEach(element => {

      const index2 = this.carts.findIndex(x => x.variation_id === element.variation.id );


      if (index2!=-1) {
        this.carts[index2].qtt=element.qty;
        this.carts[index2].sub=element.qty*Number(element.variation.price);
      }else{
        let name =this.parentProduct.name+" - ";
        element.variation.attributes.forEach(el => {
        name=name+el.option;
          });

        console.log("element.variation",element.variation);
          let objcart = new Cart(element.qty,this.parentProduct.id,Number(element.variation.price),name,"",element.qty*Number(element.variation.price),element.variation.id);
              this.carts.push(objcart);
      }

          this.total=this.carts.reduce((a, b) => a+ b.sub , 0);
    });
    this.closemodal();
  }
  dincvariation(){
    if (this.qtyVariation > 1 || this.selectedVariation.stock_quantity == 0) {
      this.qtyVariation--;
    }

  }
  changeNumber(price:string){
    return Number(price);
  }
  deleteselected(variation:Variation){
    if (variation == this.selectedVariation) {
      this.updateVariationTest=false;
      this.qtyVariation=1;
    }
    const index = this.selectedVariations.findIndex(x => x.variation === variation );
    this.selectedVariations.splice(index, 1);
    this.totalcalc();

    const index2 = this.carts.findIndex(x => x.variation_id === variation.id );


if (index2!=-1) {
  this.carts.splice(index2, 1);
}



    this.total=this.carts.reduce((a, b) => a+ b.sub , 0);
  }
  addToCartvariation(){
    let test=this.selectedVariations.findIndex(e => e.variation === this.selectedVariation);

    if (test == -1) {
      this.selectedVariations.push({variation:this.selectedVariation,qty:this.qtyVariation});
      this.updateVariationTest=true;

    }else{
      this.selectedVariations[test].qty=this.qtyVariation;
    }
     this.totalcalc();

  }
  totalcalc(){
    this.totalvariation=0;
    this.selectedVariations.forEach(element => {
      this.totalvariation= this.totalvariation+(Number(element.variation.price)*element.qty);
    });
  }
  incvariation(){
    if (this.selectedVariation.stock_status == 'instock') {
      if (this.selectedVariation.stock_quantity== null || this.selectedVariation.stock_quantity > this.qtyVariation) {
        this.qtyVariation++;
      }else{
        alert('En rupture de stock');
      }

    }else{
      alert('En rupture de stock');
    }

  }



  onChangeVariation(newValue:any) {
    let vario = this.variations.filter((variable)=>variable.sku.includes(this.selectedVariationoption));
    console.log(vario[0]);
    this.qtyVariation=1;
    let test=this.selectedVariations.find(e => e.variation === vario[0]);

    if (test != undefined) {

      this.qtyVariation=test.qty;
      this.updateVariationTest=true;
    }else{
      this.updateVariationTest=false;
    }
    this.selectedVariation = vario[0];
    // ... do other stuff here ...
}

  isexistfund(){
    return localStorage.getItem("fund");
  }
  fermercaisse(){
    let funds = [];

    let fundd :Fund= new Fund();
    let today= new Date();
    let  dateFermetur=formatDate(today, 'dd-MM-yyyy hh:mm ', 'en-US');
    let fundsArray = JSON.parse(String(localStorage.getItem('fundsArray')));
    // console.log("array",fundsArray);
for (let index = 0; index < fundsArray.length; index++) {
  if (JSON.parse(fundsArray[index]).name == localStorage.getItem('fund')) {
    fundd=JSON.parse(fundsArray[index]);
    fundd.dateFermetur=String(dateFermetur);
  }else{
    funds.push(JSON.stringify(fundsArray[index]));
  }

}
if (funds.length==0) {
   localStorage.removeItem('fundsArray');
}else{
   localStorage.setItem("fundsArray", JSON.stringify(funds));
}
// console.log("array to push",funds);
// console.log("fund to affiche",fundd);

      let productsO=JSON.parse(String(localStorage.getItem('productsO')))
      this.printer.printFinal(productsO,fundd);
        Swal.fire({
          title: 'bilan',
          html: `

            <pre><code>Le nom de l'utilisateur: ${fundd.name}</code></pre>
            <pre><code>Date d'ouverture: ${fundd.dateOvertur}</code></pre>
            <pre><code>Date de fermeture: ${fundd.dateFermetur}</code></pre>
            <pre><code>Bénifice: ${fundd.turnover} MAD</code></pre>
            <pre><code>fond de caisse initial: ${fundd.fund} MAD</code></pre>
            <pre><code>total: ${fundd.fund+fundd.turnover} MAD</code></pre>

          `,
          confirmButtonText: 'bien reçu'
        });
        localStorage.removeItem('fund');
        localStorage.removeItem('productsO');
        this.viderCart();
  }
  public async saveFile(fileName: string): Promise<void> {
      if (!isNaN(+fileName) ) {
        // localStorage.removeItem('fundsArray');

        let fund :Fund= new Fund();
        let today= new Date();
        fund.fund=Number(fileName);
        fund.name=String(localStorage.getItem('currentUsername'));
        fund.user_id=Number(localStorage.getItem('currentUser'));
        fund.dateOvertur=formatDate(today, 'dd-MM-yyyy hh:mm', 'en-US');




        if (! localStorage.getItem('fundsArray')) {
          let funds = [];
          funds[0]=JSON.stringify(fund);

          localStorage.setItem("fundsArray", JSON.stringify(funds));

        }else{

          let storedFunds = [];
          storedFunds = JSON.parse(String(localStorage.getItem('fundsArray')));
          storedFunds.push(JSON.stringify(fund));
           localStorage.setItem("fundsArray", JSON.stringify(storedFunds));

        }
        var ret = JSON.parse(String(localStorage.getItem('fundsArray')));

        let data=JSON.parse(ret[ret.length-1]);

        localStorage.setItem('fund',String(data.name));

              Swal.fire({
            icon: 'success',
            title: 'caisse ouverte',
            showConfirmButton: false,
            timer: 1500
        })

      }else{
        // Swal.fire({title: 'Ouverture de la caisse (Essayer de saisir une valeur correct)', input: 'text', showDenyButton: true, denyButtonText: 'Annuler'});
        let { value: text } = await Swal.fire({
          title: 'Ouverture de la caisse (Essayer de saisir une valeur correct)',
           denyButtonText: 'Annuler',
          input: 'text'
        })

        if (text) {
          this.saveFile(text)

        }
        // Swal.update({
        //   icon: 'success'
        // })
      }

  }

  public handleDenial(): void {
      // ... don't save file and quit
  }

//   async preinsert(payement:string){
//   if (payement=='carte') {
//     let { value: text } = await Swal.fire({
//       title: 'veuillez saisir le numéro de transaction',
//        denyButtonText: 'Annuler',
//       input: 'text'
//     })

//     if (text) {
//       this.myOrder.transaction_id=text;
//       this.insertorder(payement);
//     }
//   }else{
//     let { value: text } = await Swal.fire({
//       title: 'veuillez saisir le montant du client',
//        denyButtonText: 'Annuler',
//       input: 'text'
//     })

//     if (text) {
//       this.montantclient=Number(text);
//       if (this.montantclient < this.total) {
//         this.preinsert(payement)
//       }else{
//         this.insertorder(payement);
//       }

//     }
//   }
// }


  insertorder(){
      this.showloader=true;
      this.myOrder.payment_method='Espèce';
      this.myOrder.total=this.total;
      this.myOrder.line_items=[new Item];
      this.myOrder.customer_id=Number(localStorage.getItem('currentUser'));
      for (let i = 0; i < this.carts.length; i++) {
        // this.item.product_id=;
        // this.item.quantity=;
        // this.item.name=this.carts[i].name;
        this.myOrder.line_items.push({"product_id":this.carts[i].product_id,"quantity":this.carts[i].qtt,"name":this.carts[i].name,"price":this.carts[i].price,total:String(this.carts[i].price*this.carts[i].qtt),"variation_id":this.carts[i].variation_id});

      }

      this.produitService.persist(this.myOrder).subscribe((order)=>{
     this.printer.print(order,this.montantclient);
     for (let i = 0; i < this.carts.length; i++) {

      if (! localStorage.getItem('productsO')) {
        localStorage.setItem("productsO", JSON.stringify([{id:this.carts[i].product_id,name:this.carts[i].name,qty:this.carts[i].qtt,prix:this.carts[i].price,ttl:this.carts[i].price*this.carts[i].qtt}]));
      }else{
        let productsO : Produitpanier [];
        productsO = JSON.parse(String(localStorage.getItem('productsO'))) ;

           let pro : Produitpanier= new Produitpanier();
           pro =   productsO.filter(productO => productO.id === this.carts[i].product_id)[0] ;

           if (pro) {
            var index = productsO.indexOf(pro);
            productsO[index].qty=productsO[index].qty+this.carts[i].qtt;
            productsO[index].ttl=productsO[index].prix * productsO[index].qty;
           }else{
            productsO.push({id:this.carts[i].product_id,name:this.carts[i].name,qty:this.carts[i].qtt,prix:this.carts[i].price,ttl:this.carts[i].price*this.carts[i].qtt});

           }

           localStorage.setItem("productsO", JSON.stringify(productsO));


      }
    }
    // JSON.parse(String(localStorage.getItem('productsO')))

    // if (! localStorage.getItem('productsO')) {
    //   localStorage.setItem("productsO", JSON.stringify([{name:'name',qty:1,prix:30,ttl:30}]));
    // }else{
    //   let storedFunds = [];
    //   storedFunds = JSON.parse(String(localStorage.getItem('fundsArray')));
    //   storedFunds.push(JSON.stringify([item]));
    //    localStorage.setItem("fundsArray", JSON.stringify(storedFunds));
    // }


     let fundsArray = JSON.parse(String(localStorage.getItem('fundsArray')));
     let funds = [];
     let fundd :Fund= new Fund();

 for (let index = 0; index < fundsArray.length; index++) {
   if (JSON.parse(fundsArray[index]).name == localStorage.getItem('fund')) {
     fundd=JSON.parse(fundsArray[index]);
     fundd.turnover+=this.myOrder.total;

     funds.push(JSON.stringify(fundd));
   }else{
     funds.push(JSON.stringify(fundsArray[index]));
   }

 }
 localStorage.setItem("fundsArray", JSON.stringify(funds));


      this.viderCart();
      this.showloader=false;
    })





  }
  getProduits(page:number){

    let totalage=0;
    this.produitService.findall(page).subscribe(response => {

    this.resultProduits=this.produits = this.produits.concat(<Produit[]>response.body);

      totalage=Number(response.headers.get("X-WP-Total"));



    if (this.produits.length < totalage) {

      this.getProduits(page+1);
    }
    });


  }
  searchProduits(){

    // this.produitService.search(this.searchText).subscribe(response =>{


    // })
    //console.log(this.resultProduits);
    this.resultProduits =this.produits.filter((produit)=>produit.sku.includes(this.searchText));
    if (this.resultProduits.length==1 && this.resultProduits[0].sku==this.searchText) {
      // this.addToCart(this.resultProduits[0],1);
       this.inc(this.resultProduits[0],this.resultProduits[0].id);
       this.resultProduits=this.produits;
       this.searchText='';
    }else if(this.resultProduits.length==0 ){
      this.produitService.search(this.searchText).subscribe(
        data => {
         console.log(data.body);
         let variations=<Variation[]>data.body;
         if (variations.length==1) {
           if (variations[0].stock_status=="instock" || this.variations[0].stock_quantity > 0) {
            let objcart = new Cart(1,variations[0].parent_id,Number(variations[0].price),variations[0].name,"",Number(variations[0].price),variations[0].id);
            this.carts.push(objcart);
           }else{
            alert("rupture de stock.");
           }

         }else{
           alert("Aucun résultat trouvé. ");

         }



      },
        error => {
          console.log(error);

      });
      this.resultProduits=this.produits;
    }
  }
  getProduitsbyCat(cat:any,page:number){
    let totalage=0;

    this.produitService.findbycat(cat,page).subscribe(response =>{
      if (page==1) {
        this.resultProduits=<Produit[]>response.body;
      }else{
        this.resultProduits=this.resultProduits.concat(<Produit[]>response.body);
      }

      if (this.produits.length < totalage) {

        this.getProduitsbyCat(cat,page+1);
      }


    })

  }
  setvalue(id:number){
    var ret=0;
    if (this.carts.length) {
      for (let i = 0; i < this.carts.length; i++) {


        if (id == this.carts[i].product_id) {

          ret=this.carts[i].qtt;

          return  { state: ret }
        }

      }
    }

    return  { state: ret }
  }
  setclass(id:number){
    var ret="here hidden";
    if (this.carts.length) {
      for (let i = 0; i < this.carts.length; i++) {


        if (id == this.carts[i].product_id) {

          ret="here ";

          return  { state: ret }
        }

      }
    }

    return  { state: ret }
  }
  checkifadded(id:number){
    let resultProduits =this.carts.filter((produit)=>produit.product_id==(id));
    let ret=false;
    if (resultProduits.length>0 ) {
      ret=true

    }


    return  { state: ret }
  }

  getCategories(){
    this.produitService.findallCat().subscribe(categories =>{
      this.resultCategories=categories;

    })
  }
  priceclicked(product_id:number){
  this.inputshowed=product_id;
  }
  inc(produit:any,qtts: any){
    var x = (<HTMLInputElement>document.getElementById('i'+qtts)).value;
    var qtt: number = +x;
    qtt++;

    (<HTMLInputElement>document.getElementById('i'+qtts)).value = String(qtt);

    this.addToCart(produit,qtts);
  }
  chengeprice(produit:Cart){
    let  x =(<HTMLInputElement>document.getElementById('idinput'+produit.product_id)).value ;
    produit.price= parseFloat(x);
    produit.sub=  parseFloat(x)*produit.qtt;
    var num = Number(0.005) // The Number() only visualizes the type and is not needed
var roundedString = this.carts.reduce((a, b) => a+ b.sub , 0).toFixed(2);

    this.total=  Number(roundedString);
    // console.log(produit);
    this.inputshowed=0;

  }
  cancel(){
    this.inputshowed=0;
  }
  dinc(produit:any,qtts: any){
    var x = (<HTMLInputElement>document.getElementById('i'+qtts)).value;
    var qtt: number = +x;
     if (qtt==1) {

      this.deleteFromCart(produit.id );
     }else{
      if (qtt>1) {
        qtt--;
        (<HTMLInputElement>document.getElementById('i'+qtts)).value = String(qtt);
      }
      let test=this.carts.find(e => e.product_id === produit.id);
      if (test == undefined) {
       //console.log('undefined');
      }else{
          test.qtt=qtt;
          test.sub=qtt*test.price;
          this.total=this.carts.reduce((a, b) => a+ b.sub , 0);
      }
     }


  }
  closemodal(){
    let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
        shand[0].style.display = "none";
        this.variations = [];
        this.selectedVariations= [{variation:new Variation,qty:0}];
        this.selectedVariations.splice(0,1);
        this.selectedVariation= new Variation();
        this.totalvariation=0;
        this.qtyVariation=1;
        this.parentProduct={};
        this.updateVariationTest=false;
  }
  updatevariable(produit:Produit,qtts:any){
    console.log("run")
    let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
    shand[0].style.display = "block";
    this.variationService.findall(produit.id).subscribe(
      data => {
console.log("mcha o ja ")
        if (data.length==0) {
          alert('Aucune variation trouvé');
          let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
         shand[0].style.display = "none";
        }else{

          this.parentProduct=produit;
          console.log("parent",this.parentProduct);
          this.variations=data;
          // selectedVariation
          // selectedVariationoption
          this.selectedVariation= this.variations[0];
          this.selectedVariationoption=this.variations[0].sku;

          if (this.parentProduct.images.length > 0) {
            this.selectedVariation.image.src=this.parentProduct.images[0].src;
          }else{
            this.selectedVariation.image={src:""};
          }

          console.log('variable good', this.variations);

          let test =this.carts.filter((prod)=>prod.product_id=== produit.id);
          console.log(test);
          if (test.length>0) {
            console.log('didit1');
            test.forEach(element => {
              let test2=this.variations.filter(e => e.id === element.variation_id);
              if (test2.length>0) {
                console.log(test2);
                test2.forEach(ele => {
                  console.log('didit 2');
                  this.selectedVariations.push({variation:ele ,qty:element.qtt});
                  this.selectedVariationoption=ele.sku;
                  this.selectedVariation=ele;
                  this.updateVariationTest=true;
                  this.qtyVariation=element.qtt;

                });
              }


            });
          }
          // let test=this.carts.find(e => e.product_id === produit.id);

          let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
          shand[0].style.display = "block";
        }


    },
      error => {
        this.dataloadervar=false;
         console.log('oops', error);


    });
  }
  addToCart(produit:any,qtts:any){
    if (!localStorage.getItem("fund")) {
      Swal.fire({
        title: "المرجو أن تفتح الصندوق قبل بدأ العمل",

        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'إفتح الصندوق'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let { value: text } = await Swal.fire({
            title: 'إفتح الصندوق',
             denyButtonText: 'Annuler',
            input: 'text'
          })

          if (text) {

            this.saveFile(text)


          }else{
            this.saveFile("0")
          }
        }
      })
    }else{
      if (produit.type=="variable") {
        this.parentProduct=produit;
        // alert('tale3 liya l modal');
        let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
        shand[0].style.display = "block";
        this.variationService.findall(produit.id).subscribe(
          data => {

            if (data.length==0) {
              alert('Aucune variation trouvé');
              let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
             shand[0].style.display = "none";
            }else{

              this.parentProduct=produit;
              console.log("parent",this.parentProduct);
              this.variations=data;
              // selectedVariation
              // selectedVariationoption
              this.selectedVariation= this.variations[0];
              this.selectedVariationoption=this.variations[0].sku;

              if (this.parentProduct.images.length > 0) {
                this.selectedVariation.image.src=this.parentProduct.images[0].src;
              }else{
                this.selectedVariation.image={src:""};
              }

              console.log('variable good', this.variations);
              let test =this.carts.filter((prod)=>prod.product_id=== produit.id);

              if (test.length>0) {

                test.forEach(element => {
                  let test2=this.variations.filter(e => e.id === element.variation_id);
                  if (test2.length>0) {

                    test2.forEach(ele => {
                      console.log('didit 2');
                      this.selectedVariations.push({variation:ele ,qty:element.qtt});
                      this.selectedVariationoption=ele.sku;
                      this.selectedVariation=ele;
                      this.updateVariationTest=true;
                      this.qtyVariation=element.qtt;

                    });
                  }


                });
              }

              let shand = document.getElementsByClassName('modal2') as HTMLCollectionOf<HTMLElement>;
              shand[0].style.display = "block";
            }


        },
          error => {
            this.dataloadervar=false;
             console.log('oops', error);


        });



      }else{
        var x = (<HTMLInputElement>document.getElementById('i'+qtts)).value;
        var qtt: number = +x;


      let test=this.carts.find(e => e.product_id === produit.id);

      if (test == undefined) {

        if(produit.stock_status=="instock"){
          qtt=1;
          let objcart = new Cart(qtt,produit.id,produit.price,produit.name,"",qtt*produit.price,0);
          this.carts.push(objcart);
          this.total=this.carts.reduce((a, b) => a+ b.sub , 0);
          this.showaddcard(qtts);
        }else{

          alert(produit.stock_status);
        }

      }else{


        if (test.qtt+qtt <= produit.stock_quantity || produit.stock_quantity==null) {


          test.qtt=qtt;
          test.sub=qtt*test.price;

          this.total=this.carts.reduce((a, b) => a+ b.sub , 0);
          this.showaddcard(qtts);
        }else{

          alert(produit.stock_status);
        }

      }
      }

    }




  }
  deleteFromCart(id:any){



    const index = this.carts.findIndex(x => x.product_id === id );
      //     const index= this.carts.findIndex(x => x.product_id === produit.id );
    //console.log(index);
    //console.log(id);



     this.carts.splice(index, 1);

      this.total=this.carts.reduce((a, b) => a+ b.sub , 0);
       (<HTMLInputElement>document.getElementById('i'+id)).value="0";

       this.hideaddcard(id);



  }
  viderCart(){


    for (let i = 0; i < this.produits.length; i++) {

      (<HTMLInputElement>document.getElementById('i'+this.produits[i].id)).value="1";
      this.hideaddcard(this.produits[i].id)
    }
    this.carts=[];
    this.total=0;
    this.myOrder.line_items=[new Item];

  }
  showaddcard(id :number){

    let layer = document.getElementsByClassName(String(id)) as HTMLCollectionOf<HTMLElement>;

if (layer.length != 0) {
  layer[0].classList.remove('hidden') ;



}

  }
  hideaddcard(id :number){


    let layer = document.getElementsByClassName(String(id)) as HTMLCollectionOf<HTMLElement>;

if (layer.length != 0) {
  //console.log("hideaddcard",id);
  layer[0].classList.add('hidden') ;


}

  }

}
