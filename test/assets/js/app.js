import { load } from 'piecesjs';
//
// IMPORT components
//
// ------------------------------------------------------------
load('c-header', () => import('/assets/js/components/Header.js'));
load('c-counter', () => import('/assets/js/components/Counter.js'));
load('c-reset', () => import('/assets/js/components/Reset.js'));
// ------------------------------------------------------------
