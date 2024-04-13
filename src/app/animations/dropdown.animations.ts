import { animate, state, style, transition, trigger } from '@angular/animations';

export const dropdownAnimation = trigger('dropdownAnimation', [
    state('closed', style({
        height: '0',
        opacity: 0,
        visibility: 'hidden'
    })),
    state('open', style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
    })),
    transition('closed <=> open', animate('300ms ease-in-out'))
]);