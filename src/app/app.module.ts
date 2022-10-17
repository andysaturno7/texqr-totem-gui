import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { ListComponent } from './components/list/list.component';
import { SearchPipe } from './pipes/search.pipe';
import { ClientLayoutComponent } from './components/client-layout/client-layout.component';
import { DataViewComponent } from './components/data-view/data-view.component';
import { SideClientComponent } from './components/side-client/side-client.component';
import { LoadDataViewComponent } from './components/load-data-view/load-data-view.component';
import { MainClientComponent } from './components/main-client/main-client.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { InputQrComponent } from './components/input-qr/input-qr.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BtnFocusComponent } from './components/btn-focus/btn-focus.component';
import { JwtAuthInterceptor } from './interceptors/jwt-auth.interceptor';

declare const Buffer: any;

export function init() {
  if ((<any>window).require) {
    let electron = (<any>window).require('electron');
    let settings = electron.ipcRenderer.sendSync('get_settings');
    settings = Buffer.from(settings).toString('utf8');
    settings = JSON.parse(settings);
    return settings;
  } else {
    return {
      uri: 'http://localhost:5050',
      systemName: 'developSystemName',
      roomId: 'cf99e814-e7c0-4e91-8528-526854c219d9',
      projectId: 'caeda470-7864-47f0-86ab-062232e9a4e7',
      authToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImIyZDkzMjQ5LWExYmQtNGFlOC05ZWE4LWJlNmEzZmY2OGNlZiIsImZpcnN0TmFtZSI6IkFkbWluaXN0cmFkb3IiLCJsYXN0TmFtZSI6bnVsbCwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiY3JlYXRlZEF0IjoiMjAyMi0wNC0yOVQwMzoxMjozMC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0wNC0yOVQwMzoxMjozMC4wMDBaIn0.Ip-J7CKo3_7kW7suoQbE7rs_-94BAPCeFCtP122ZTSE',
    };
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    SearchPipe,
    ClientLayoutComponent,
    DataViewComponent,
    SideClientComponent,
    LoadDataViewComponent,
    MainClientComponent,
    InputQrComponent,
    BtnFocusComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    FormlyModule.forRoot({ extras: { lazyRender: true } }),
    SweetAlert2Module.forRoot(),
    // SocketIoModule.forRoot(config),
    HttpClientModule,
  ],
  providers: [
    {
      provide: 'API_CONF',
      useValue: init(),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtAuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
