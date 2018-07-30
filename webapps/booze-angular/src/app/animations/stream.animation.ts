import { keyframes, style } from '@angular/animations';

export const streamAnimation = keyframes([
  style({ opacity: 0, offset: 0 }),
  style({ opacity: 0, offset: 0.18 }),
  style({ opacity: 1, offset: 0.23 }),
  style({ opacity: 1, offset: 0.6 }),
  style({ opacity: 0, offset: 0.63 }),
  style({ opacity: 0, offset: 1 })
]);
