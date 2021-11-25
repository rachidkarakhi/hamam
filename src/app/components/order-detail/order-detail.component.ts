import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import { Item } from 'src/app/models/item';
import { LineItem } from 'src/app/models/line-item';
import { Order } from 'src/app/models/order';
import { Refund } from 'src/app/models/refund';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
    admin='';
  constructor(private  fundService:FundService,private  orderService:OrderService,private route: ActivatedRoute,private location: Location,private router: Router) {
    if (! localStorage.getItem('currentUser')) {
      this.router.navigate(['/login']);
    }else{
      this.admin=String(localStorage.getItem('currentUsername'));

    }
   }
  selectedItems=new Array<number>();
  line_items=new Array<Item>();
  showm=false;
  loader=true;

  id:any;
  qtyForm=false;
  order=new Order();
  manually=false;
  myRefund=new Refund();
  myOrder=new Order();
  old_line_items=new Array<Item>();
  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');
    this.retieveOrders();
  }
  retieveOrders(){
    this.orderService.getOrder(this.id).subscribe((order: Order) =>{
      this.order=order;


      this.old_line_items = order.line_items.map(x => Object.assign({}, x));
      console.log(this.order);
      console.log(this.old_line_items);
      this.loader=false;
    })

  }
  updateOrder(line_items:any,id:any){
    // console.log(order);
    // console.log(id);
    let total=0;
    for (let i = 0; i < line_items.length;i++) {
      let x = (<HTMLInputElement>document.getElementById('i'+line_items[i].id)).value;
      line_items[i].quantity=x;
      line_items[i].total=String(line_items[i].quantity * line_items[i].price) ;

    total+=(line_items[i].quantity * line_items[i].price);

    }


    this.order.total=total;
    this.myOrder.line_items=line_items;
    this.myOrder.total=total;
    console.log( this.myOrder);
    this.orderService.updateqty(this.myOrder,id).subscribe((order) =>{

      console.log(order);
    })

    console.log( this.myOrder);



  }


  deleteRefund(id:any){
    this.orderService.deleteRefund(this.id,id).subscribe((refund)=>{

        // this.order.refunds.reduce=this.order.refunds.filter(m=>m.id!=refund.id);

      console.log("refund successfully deleted", refund);
    })
  }
  getAlineId(e:any,id:number){
    if (e.target.checked) {
      console.log(id + 'cheked');
      this.selectedItems.push(id);
    }else{
      this.selectedItems=this.selectedItems.filter(m=>m!=id);
      console.log(id + 'Uncheked');
    }
    console.log(this.selectedItems);
  }

  inc(produit:Item){


    let selectedItem=this.line_items.filter(m=>m.product_id==produit.product_id);
    console.log(selectedItem);
    let selectedOLDItem=this.old_line_items.filter(m=>m.product_id==produit.product_id);

    console.log(selectedOLDItem);
    let index = this.line_items.indexOf(selectedItem[0]);

     let oldindex = this.old_line_items.indexOf(selectedOLDItem[0]);

     let orderitem=this.order.line_items.filter(m=>m.product_id==produit.product_id);
     let indexorderitem = this.order.line_items.indexOf(orderitem[0]);

    if ((produit.quantity+1) > this.old_line_items[oldindex].quantity ) {
    console.log("error");
    }else{
       this.order.line_items[indexorderitem].quantity=this.order.line_items[indexorderitem].quantity+1;

      if (this.old_line_items[oldindex].quantity == this.order.line_items[indexorderitem].quantity) {

        // this.order.line_items[indexorderitem].quantity=this.order.line_items[indexorderitem].quantity+11;


        this.line_items.splice(index, 1);
        console.log('spliced');
      }else{


            if(selectedItem.length ==0 ){

              this.line_items.push(produit);
              console.log('pushed');
            }else{
              this.line_items[index].quantity+=1;
              console.log('inc');

            }
      }
    }

    this.myRefund.amount= String(-this.line_items.reduce((a, b) => a+ (b.price*b.quantity) , 0));
    this.manually=false;

  }
  dinc(produit:Item){

    console.log(produit);
    let selectedItem=this.line_items.filter(m=>m.product_id==produit.product_id);
    let selectedOLDItem=this.old_line_items.filter(m=>m.product_id==produit.product_id);
    let index = this.line_items.indexOf(selectedItem[0]);
    let oldindex = this.old_line_items.indexOf(selectedOLDItem[0]);


    let orderitem=this.order.line_items.filter(m=>m.product_id==produit.product_id);
    let indexorderitem = this.order.line_items.indexOf(orderitem[0]);


     if ((produit.quantity-1) < 0) {
  console.log('error')
     }else{

      this.order.line_items[indexorderitem].quantity=this.order.line_items[indexorderitem].quantity-1;

      if (this.old_line_items[oldindex].quantity == this.order.line_items[indexorderitem].quantity) {
        this.order.line_items[indexorderitem].quantity=this.order.line_items[indexorderitem].quantity+1;
        this.line_items.splice(index, 1);
        console.log('spliced');
      }else{


            if(selectedItem.length ==0 ){

              this.line_items.push({'id':this.order.line_items[indexorderitem].id,'product_id': this.order.line_items[indexorderitem].product_id,quantity:-1,name: this.order.line_items[indexorderitem].name,price: this.order.line_items[indexorderitem].price,total:String(-this.order.line_items[indexorderitem].price),variation_id:this.order.line_items[indexorderitem].variation_id});
              console.log('pushed');
            }else{
               this.line_items[index].quantity-=1;
              console.log('inc');

            }
      }
     }

     this.myRefund.amount=String(-this.line_items.reduce((a, b) => a+ (b.price*b.quantity) , 0));
     this.manually=false;

  }
  deleteFromRefund(produit:Item){
    let selectedItem=this.line_items.filter(m=>m.product_id==produit.product_id);

    let selectedOLDItem=this.old_line_items.filter(m=>m.product_id==produit.product_id);
    let orderitem=this.order.line_items.filter(m=>m.product_id==produit.product_id);
    let orderitemindex = this.order.line_items.indexOf(orderitem[0]);
    let index = this.line_items.indexOf(selectedItem[0]);
     let oldindex = this.old_line_items.indexOf(selectedOLDItem[0]);
     if (orderitemindex == -1) {
      this.order.line_items.push({'product_id': this.line_items[index].product_id,quantity:-this.line_items[index].quantity,name: this.line_items[index].name,price: this.line_items[index].price,total:String(- this.line_items[index].price*this.line_items[index].quantity),variation_id:this.line_items[index].variation_id});

     }else{
      this.order.line_items[orderitemindex].quantity=this.old_line_items[oldindex].quantity;
      this.order.line_items[orderitemindex].total=String(this.order.line_items[orderitemindex].total);
     }

     this.line_items.splice(index, 1);
     this.myRefund.amount=String(-this.line_items.reduce((a, b) => a+ (b.price*b.quantity) , 0));
     this.manually=false;

  }
  deleteFromorder(produit:Item){

    let orderitem=this.order.line_items.filter(m=>m.product_id==produit.product_id);
    let orderitemindex = this.order.line_items.indexOf(orderitem[0]);

    let selectedItem=this.line_items.filter(m=>m.product_id==produit.product_id);

    let index = this.line_items.indexOf(selectedItem[0]);



    if(selectedItem.length ==0 ){

      this.line_items.push({id:this.order.line_items[orderitemindex].id,'product_id': this.order.line_items[orderitemindex].product_id,quantity:-this.order.line_items[orderitemindex].quantity,name: this.order.line_items[orderitemindex].name,price: this.order.line_items[orderitemindex].price,total:String(-this.order.line_items[orderitemindex].price*this.order.line_items[orderitemindex].quantity),variation_id:this.order.line_items[orderitemindex].variation_id});
      console.log('pushed');
    }else{
       this.line_items[index].quantity-=this.order.line_items[orderitemindex].quantity;
       this.line_items[index].total=String(Number(this.line_items[index].total)-(this.order.line_items[orderitemindex].quantity*this.order.line_items[orderitemindex].price));
      console.log('inc');

    }
    this.order.line_items.splice(orderitemindex, 1);
    this.myRefund.amount=String(-this.line_items.reduce((a, b) => a+ (b.price*b.quantity) , 0));
    this.manually=false;
  }
    changetomanually (){
      this.manually=true;
    }
    public async saveFile(fileName: string): Promise<void> {
      if (!isNaN(+fileName) ) {
        let fund :Fund= new Fund();
        let today= new Date();
        fund.fund=Number(fileName);
        fund.name=String(localStorage.getItem('currentUsername'));
        fund.dateOvertur=formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');

        this.fundService.persist(fund).subscribe(
          data => {
           localStorage.setItem('fund',String(data.id));
           Swal.fire({
            icon: 'success',
            title: 'caisse ouverte',
            showConfirmButton: false,
            timer: 1500
        })
        this.insertrefund();
        },
          async error => {
             console.log('oops', error);
             let { value: text } = await Swal.fire({
              title: 'Ouverture de la caisse (Essayer de saisir une valeur correct)',
               denyButtonText: 'Annuler',
              input: 'text'
            })

            if (text) {
              this.saveFile(text)

            }

            }

        )


      }else{
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
    insertrefund(){

      if (!localStorage.getItem("fund")) {
        Swal.fire({
          title: "vous ne pouvez pas passer une commande avant  l'ouverture de la caisse",

          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ouvrir la caisse'

        }).then(async (result) => {
          if (result.isConfirmed) {

            let { value: text } = await Swal.fire({
              title: 'Ouverture de la caisse',
               denyButtonText: 'Annuler',
              input: 'text'
            })

            if (text) {
              this.saveFile(text)

            }

            // Swal.fire({title: 'Ouverture de la caisse', input: 'text', showDenyButton: true, denyButtonText: 'Annuler',});
          }
        })
      }else{
        if (Number(this.myRefund.amount)==0 || isNaN(Number(this.myRefund.amount))) {

          alert("montant de Remboursements non valide ");

         }else{
          this.showm=true;

          var myObject2 = {};



          for (let index = 0; index < this.line_items.length; index++) {

            let myTask:LineItem = {
              [String(this.line_items[index].id)]: {
             "qty":-this.line_items[index].quantity,

          "refund_total": String(-(this.line_items[index].quantity*this.line_items[index].price))
           } };


             myObject2 = Object.assign(myObject2,  myTask);
          }
          console.log(myObject2);
          this.myRefund.line_items=myObject2;
          this.myRefund.refunded_by=Number(localStorage.getItem('currentUser'));

          console.log(this.myRefund);
           this.orderService.insertrefund(this.myRefund,this.id)

           .subscribe(

          (refund)=>{
            if (refund ) {

              let fundsArray = JSON.parse(String(localStorage.getItem('fundsArray')));
              let funds = [];
              let fundd :Fund= new Fund();

          for (let index = 0; index < fundsArray.length; index++) {
            if (JSON.parse(fundsArray[index]).name == localStorage.getItem('fund')) {
              fundd=JSON.parse(fundsArray[index]);
              fundd.turnover-=Number(refund.amount);

              funds.push(JSON.stringify(fundd));
            }else{
              funds.push(JSON.stringify(fundsArray[index]));
            }

          }
          localStorage.setItem("fundsArray", JSON.stringify(funds));


            //   this.fundService.getfund(Number(localStorage.getItem('fund'))).subscribe( data => {


            //     this.fundService.updateTurnoverM(Number(localStorage.getItem('fund')),data.turnover - Number(refund.amount)).subscribe(data =>{
            //       console.log('dazet',data);
            //     })


            // });
              console.log("subb", refund.line_items);
            this.line_items=new Array<Item>();
            this.order=new Order();
            this.manually=false;
           this.old_line_items=new Array<Item>();
           this.myRefund =new Refund();
             this.retieveOrders();
             this.showm=false;
             this.location.back();
            }else{

              // alert('well done');

            }
            // this.updateOrder(this.myOrder.line_items,this.id);



          }

          )

         }
      }






    }

}
