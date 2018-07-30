import { keyframes, style } from '@angular/animations';
import { beer_height } from './variables';

export const fluidAnimation = keyframes([
  style({ 'clip-path': `inset(${beer_height} 0px 0px 0px)`, offset: 0 }),
  style({ 'clip-path': `inset(${beer_height} 0px 0px 0px)`, offset: 0.2 }),
  style({ 'clip-path': `inset(0px 0px 0px 0px)`, offset: 0.7 }),
  style({ 'clip-path': `inset(0px 0px 0px 0px)`, offset: 0.85 })
]);
