import { animate, group, query, transition, trigger } from '@angular/animations';
import { fluidAnimation } from './fluid.animation';
import { foamAnimation } from './foam.animation';
import { glassAnimation } from './glass.animation';
import { streamAnimation } from './stream.animation';
import { animationDuration } from './variables';

export const beerAnimation = trigger('beerAnimation', [
  transition('* => *', [
    group([
      query(':self', animate(animationDuration, glassAnimation)),
      query('#rectStreamFluid', [
        animate(animationDuration, streamAnimation)
      ]),
      query('#pathFoamBeer', [
        animate(animationDuration, foamAnimation)
      ]),
      query('#pathBeer', [
        animate(animationDuration, fluidAnimation)
      ]),
    ])
  ])
]);



