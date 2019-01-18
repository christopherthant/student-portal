import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GuacamoleService } from './../services/guacamole/guacamole.service';

declare var Guacamole;

@Injectable()
export class AuthService {

  storageKey: string = 'student-portal-token';
  guacamoleKey: string = 'guacamole-token';
  userNameKey: string = 'username';

  constructor( 
    private router: Router,
    private guacamoleService: GuacamoleService
  ) { }

  setUsername(token: string) {
    sessionStorage.setItem(this.userNameKey, token);
  }

  getUsername() {
    return sessionStorage.getItem(this.userNameKey);
  }

  setToken(token: string) {
    sessionStorage.setItem(this.storageKey, token);
  }

  getToken() {
    return sessionStorage.getItem(this.storageKey);
  }
  
  setGuacdToken(token: string) {
    sessionStorage.setItem(this.guacamoleKey, token);
  }

  getGuacdToken() {
    return sessionStorage.getItem(this.guacamoleKey);
  }

  setStorage(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  getStorage(key: string) {
    return sessionStorage.getItem(key);
  }  

  isLoggedIn() {
    return this.getToken() !== null;
  }
  
  logout() {
    Object.keys(this.guacamoleService.clients).forEach(key => {
      this.guacamoleService.clients[key].disconnect();
      let elem = document.getElementById(key);
      if(elem) {
        elem.outerHTML = "";
      }
    });
    this.guacamoleService.clients = {};
    sessionStorage.clear();
    window.location.href = '/login';
  }

}
