import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() defaultView: any;
  constructor(
  ) { }

  ngOnInit() {
    this.defaultView = { "menu": "lab", "submenu" : "topology" };
  }
}
