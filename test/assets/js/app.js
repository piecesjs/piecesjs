import { load } from 'piecesjs';

// 
// IMPORT components
// 
// ------------------------------------------------------------
load('c-add', () => import(`/assets/js/components/Add.js`));
load('c-header', () => import(`/assets/js/components/Header.js`));
load('c-button', () => import(`/assets/js/components/Button.js`));
// ------------------------------------------------------------
