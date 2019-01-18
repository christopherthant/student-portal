import { Component, OnInit, Input } from '@angular/core';
import { PanelDeviceComponent } from '../../panel-device/panel-device.component';
import { PanelLabComponent } from '../../panel-lab/panel-lab.component';
import { PanelMachineComponent } from '../../panel-machine/panel-machine.component';
import { PanelSettingsComponent } from '../../panel-settings/panel-settings.component';
import { SupportComponent } from '../../support/support.component';

import { EventService} from '../../shared/event.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Input() defaultView: any;
  constructor(
  ) { }

  ngOnInit() {
    this.defaultView = {};
  }
}
