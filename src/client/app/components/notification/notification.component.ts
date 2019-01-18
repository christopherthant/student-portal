import { Component, OnInit, Input} from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotificationDialog>) { }
  public notificationMessage:string;
  ngOnInit() {

  }
}
