import { keyframes, style } from '@angular/animations';

const horizontal_translate = '100px';
const vertical_translate = '20px';

export const glassAnimation = keyframes([
  style({
    opacity: 0,
    transform: `translate(${horizontal_translate},-${vertical_translate})`,
    offset: 0
  }),
  style({ opacity: 1, transform: `translate(0px,0px)`, offset: 0.15 }),
  style({ opacity: 1, transform: `translate(0px,0px)`, offset: 0.7 }),
  style({
    opacity: 0,
    transform: `translate(-${horizontal_translate},-${vertical_translate})`,
    offset: 0.85
  }),
  // YANNICK: do we need this line?
  style({
    opacity: 0,
    transform: `translate(${horizontal_translate},-${vertical_translate})`,
    offset: 1
  })
]);
