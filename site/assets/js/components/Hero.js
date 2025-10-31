import { Piece } from 'piecesjs';
import { lerp } from '../utils/maths.js';
import gsap from 'gsap';

class Hero extends Piece {
  constructor() {
    super('Hero', {
      stylesheets: [() => import('/assets/css/components/hero.css')],
    });

    this.lerpXProgress = 0;
    this.xProgress = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.angle = 0;
    this.lerpAngle = 0;

    this.$model = this.domAttr('model');

    for (let i = 0; i < 99; i++) {
      const $clone = this.$model.cloneNode(true);
      this.appendChild($clone);
    }

    this.$items = this.domAttrAll('model');

    this.itemsData = Array.from({ length: this.$items.length }, (item, i) => ({
      alpha: 1,
      lerpAlpha: 1,
      el: this.$items[i],
    }));

    this.mode = 0;
    this.classList.add(`mode-${this.mode}`);
  }

  mount() {
    this.resize();
    this.on('mousemove', window, this.mousemove);
    this.on('resize', window, this.resizeDebounce);
    this.on('click', window, this.click);
    this.animate();
  }

  click() {
    if (this.mode === 0) {
      this.mode = 1;
      this.classList.remove('mode-0');
      this.classList.add('mode-1');
    } else {
      this.mode = 0;
      this.classList.add('mode-0');
      this.classList.remove('mode-1');
    }
  }

  animate() {
    this.raf = window.requestAnimationFrame(this.animate.bind(this));
    this.lerpXProgress = lerp(this.lerpXProgress, this.xProgress, 0.2);
    this.lerpAngle = lerp(this.lerpAngle, this.angle, 1);

    this.style.setProperty('--progress', `${100 - this.lerpXProgress * 100}%`);
    this.style.setProperty('--angle', `${this.lerpAngle}deg`);
  }

  mousemove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.xProgress = e.clientX / window.innerWidth;
    this.angle = gsap.utils.mapRange(
      0,
      window.innerHeight,
      80,
      100,
      this.mouseY,
    );
    // this.angle = 90;
  }

  resizeDebounce() {
    if (this.resizeTimeout) {
      this.resizeTimeout.kill();
    }
    this.resizeTimeout = gsap.delayedCall(0.1, () => {
      this.resize();
    });
  }

  resize() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
  }

  unmount() {
    this.off('mousemove', window, this.mousemove);

    window.cancelAnimationFrame(this.raf);
  }
}

// Register the custom element
customElements.define('c-hero', Hero);
