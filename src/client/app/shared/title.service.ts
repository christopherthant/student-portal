import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {
  constructor(private title :Title) { }

  /**
   * Get the title of the current HTML document.
   * @returns {string}
   */
  getTitle(): string { return this.title.getTitle(); }

  /**
   * Set the title of the current HTML document.
   * @param newTitle
   */
  setTitle(newTitle: string) { this.title.setTitle(newTitle); }  
}