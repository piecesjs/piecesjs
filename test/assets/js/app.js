import { load } from 'piecesjs';

//
// IMPORT components
//
// ------------------------------------------------------------
load('c-counter', () => import('/assets/js/components/Counter.js'));
load('c-header', () => import('/assets/js/components/Header.js'));
load('c-button', () => import('/assets/js/components/Button.js'));
// ------------------------------------------------------------
