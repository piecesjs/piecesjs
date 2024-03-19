import { load } from 'piecesjs';

// async function dynamicLoad(src) {
//   await import(src);
// }

// function dynamicLoad(src) {
  // import('/assets/js/components/Add.js').then(module => {
  //   console.log(module)
  // });
// }

// 
// IMPORT components
// 
// ------------------------------------------------------------
load('c-add', () => import(`/assets/js/components/Add.js`));
load('c-header', () => import(`/assets/js/components/Header.js`));
load('c-button', () => import(`/assets/js/components/Button.js`));
// ------------------------------------------------------------

// import('/assets/js/components/Add.js');
// dynamicLoad('/assets/js/components/Add.js');
