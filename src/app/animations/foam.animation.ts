import { keyframes, style } from '@angular/animations';

const top_left_indraw = '5px';
const bottom_left_indraw = '7px';
const top_right_indraw = '73px';
const bottom_right_indraw = '76px';

const start_height = '135px';

export const foamAnimation = keyframes([
    style({
        opacity: 0,
        '-webkit-clip-path': `polygon(${top_left_indraw} 100%, ${top_right_indraw} 100%, ${bottom_right_indraw} 105%, ${bottom_left_indraw} 105%)`,
        'clip-path': `polygon(${top_left_indraw} 100%, ${top_right_indraw} 100%, ${bottom_right_indraw} 105%, ${bottom_left_indraw} 105%)`,
        transform: `translate(0px,${start_height})`,
        offset: 0,
    }),
    style({
        opacity: 0,
        '-webkit-clip-path': `polygon(${top_left_indraw} 100%, ${top_right_indraw} 100%, ${bottom_right_indraw} 105%, ${bottom_left_indraw} 105%)`,
        'clip-path': `polygon(${top_left_indraw} 100%, ${top_right_indraw} 100%, ${bottom_right_indraw} 105%, ${bottom_left_indraw} 105%)`,
        transform: `translate(0px,${start_height})`,
        offset: 0.15
    }),
    style({
        opacity: 0,
        transform: `translate(0px,${start_height})`,
        offset: 0.23
    }),
    style({
        opacity: 1,
        transform: `translate(0px,${start_height})`,
        offset: 0.24
    }),
    style({
        '-webkit-clip-path': `polygon(0 0, 100% 0, 100% 105%, 0% 105%)`,
        'clip-path': `polygon(0 0, 100% 0, 100% 105%, 0% 105%)`,
        transform: `translate(0px,0px)`,
        offset: 0.7
    }),
    style({
        '-webkit-clip-path': `polygon(0 0, 100% 0, 100% 105%, 0% 105%)`,
        'clip-path': `polygon(0 0, 100% 0, 100% 105%, 0% 105%)`,
        transform: `translate(0px,0px)`,
        offset: 0.85
    }),
]);
