import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { ThermalPrintModule } from 'ng-thermal-print';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { ProduitComponent } from './components/produit/produit.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { RefundComponent } from './components/refund/refund.component';

import {DataViewModule} from 'primeng/dataview';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {OrderListModule} from 'primeng/orderlist';
import { BackComponent } from './components/back/back.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ImportComponent } from './components/import/import.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {ProgressBarModule} from 'primeng/progressbar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {ListboxModule} from 'primeng/listbox';
import {TabMenuModule} from 'primeng/tabmenu';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';



@NgModule({
  declarations: [
    AppComponent,

    ProduitComponent,

    OrderComponent,

    OrderDetailComponent,

    RefundComponent,

    BackComponent,

    LoginComponent,

    LogoutComponent,

    ImportComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxDatatableModule,
    ThermalPrintModule,
    DataViewModule,
    TableModule,
    ButtonModule,
    OrderListModule,
    FileUploadModule,
    ProgressBarModule,
    NgMultiSelectDropDownModule.forRoot(),
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    TabMenuModule,
    ListboxModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    DialogModule,
    BrowserAnimationsModule,
    InputTextModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
