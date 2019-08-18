import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages';
import { ActividadesPage } from '../pages';
import { ChatsPage } from '../pages';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = ActividadesPage;
  tab3Root: any = ChatsPage;


  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";

  constructor(public navCtrl: NavController, public translateService: TranslateService,
    public toastCtrl: ToastController, public navParams: NavParams) {


    translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      this.tab3Title = values['TAB3_TITLE'];
    });
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
  }

  cargaActividades(){
  }

}
