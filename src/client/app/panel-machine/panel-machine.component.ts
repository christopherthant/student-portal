import {Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {EventService} from './../shared/event.service';
import {AuthService} from './../shared/auth.service';
import {ApiService} from './../shared/api.service';
import {GuacamoleService} from './../services/guacamole/guacamole.service';
import {GuacdConfig} from '../services/guacamole/gucadconfig.model';

declare const Guacamole;

@Component({
  selector: 'app-panel-machine',
  templateUrl: './panel-machine.component.html',
  styleUrls: ['./panel-machine.component.scss']
})
export class PanelMachineComponent implements OnInit {
  @Input() defaultView: any;
  @ViewChild('machine') ref: ElementRef;
  private keyboard = new Guacamole.Keyboard(document);
  connected = false;
  error = false;
  clipboardClosed = true;
  clipBoard = '';
  currentDeviceName = '';

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private apiService: ApiService,
    private guacamoleService: GuacamoleService) {
  }

  ngOnInit() {
    this.addKeyboardListeners();
    this.eventService.getMenuChangeEmitter()
      .subscribe(view => {
        this.defaultView = view;
        if (view.menu === 'machine') {
          this.connected = view.device.connected;
          this.error = false;
          if (!view.device.connected || view.show) {
            this.display(view.device, view.show);
          } else {
            this.disconnect(view.device);
          }
        }
      });
  }

  display(device, show) {
    const self = this;
    const token = self.authService.getGuacdToken();
    self.hideAllDisplays();


    const height = document.documentElement.clientHeight - 35;
    document.getElementById('machine-container').style.height = height + 'px';
    // self.displayIfAlreadyExist(device.name);

    if (!show) {
      const payload = {
        authToken: token,
        connectionIdentifier: device.identifier
      };

      self.apiService.post('disconnect', payload)
        .subscribe(data => {
          if (data.status === 204) {
            setTimeout(function () {
              const config = new GuacdConfig(device.identifier, device.name, self.ref.nativeElement.offsetWidth, height);
              const client = self.guacamoleService.connect(token, config);
              if (client) {
                self.attachDisplay(client, device);
                setTimeout(function () {
                  self.error = !device.connected;
                }, 10000);
              }
            }, 1000);
          }
        });
    } else {
      if (self.displayIfAlreadyExist(device.name)) {
        device.connected = true;
        self.connected = true;
        self.error = false;
        return;
      } else {
        self.connected = false;
        self.error = false;
      }
    }
  }

  disconnect(device) {
    const self = this;
    const token = self.authService.getGuacdToken();
    device.connected = false;
    const client = this.guacamoleService.getConnection(device.name);
    const display = client.getDisplay().getElement();
    self.ref.nativeElement.removeChild(display);

    client.disconnect();
    this.guacamoleService.removeConnection(device.name);

    const payload = {
      authToken: token,
      connectionIdentifier: device.identifier
    };

    this.apiService.post('disconnect', payload)
      .subscribe(data => {

      });
  }

  copy() {
    if (this.currentDeviceName) {
      const client = this.guacamoleService.getConnection(this.currentDeviceName);
      this.guacamoleService.sendClipboard(client, this.clipBoard);
    }
  }

  close() {
    this.clipboardClosed = true;
    this.addKeyboardListeners();
  }

  private attachDisplay(client, device) {
    const self = this;
    const display = client.getDisplay().getElement();
    display.style.zIndex = 100;
    display.id = device.name;

    display.tabIndex = 23;
    display.focus();

    const mouse = new Guacamole.Mouse(display);

    mouse.onmousedown = function (mouseState) {
      if (display.style.display !== 'none') {
        client.sendMouseState(mouseState);
      }
    };

    mouse.onmouseup = mouse.onmousemove = mouse.onmousedown;

    client.onclipboard = function (data, mimetype) {
      if (mimetype === 'text/plain') {
        let text = '';
        const reader = new Guacamole.StringReader(data);
        reader.ontext = function (chunk) {
          text += chunk;
        };
        reader.onend = function () {
          self.clipBoard = text;
        };
      }

    };

    client.onunload = function () {
      client.disconnect();
      self.guacamoleService.removeConnection(device.name);
    };

    client.onstatechange = function (state) {
      switch (state) {
        case 0: // constant 0 - default state client.STATE_IDLE
        case 1: // constant 1 - client.STATE_CONNECTING
        case 2: // constant 2 - client.STATE_WAITING
        case 4: // constant 4 - client.STATE_DISCONNECTING
          break;
        case 3: // constant 3 - client.STATE_CONNECTED
          self.ref.nativeElement.appendChild(display);
          device.connected = true;
          self.connected = true;
          self.currentDeviceName = device.name;
          self.guacamoleService.addConnection(device.name, client);
          break;
        case 5: // constant 5 - client.STATE_DISCONNECTED
          delete client.onclipboard;
          device.connected = false;
          self.guacamoleService.removeConnection(device.name);
          const elem = document.getElementById(device.name);
          if (elem) {
            elem.outerHTML = '';
          }
      }
    };
  }

  private hideAllDisplays() {
    Object.keys(this.guacamoleService.clients).forEach(key => {
      document.getElementById(key).style.display = 'none';
    });
  }

  private displayIfAlreadyExist(device_name): boolean {
    if (this.guacamoleService.clients[device_name]) {
      document.getElementById(device_name).style.display = 'block';
      this.currentDeviceName = device_name;
      return true;
    }
    return false;
  }

  private addKeyboardListeners() {
    const self = this;
    this.keyboard.onkeydown = function (keysym) {
      const currentDisplay = document.getElementById(self.currentDeviceName);
      if (currentDisplay && currentDisplay.style.display !== 'none') {
        if (self.keyboard.modifiers.ctrl && self.keyboard.modifiers.alt && self.keyboard.modifiers.shift) {
          self.clipboardClosed = !self.clipboardClosed;
          if (!self.clipboardClosed) {
            self.removeKeyboardListeners();
          }
        }
      }
      self.sendKeyEventToCurrentClient(1, keysym);
    };
    this.keyboard.onkeyup = function (keysym) {
      self.sendKeyEventToCurrentClient(0, keysym);
    };
  }

  private removeKeyboardListeners() {
    this.keyboard.onkeydown = null;
    this.keyboard.onkeyup = null;
  }

  private sendKeyEventToCurrentClient(code, keysym) {
    const client = this.getCurrentClient();
    if (client) {
      client.sendKeyEvent(code, keysym);
    }
  }

  private getCurrentClient() {
    return this.guacamoleService.getConnection(this.currentDeviceName) || null;
  }
}
