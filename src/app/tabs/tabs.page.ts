import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('myTabs', null) tabs: IonTabs;

  activeTabName: any;
  getSelectedTab(): void {
    this.activeTabName = this.tabs.getSelected();
  }
  constructor(private router: Router) { }
 
}
