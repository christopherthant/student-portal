import { Component } from '@angular/core';
import { TitleService } from "./shared/title.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private titleService: TitleService) { }

  ngOnInit(): void {
    this.titleService.setTitle('teromac Lab');
  }  

  expand = true;
  toggleMenu() {
    this.expand = !this.expand;
  }  
}
