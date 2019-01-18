import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, interval } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { EventService } from '../../shared/event.service';
import { NotificationDialog } from '../../components/notification/notification.component';

import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  dialogRef: MatDialogRef<NotificationDialog>;
  public expiredTime: any;
  public currentTime: any;
  userId: string;
  pod: string;
  totalTime: string;
  remainingTime: any;
  device: any = {
    name: ''
  };

  constructor(
    private eventService: EventService,
    private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }


  ngOnInit() {
    const self = this;
    self.eventService.getMenuChangeEmitter()
      .subscribe(view => {
        if (view.menu === 'machine' || view.menu === 'device') {
          self.device = view.device;
        }else {
          self.device = {
            name: ''
          };
        }
      }); 
    let userInfo = JSON.parse(self.authService.getStorage('user-info'));
    self.userId = userInfo.userName;
    self.pod = userInfo.slot;

    if(userInfo.ttl) {
      self.expiredTime = moment(userInfo.ttl, 'MM/DD/YYYY HH:mm:ss');
      self.currentTime = moment(moment.utc().format('MM/DD/YYYY HH:mm:ss'), 'MM/DD/YYYY HH:mm:ss');
      self.remainingTime = interval(1000)
        .pipe(
          map(res=> {
          self.currentTime =  self.currentTime.add(1, 'seconds');
          let timeLeft = moment.duration(self.expiredTime.diff(self.currentTime, 'seconds'), 'seconds');

          if(timeLeft.days() <= 0 && timeLeft.hours() <= 0 && timeLeft.minutes() <= 0 && timeLeft.seconds() <= 0) {
            self.authService.logout();
          }

          let string:string = '';
          // Days.
          if(timeLeft.days() > 0) 
              string += timeLeft.days() + ' Days';
          // Hours.
          if(timeLeft.hours() > 0) 
              string += ' ' + timeLeft.hours() + ' Hours';
          // Minutes.
          if(timeLeft.minutes() > 0)
              string += ' ' + timeLeft.minutes() + ' Mins';
          // Seconds.
          string += ' ' + timeLeft.seconds(); 
          if(timeLeft.days() == 0 && timeLeft.hours() == 0) {
            if(timeLeft.minutes() == 30 && timeLeft.seconds() == 59) {
              self.showWarning(30);
            } else if(timeLeft.minutes() == 10 && timeLeft.seconds() == 59) {
              self.showWarning(10);
            } else if(timeLeft.minutes() == 1 && timeLeft.seconds() == 59) {
              self.showWarning(1);
            }            
          }
          return string;
        }));     
    }
  }

  public showWarning(session) {
    const self = this;
    self.dialogRef = self.dialog.open(NotificationDialog, {
      disableClose: false,
      panelClass: 'notification'
    });
    let msg = "Your session will expire in ";
    if(session == 1) {
      msg = msg + session + " minute";
    }else {
      msg = msg + session + " minutes";
    }
    self.dialogRef.componentInstance.notificationMessage = msg;

    self.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        
      }
      self.dialogRef = null;
    });
  }
    
  logout() {
    this.authService.logout();
  }
}
