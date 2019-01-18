import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../shared/api.service';
import { AuthService } from './../shared/auth.service';
import { EventService } from './../shared/event.service';
import { Observable } from 'rxjs';

import * as moment from 'moment';

@Component({
  selector: 'app-panel-lab',
  templateUrl: './panel-lab.component.html',
  styleUrls: ['./panel-lab.component.scss']
})
export class PanelLabComponent implements OnInit {
  @Input() defaultView: any;
  public topologyImage: any;
  public labInfo: any;
  public isTopologyError: boolean = false;
  public isLabinfoError: boolean = false;
  public isSessionError: boolean = false;

  public expiredTime: any;
  public currentTime: any;
  public lab: any = {
    labName: '',
    instructorName: '',
    userName: '',
    event: '',
    totalTime: '',
    remainingTime: '',
    startedTimestamp: '',
    endedTimestamp: ''
  };
  public usedSessions: any = [];

  constructor(
    public apiService: ApiService,
    public eventService: EventService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.eventService.getMenuChangeEmitter()
    .subscribe(view => {      
      this.defaultView = view;
    });  

    let userInfo = JSON.parse(this.authService.getStorage('user-info'));
    this.lab.userName = userInfo.userName;
    this.lab.labName = userInfo.program_id;
    this.lab.event = userInfo.event_id;

    const topologyPayload = {
      type: 'diagram',
      name: userInfo.program_id + '.png'
    };    
    this.apiService.post('file', topologyPayload)
      .subscribe(
        data => {
          this.topologyImage = data.topologyImage;
          this.isTopologyError = false;
        },
        error => {
          this.isTopologyError = true;
        });

    const markdownPayload = {
      type: 'labinfo',
      name: 'lab_info.md'
    };   
    this.apiService.post('file', markdownPayload)
      .subscribe(
        data => {
          this.labInfo = data.labInfo;
          this.isLabinfoError = false;
        },
        error => {
          this.isLabinfoError = true;
        });

    this.apiService.get('sessions')
      .subscribe(
        data => {
          this.isSessionError = false;
          if(data.length > 0) {
            for (let session of data) {
              this.usedSessions.push({
                startTime: moment.utc(session.start, 'MM/DD/YYYY HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment.utc(session.end, 'MM/DD/YYYY HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss')
              });         
            }        
          }
        },
        error => {
          this.isSessionError = true;
        });          
  }
  
  public showPanel(menu, submenu) {
    this.defaultView.submenu = submenu;
    this.eventService.subMenu.emit(this.defaultView);
  }
}
