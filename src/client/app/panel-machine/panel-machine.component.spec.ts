import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMachineComponent } from './panel-machine.component';

describe('PanelMachineComponent', () => {
  let component: PanelMachineComponent;
  let fixture: ComponentFixture<PanelMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
