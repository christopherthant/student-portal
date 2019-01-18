import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialog } from './../components/confirmation/confirmation.component';

import { ApiService } from './../shared/api.service';
import { AuthService } from './../shared/auth.service';
import { EventService } from './../shared/event.service';
import { Observable, interval, pipe } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

declare var CONFIG;

@Component({
  selector: 'app-panel-settings',
  templateUrl: './panel-settings.component.html',
  styleUrls: ['./panel-settings.component.scss']
})

export class PanelSettingsComponent implements OnInit {
  @Input() defaultView: any;
  active = false;
  dialogRef: MatDialogRef<ConfirmationDialog>;
  
  devices: Object[] = [];
  deviceStatus: any = {};
  deviceIcons: any = {'online': 'link', 'offline': 'link_off', 'unused': ''}
  baselineList: Object[] = [];
  lab_controls: Object[] = [];
  networks:  Object[] = [];
  allChecked: boolean = false;
  allAnimating: boolean = false;
  isRefresh: boolean = false;
  isRefreshError: boolean = false;
  isLocked: boolean = false;

  constructor(
    public apiService: ApiService,
    private auth: AuthService,
    public eventService: EventService,
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
    this.eventService.getMenuChangeEmitter()
    .subscribe(view => {        
      this.defaultView = view;
    });     
    
    let userInfo = JSON.parse(this.auth.getStorage('user-info'));
    this.apiService.get('lockstatus/' + userInfo.pod_id)
    .subscribe(
      data => {
        this.isLocked = !data.unlocked;
      },
      error => {
        this.isLocked = false;
      });

    this.eventService.getdeviceListEmitter()
    .subscribe(data => {        
      this.devices = data.devices;
      this.apiService.get('availability')
      .subscribe(data => {
        this.deviceStatus = data;
      }); 

      if(data.lab_controls && data.lab_controls['can_start']) {
        for (let control of data.baseline) {
          this.baselineList.push({'name': control, 'action': 'start', 'status': ''});
        }
      }

      if(data.lab_controls) {
        if(data.lab_controls['can_save']) {
          this.lab_controls.push({'name': 'Save lab', 'action': 'save', 'status': ''});
        }
        if(data.lab_controls['can_restore']) {
          this.lab_controls.push({'name': 'Restore lab', 'action': 'restore', 'status': ''});
        }
        if(data.lab_controls['can_end']) {
          this.lab_controls.push({'name': 'End lab', 'action': 'end', 'status': ''});
        }
      }
    });
  } 

  public showPanel(menu, submenu) {
    this.defaultView.submenu = submenu;
    this.eventService.subMenu.emit(this.defaultView);
  }

  public reset(device) {
    const self = this;
    if(device.status == 'online' && device.can_reboot_device) {
      const payload = {
        device: device.name,
        os_action: device.os_action,
        action: 'reboot'
      };    

      self.apiService.put('device', payload)
        .subscribe(data => {
          device.status = 'reboot';
          self.refreshStatus(data.job_id, device, 'online', 'reboot', 1);
        });
    }
  }

  public clearline(device) {
    const self = this;
    if(device.status == 'online' && device.can_clear_line) {
      const payload = {
        device: device.name,
        os_action: device.os_action,
        action: 'clearline'
      };    
      
      self.apiService.put('device', payload)
        .subscribe(data => {
          device.status = 'clearline';
          self.refreshStatus(data.job_id, device, 'online', 'clearline', 1);
        }); 
    }
  }  

  public baseline(device) {
    const self = this;
    if(device.status == 'online' && device.can_baseline_device) {
      const payload = {
        device: device.name,
        os_action: device.os_action,
        action: 'baseline'
      };    

      self.apiService.put('device', payload)
        .subscribe(data => {
          device.status = 'baseline';
          self.refreshStatus(data.job_id, device, 'online', 'baseline', 1);
        });
    }
  }   

