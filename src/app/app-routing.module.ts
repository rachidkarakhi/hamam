import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportComponent } from './components/import/import.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderComponent } from './components/order/order.component';
import { ProduitComponent } from './components/produit/produit.component';
import { RefundComponent } from './components/refund/refund.component';

const routes: Routes = [
  {path:'orders',component:OrderComponent},
  {path:'',component:ProduitComponent},
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'refunds/:id', component: RefundComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'import', component: ImportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
