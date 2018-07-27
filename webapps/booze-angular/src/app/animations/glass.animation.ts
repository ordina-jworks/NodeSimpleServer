import { animate, keyframes, style, transition, trigger } from '@angular/animations';

const horizontal_translate = '100px';
const vertical_translate = '20px';

const beer_height = '150px';

export const glassMovement = trigger('glassMovement', [
  transition('* => *',
    animate('10s',
      keyframes([
        style({opacity: 0, transform: `translate(${horizontal_translate},-${vertical_translate})`, offset: 0}),
        style({opacity: 1, transform: `translate(0px,0px)`, offset: 0.15}),
        style({opacity: 1, transform: `translate(0px,0px)`, offset: 0.70}),
        style({opacity: 0, transform: `translate(-${horizontal_translate},-${vertical_translate})`, offset: 0.85}),
        // YANNICK: do we need this line?
        style({opacity: 0, transform: `translate(${horizontal_translate},-${vertical_translate})`, offset: 1}),
      ])
    )
  )
]);

export const fillGlassWithBeer = trigger('fillGlassWithBeer', [
  transition('* => *',
    animate('10s',
      keyframes([
        style({'-webkit-clip-path': `inset(${beer_height} 0px 0px 0px)`, 'clip-path': `inset(${beer_height} 0px 0px 0px)`, offset: 0}),
        style({'-webkit-clip-path': `inset(${beer_height} 0px 0px 0px)`, 'clip-path': `inset(${beer_height} 0px 0px 0px)`, offset: 0.15}),
        style({'-webkit-clip-path': `inset(0px 0px 0px 0px)`, 'clip-path': `inset(0px 0px 0px 0px)`, offset: 0.70}),
        style({'-webkit-clip-path': `inset(0px 0px 0px 0px)`, 'clip-path': `inset(0px 0px 0px 0px)`, offset: 0.85}),
      ])
    )
  )
]);
