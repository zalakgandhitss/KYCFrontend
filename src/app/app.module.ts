import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './home/file-upload/file-upload.component';
import { FormsModule } from '@angular/forms'; 
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      HomeModule,
      FormsModule,WebcamModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
