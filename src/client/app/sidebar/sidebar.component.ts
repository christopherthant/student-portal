import { Component, OnInit } from '@angular/core';
import { ApiService } from './../shared/api.service';
import { AuthService } from './../shared/auth.service';
import { GuacamoleService } from './../services/guacamole/guacamole.service';
import { EventService } from './../shared/event.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  view = 'lab';
  subView = 'topology';
  expand = true;
  isOpen = true;
  devices: any[];
  instructor: false;
  isError: boolean = false;

  constructor(private apiService: ApiService,
              private auth: AuthService,
              private eventService: EventService,
              private guacamoleService: GuacamoleService,
              private appComponent: AppComponent) {
  }

  ngOnInit() {
   let userInfo = JSON.parse(this.auth.getStorage('user-info'));
   this.instructor = userInfo.instructor_markdown;

    this.eventService.getSubMenuEmitter()
      .subscribe(view => {      
        this.view = view.menu;
        this.subView = view.submenu;
      });        

    this.apiService.get('devices')
      .subscribe(
        data => {
          this.isError = false;
          this.auth.setGuacdToken(data.guacdToken);
          this.devices = data.devices;
          this.eventService.deviceList.emit(data);
        },
        error => {
          this.isError = true;
        });
  }

  toogleSideMenu() {
    this.isOpen = !this.isOpen;
    this.appComponent.toggleMenu();
  }

  showPanel(menu, submenu) {
    if (this.view != menu || this.subView != submenu) {
      this.devices.map(function (d) {
        d.selected = false;
      });      
      this.view = menu;
      this.subView = submenu;
      this.eventService.clickMenu.emit({'menu': menu, 'submenu': submenu});
    }
  }

  toggleMenu(menu, submenu) {
    if (this.view == menu) {
      this.expand = !this.expand;
    } else {
      this.view = menu;
      this.subView = submenu;
      this.expand = true;
      this.devices.map(function (d) {
        d.selected = false;
      });           
      this.eventService.clickMenu.emit({'menu': menu, 'submenu': submenu});
    }
  }

  connect(device) {
    this.devices.map(function (d) {
      d.selected = false;
    });
    device.selected = true;

    if (device.connected) {
      let client = this.guacamoleService.clients['WINSERVER'];
      
      this.guacamoleService.sendClipboard(client, "test");
      //this.view = 'device';
      //this.subView = 'connect-to-device';       
      //this.eventService.clickMenu.emit({'menu': 'machine', 'submenu': 'machine', 'device': device});
      //this.eventService.clickMenu.emit({'menu': 'device', 'submenu': 'connect-to-device', 'device': device});
    } else {
      this.view = 'machine';
      this.subView = 'machine';       
      this.eventService.clickMenu.emit({'menu': 'machine', 'submenu': 'machine', 'device': device});
    }
  }

  initConnect(device) {
    this.devices.map(function (d) {
      d.selected = false;
    });
    device.selected = true;

    if (device.connected) {
      this.view = 'machine';
      this.subView = 'machine';         
      this.eventService.clickMenu.emit({'menu': 'machine', 'submenu': 'machine', 'show': true, 'device': device});
    } else {
      this.view = 'device';
      this.subView = 'connect-to-device';         
      this.eventService.clickMenu.emit({'menu': 'device', 'submenu': 'connect-to-device', 'device': device});
    }
  }

  fullscreen(device) {
    if(device.connected) {
      this.view = 'device';
      this.subView = 'connect-to-device';       
      this.eventService.clickMenu.emit({'menu': 'machine', 'submenu': 'machine', 'device': device});
      this.eventService.clickMenu.emit({'menu': 'device', 'submenu': 'connect-to-device', 'device': device});
      window.open('fullscreen?id=' + encodeURIComponent(device.identifier) + "&name=" + encodeURIComponent(device.name)+ "&display_name=" + encodeURIComponent(device.display_name));
    }
  }
  
  setting(device) {

  }
}

