import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaIconosPage } from './lista-iconos';

@NgModule({
  declarations: [
    ListaIconosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaIconosPage),
  ],
  exports: [
    ListaIconosPage
  ]
})
export class ListaIconosPageModule {}
