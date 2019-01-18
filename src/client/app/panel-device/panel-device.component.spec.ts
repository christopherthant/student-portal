import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDeviceComponent } from './panel-device.component';

describe('PanelDeviceComponent', () => {
  let component: PanelDeviceComponent;
  let fixture: ComponentFixture<PanelDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
