import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../shared/api.service';
import { AuthService } from './../shared/auth.service';
import { EventService } from './../shared/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  @Input() defaultView: any;
  active = false;
  public support: any;
    
  constructor(
    public apiService: ApiService,
    public eventService: EventService,
    public authService: AuthService
  ) { }

  public ngOnInit() {
    this.eventService.getMenuChangeEmitter()
    .subscribe(view => {        
      this.defaultView = view;
    });     
    let userInfo = JSON.parse(this.authService.getStorage('user-info'));

    const supportPayload = {
      type: 'support',
      name: 'support.md'
    };   
    this.apiService.post('file', supportPayload)
      .subscribe(data => {
        this.support = data.support;
      });      
  }
}
