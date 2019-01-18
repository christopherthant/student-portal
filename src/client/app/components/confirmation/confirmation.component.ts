import { Component, OnInit, Input } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})

export class ConfirmationDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>) { }

  public confirmMessage:string;
  ngOnInit() {

  }
}
