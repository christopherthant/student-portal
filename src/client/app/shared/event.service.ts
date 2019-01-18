import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventService {
  public toggleMenu: EventEmitter<any> = new EventEmitter();
  public clickMenu: EventEmitter<any> = new EventEmitter();
  public deviceList: EventEmitter<any> = new EventEmitter();
  public subMenu: EventEmitter<any> = new EventEmitter();

  getToggleMenuEmitter() {
    return this.toggleMenu;
  }

  getMenuChangeEmitter() {
    return this.clickMenu;
  }

  getdeviceListEmitter() {
    return this.deviceList;
  }  

  getSubMenuEmitter() {
    return this.subMenu;
  }
}