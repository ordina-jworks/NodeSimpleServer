import { keyframes, style } from '@angular/animations';
import { beer_height } from './variables';

export const fluidAnimation = keyframes([
  style({ '-webkit-clip-path': `inset(${beer_height} 0px 0px 0px)`, 'clip-path': `inset(${beer_height} 0px 0px 0px)`, offset: 0 }),
  style({ '-webkit-clip-path': `inset(${beer_height} 0px 0px 0px)`, 'clip-path': `inset(${beer_height} 0px 0px 0px)`, offset: 0.2 }),
  style({ '-webkit-clip-path': `inset(0px 0px 0px 0px)`, 'clip-path': `inset(0px 0px 0px 0px)`, offset: 0.7 }),
  style({ '-webkit-clip-path': `inset(0px 0px 0px 0px)`, 'clip-path': `inset(0px 0px 0px 0px)`, offset: 0.85 })
]);
