import { Component, OnInit, Input } from '@angular/core';
import { EventService } from './../shared/event.service';

@Component({
  selector: 'app-panel-device',
  templateUrl: './panel-device.component.html',
  styleUrls: ['./panel-device.component.scss']
})
export class PanelDeviceComponent implements OnInit {
  @Input() defaultView: any;
  constructor(public eventService: EventService) { }

  ngOnInit() {
    this.eventService.getMenuChangeEmitter()
    .subscribe(view => {
      this.defaultView = view;
      if (view.menu === 'device') {
        view.device.connected = false;
      }
    });
  }

  connect(device) {
    this.eventService.clickMenu.emit({'menu': 'machine', 'submenu': 'machine', 'device': device});
  }  
}
