import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GuacamoleService } from '../../services/guacamole/guacamole.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { ApiService } from '../../shared/api.service';
import { GuacdConfig } from '../../services/guacamole/gucadconfig.model';
import { EventService } from '../../shared/event.service';
import { TitleService } from "../../shared/title.service";

declare var Guacamole;

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit {
  @ViewChild('machine') ref: ElementRef;
  device: any;

  constructor(private titleService: TitleService,
              private guacamoleService: GuacamoleService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private apiService: ApiService,
              private eventService: EventService) {
  }

  ngOnInit() {
    const self = this;

    self.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('id') && params.hasOwnProperty('name')) {
        const token = self.authService.getGuacdToken();
        const identifier = params['id'];
        const name = params['name'];
        const display_name = params['display_name'];
        self.titleService.setTitle(display_name);

        const payload = {
          authToken: token,
          connectionIdentifier: identifier
        };
        
        self.apiService.post('disconnect', payload)
        .subscribe(data => {
          if(data.status == 204) {
            setTimeout(function () {
              const config = new GuacdConfig(identifier, name, self.ref.nativeElement.offsetWidth, self.ref.nativeElement.offsetHeight);
              const client = self.guacamoleService.connect(token, config);
              if (client) {
                self.attachDisplay(client, identifier, name, function() {

                });

                setTimeout(function() {
                  //self.error = true;
                }, 10000);
              }
            }, 1000);      
          }
        });  
      }
    });
  }


  private attachDisplay(client, id, name, callback) {
    const self = this;
    const display = client.getDisplay().getElement();
    display.style.zIndex = 100;
    display.id = name;

    const mouse = new Guacamole.Mouse(display);

    mouse.onmousedown = function (mouseState) {
      client.sendMouseState(mouseState);
    };

    mouse.onmouseup = mouse.onmousemove = mouse.onmousedown;

    const keyboard = new Guacamole.Keyboard(document);

    keyboard.onkeydown = function (keysym) {
      client.sendKeyEvent(1, keysym);
    };

    keyboard.onkeyup = function (keysym) {
      client.sendKeyEvent(0, keysym);
    };

    client.onunload = function () {
      client.disconnect();
      self.guacamoleService.removeConnection(name);
    };

    client.onstatechange = function (state) {
      switch (state) {
        case 0: // constant 0 - default state client.STATE_IDLE
          //console.log('Client Idle');
          break;
        case 1: // constant 1 - client.STATE_CONNECTING
          //console.log('Client Connecting to websocket');
          break;
        case 2: // constant 2 - client.STATE_WAITING
          //console.log('Waiting for remote');
          break;
        case 3: // constant 3 - client.STATE_CONNECTED
          //console.log('Connected to remote');
          self.ref.nativeElement.appendChild(display);
          //device.connected = true;
          //self.conected = true;
          self.guacamoleService.addConnection(name, client);
          callback();
          break;
        case 4: // constant 4 - client.STATE_DISCONNECTING
          console.log('Disconnecting remote machine');
          break;
        case 5: // constant 5 - client.STATE_DISCONNECTED
          console.log('disconnected from remote machine and try to remove remote display');
          //console.log(self.ref.nativeElement);
          self.guacamoleService.removeConnection(name);
      }
    }; 
  }
}
