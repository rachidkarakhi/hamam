import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import {Router} from "@angular/router"
import { AuthService } from 'src/app/services/auth.service';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  admin='';
  constructor(private  orderService:OrderService,private router: Router,private authService:AuthService) {
    if (! localStorage.getItem('currentUser')) {
      this.router.navigate(['/login']);
    }else{
      this.admin=String(localStorage.getItem('currentUsername'));

    }
   }
  searchText='';
  showForm=false;
  loader=true;
  orders: Order[]=[];
  resultOrders: Order[]=[];
  order=new Order();
  showOrder= false;
  myOrder=new Order();
  users: any[]=[];
  navitems: MenuItem[]=[];


  ngOnInit(): void {
    this.getOrders(1);
    this.getUsers();
  this.navitems = [
      {label: 'حمام', icon: 'pi pi-fw pi-home',routerLink: ['/']},
      {label: 'المنتجات', icon: 'pi pi-shopping-cart',routerLink: ['/']},
      {label: 'الطلبيات', icon: 'pi pi-list',routerLink: ['/orders']},
      {label: 'تسجيل الخروج', icon: 'pi pi-sign-out',routerLink: ['/logout']}
  ];
  }

  getUsers(){
    this.authService.getusers().subscribe(
      data => {
      this.users=data;

    },
      error => {
         console.log('oops', error);


    }

    )
  }

  setclass(id:number){
    var ret="uknown";
    const index = this.users.findIndex(x => x.id === id );
    if (index<0) {
       ret="uknown";
    }else{
       ret=this.users[index].name;
    }



    return  { state: ret }
  }

  getOrders(page:number){
    let totalage=0;
    this.orderService.findall(page).subscribe(response =>{
      this.resultOrders=this.orders=this.orders.concat(<Order[]>response.body);
      totalage=Number(response.headers.get("X-WP-Total"));
      if (this.orders.length < totalage) {

        this.getOrders(page+1);

      }
      this.loader=false;
    })

  }

  searchOrders(){
    this.resultOrders =this.orders.filter((orders)=>String(orders.id).includes(this.searchText));
  }



  updateOrder(row:Order,status:string){


    this.orderService.updateqty(row.id,status).subscribe((order) =>{

     let index=this.resultOrders.indexOf(row);
      this.resultOrders[index].status=status;
      console.log(order);
    })





  }
}
