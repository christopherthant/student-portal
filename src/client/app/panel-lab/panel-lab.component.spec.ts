import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLabComponent } from './panel-lab.component';

describe('PanelLabComponent', () => {
  let component: PanelLabComponent;
  let fixture: ComponentFixture<PanelLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
