import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeerComponent } from './booze-meter/beer/beer.component';
import { BoozeMeterComponent } from './booze-meter/booze-meter.component';
import { CilinderBaseComponent } from './booze-meter/cilinder-base/cilinder-base.component';
import { CilinderBeerComponent } from './booze-meter/cilinder-beer/cilinder-beer.component';
import { CilinderFootComponent } from './booze-meter/cilinder-foot/cilinder-foot.component';
import { CilinderLevelsComponent } from './booze-meter/cilinder-levels/cilinder-levels.component';
import { CilinderTopComponent } from './booze-meter/cilinder-top/cilinder-top.component';
import { CilinderComponent } from './booze-meter/cilinder/cilinder.component';
import { GlassBackComponent } from './booze-meter/glass-back/glass-back.component';
import { GlassFrontComponent } from './booze-meter/glass-front/glass-front.component';
import { StreamFluidComponent } from './booze-meter/stream-fluid/stream-fluid.component';
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
    TapComponent,
    StreamFluidComponent,
    BeerComponent,
    GlassBackComponent,
    GlassFrontComponent
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