  public control(device) {
    const self=this;

    self.dialogRef = self.dialog.open(ConfirmationDialog, {
      disableClose: false,
      panelClass: 'confirmation'
    });

    self.dialogRef.componentInstance.confirmMessage = "Are you sure you want to " + device.action +" ?"

    self.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        device['controlIcon'] = 'autorenew';
        let userInfo = JSON.parse(self.auth.getStorage('user-info'));    
        const payload = {
          program_id: device.name || userInfo.program_id,
          pod_id: userInfo.pod_id,
          action: device.action
        };
        
        self.apiService.put('control', payload)
          .subscribe(
            data => {
              self.apiService.get('status/' + data.job_id).subscribe(
              res => {
                device.status = res.status;
                if(res.status === 'successful' || res.status === 'failed' || res.status === 'error' || res.status === 'canceled') {
                  device['controlIcon'] = 'settings_power';
                }else {
                  self.refreshControlStatus(data.job_id, device, 1);
                }
              },
              error => {
                device.status = 'Error!';
                device['controlIcon'] = 'settings_power';
              });
            },
            error => {
              device.status = 'Error!';
              device['controlIcon'] = 'settings_power';
            });
      }
      self.dialogRef = null;
    });
  }

  private refreshStatus(id, device, status, type, count) {
    const self = this;
    let finished = false;
    let retry = count;
    const interval$ = interval(CONFIG.DEVICE_REFRESH_INTERVAL * 1000);
    var subscription = interval$
      .pipe(takeWhile(() => !finished))
      .subscribe(() => {
        self.apiService.get('status/' + id).subscribe(res => {
          if(res.status == 'successful') {
            device.status = status;
            finished = true;
          }else {
            retry = retry + 1;
          }
        });

        if(retry == CONFIG.DEVICE_REFRESH_LIMIT + 1) {
          if(device.status != 'online') {
            if(type == 'reboot') {
              device.rebootError = 'error';
            }
            if(type == 'clearline') {
              device.clearlineError = 'error';
            }
            if(type == 'baseline') {
              device.baselineError = 'error';
            }
          }
          device.status = 'online';
          finished = true;
        }
      });
  }

  private refreshControlStatus(id, device, count) {
    const self = this;
    let finished = false;
    let retry = count;
    const interval$ = interval(CONFIG.DEVICE_CONTROL_INTERVAL * 1000);
    var subscription = interval$
      .pipe(takeWhile(() => !finished))
      .subscribe(() => {       
        self.apiService.get('status/' + id).subscribe(
          res => {
            device.status = res.status;
            if(res.status === 'successful' || res.status === 'failed' || res.status === 'error' || res.status === 'canceled') {
              finished = true;
              device['controlIcon'] = 'settings_power';          
            }else {
              retry = retry + 1;
            }
          },
          error => {
            finished = true;
            device.status = 'Error!';
            device['controlIcon'] = 'settings_power';
          });
      },
      error => {
        device.status = 'Error!';
        device['controlIcon'] = 'settings_power';
      });
      if(retry == CONFIG.DEVICE_CONTROL_LIMIT + 1) {
        finished = true;
        device['controlIcon'] = 'settings_power';
      }      
  }

  public refresh() {
    let self = this;
    self.isRefresh = true;
    self.isRefreshError= false;
    let userInfo = JSON.parse(self.auth.getStorage('user-info'));
    setTimeout(() => {

      self.apiService.get('availability')
      .subscribe(
        data => {
          self.deviceStatus = data;
          self.isRefresh = false;
        },
        error => {
          self.isRefresh = false;
          self.isRefreshError = true;
        }); 

      self.apiService.get('lockstatus/' + userInfo.pod_id)
      .subscribe(
        data => {
          self.isLocked = !data.unlocked;
        },
        error => {
          self.isLocked = false;
        });
    }, 1000);
  }

  public checkAll(){
    this.allAnimating = true;
    this.allChecked = !this.allChecked;
    this.networks.map(n => {
      n['checked'] = this.allChecked;
    });
    setTimeout(() => {
      this.allAnimating = false;
    }, 300);    
  }

  public check(nework) {
    this.allChecked = false;
    nework['animating'] = true;
    nework['checked'] = !nework['checked'];
    setTimeout(() => {
      nework['animating'] = false;
    }, 300);     
  }

  public runTest() {
    console.log('run test regions');
  }
}
