import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { ApiService } from '../../shared/api.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  username = '';
  invalidUser: boolean = true;
  errorMessage: string = '';
  isFocused: boolean = false;

 constructor(
    private api: ApiService,     
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
   ) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
      this.username = params['username'] || '';
    });
    
    if(this.username) {
      this.login(event);
    }

    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  login(event) {
    if(this.username) {
      const payload = {
        username: this.username,
        ttl: moment().utc().format('MM/DD/YYYY HH:mm:ss')
      };

      this.api.post('authenticate', payload)
      .subscribe(
        data => {
          this.auth.setToken(data.token);
          this.auth.setStorage("user-info", JSON.stringify(data));
        },
        error => {
          this.errorMessage =  'User ID is not valid.';
        },
        () => {
          this.errorMessage = '';
          this.router.navigate(['/home']);
        }
        
      );
    }else {
      this.errorMessage =  'User ID field can not be empty.';
    }
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.login(event);
    }
  }

  onFocus() {
    this.isFocused = true;
  }
  
  onBlur() {
    this.isFocused = false;
  }
}

