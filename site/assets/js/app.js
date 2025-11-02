import { load } from 'piecesjs';
import gsap from 'gsap';
//
// IMPORT components
//
// ------------------------------------------------------------
load('c-hero', () => import('/assets/js/components/Hero.js'));

document.addEventListener('DOMContentLoaded', () => {
  gsap.delayedCall(0.3, () => {
    document.documentElement.classList.add('is-ready');
  });
});
