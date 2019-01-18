
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgxMdModule } from 'ngx-md';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';

import { TitleService } from './shared/title.service';
import { EventService } from './shared/event.service';
import { ApiService } from './shared/api.service';
import { AuthService } from './shared/auth.service';
import { GuacamoleService } from './services/guacamole/guacamole.service';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { NotificationDialog } from './components/notification/notification.component';
import { ConfirmationDialog } from './components/confirmation/confirmation.component';

import { AuthGuard } from './auth.guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PanelLabComponent } from './panel-lab/panel-lab.component';
import { PanelSettingsComponent } from './panel-settings/panel-settings.component';
import { SupportComponent } from './support/support.component';
import { PanelMachineComponent } from './panel-machine/panel-machine.component';
import { PanelDeviceComponent } from './panel-device/panel-device.component';
import { FullscreenComponent } from './pages/fullscreen/fullscreen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    MainComponent,
    SidebarComponent,
    PanelLabComponent,
    PanelSettingsComponent,
    SupportComponent,
    PanelMachineComponent,
    PanelDeviceComponent,
    FullscreenComponent,
    NotificationDialog,    
    ConfirmationDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,  
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    NgxMdModule.forRoot(),
  ],
  providers: [TitleService,
    EventService,
    ApiService,
    AuthService,
    AuthGuard,
    GuacamoleService,
    MainComponent,
    PanelDeviceComponent,
    PanelLabComponent,
    PanelSettingsComponent,
    SupportComponent,
    PanelMachineComponent],
  bootstrap: [AppComponent],
  entryComponents: [NotificationDialog, ConfirmationDialog],
})

export class AppModule {
}
