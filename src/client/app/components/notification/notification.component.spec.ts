import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDialog } from './notification.component';

describe('NotificationDialog', () => {
  let component: NotificationDialog;
  let fixture: ComponentFixture<NotificationDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
