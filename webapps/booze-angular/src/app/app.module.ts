import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoozeMeterComponent } from './booze-meter/booze-meter.component';
import { CilinderFootComponent } from './booze-meter/cilinder-foot/cilinder-foot.component';
import { CilinderTopComponent } from './booze-meter/cilinder-top/cilinder-top.component';
import { CilinderBaseComponent } from './booze-meter/cilinder-base/cilinder-base.component';
import { CilinderBeerComponent } from './booze-meter/cilinder-beer/cilinder-beer.component';
import { CilinderComponent } from './booze-meter/cilinder/cilinder.component';
import { CilinderLevelsComponent } from './booze-meter/cilinder-levels/cilinder-levels.component';
import { TapComponent } from './booze-meter/tap/tap.component';

@NgModule({
  declarations: [
    AppComponent,
    BoozeMeterComponent,
    CilinderFootComponent,
    CilinderTopComponent,
    CilinderBaseComponent,
    CilinderBeerComponent,
    CilinderComponent,
    CilinderLevelsComponent,
    TapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
