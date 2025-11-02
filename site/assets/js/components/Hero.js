import { Piece } from 'piecesjs';
import { lerp, clamp } from '../utils/maths.js';
import gsap from 'gsap';

class Hero extends Piece {
  constructor() {
    super('Hero', {
      stylesheets: [() => import('/assets/css/components/hero.css')],
    });

    this.mouseX = 0;
    this.mouseY = 0;

    this.lerpXProgress = 0;
    this.xProgress = 0;
    this.lerpYProgress = 0;
    this.yProgress = 0;
    this.gradientAngle = 0;
    this.lerpGradientAngle = 0;

    this.$canvas = this.domAttr('canvas');
    this.ctx = this.$canvas.getContext('2d');
  }

  mount() {
    this.resize();
    this.on('mousemove', window, this.mousemove);
    this.on('resize', window, this.resizeDebounce);
    this.on('click', window, this.click);
    this.animate();

    this.generateBackground();
  }

  generateBackground() {
    this.ctx.width = this.ww + 70;
    this.ctx.height = this.wh + 30;
    this.$canvas.width = this.ww + 70;
    this.$canvas.height = this.wh + 30;

    const boxWidth = 70;
    const boxHeight = 30;
    const boxes = [];

    const cols = Math.ceil(this.$canvas.width / boxWidth);
    const rows = Math.ceil(this.$canvas.height / boxHeight);

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.font = "13px 'Delight Regular', Arial, sans-serif";
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.globalAlpha = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let offsetX = -boxWidth / 4;
        if (row % 2 == 0) {
          offsetX = boxWidth / 4;
        }
        const x = col * boxWidth + offsetX;
        const y = row * boxHeight + boxHeight / 6;
        boxes.push({ x, y, width: boxWidth, height: boxHeight });

        const centerX = x + boxWidth / 2;
        const centerY = y + boxHeight / 2;
        this.ctx.fillText('piecesjs', centerX, centerY);
      }
    }

    this.backgroundBoxes = boxes;
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
    this.lerpXProgress = lerp(this.lerpXProgress, this.xProgress, 0.05);
    this.lerpYProgress = lerp(this.lerpYProgress, this.yProgress, 0.05);

    this.lerpGradientAngle = lerp(
      this.lerpGradientAngle,
      this.gradientAngle,
      1,
    );

    this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

    this.backgroundBoxes.forEach((box) => {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;
      const gradient = this.ctx.createLinearGradient(
        box.x,
        0,
        box.x + box.width,
        0,
      );
      gradient.addColorStop(0, 'rgb(0, 0, 0)');
      gradient.addColorStop(1 - this.lerpXProgress, 'rgb(100, 100, 100)');
      gradient.addColorStop(1, 'rgb(0, 0, 0)');
      this.ctx.fillStyle = gradient;

      const distanceX = Math.abs(box.x - this.mouseX);
      const distanceY = Math.abs(box.y - this.mouseY);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = Math.sqrt(this.ww * this.ww + this.wh * this.wh);
      const opacity = 1 - distance / maxDistance;
      this.ctx.globalAlpha = clamp(opacity, 0, 1);

      this.ctx.fillText('piecesjs', centerX, centerY);

      this.ctx.globalAlpha = 1;
    });

    this.style.setProperty('--gradient-angle', `${this.lerpGradientAngle}deg`);

    this.style.setProperty(
      '--progress-x',
      `${gsap.utils.mapRange(0, 1, -1, 1, this.lerpXProgress)}`,
    );
    this.style.setProperty(
      '--progress-y',
      `${gsap.utils.mapRange(0, 1, -1, 1, this.lerpYProgress)}`,
    );
  }

  mousemove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.xProgress = e.clientX / window.innerWidth;
    this.yProgress = e.clientY / window.innerHeight;
    this.angle = gsap.utils.mapRange(
      0,
      window.innerHeight,
      80,
      100,
      this.mouseY,
    );

    this.gradientAngle = gsap.utils.mapRange(
      0,
      window.innerWidth,
      0,
      360,
      this.mouseX,
    );
  }

  resizeDebounce() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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

    this.generateBackground();
  }

  unmount() {
    this.off('mousemove', window, this.mousemove);

    window.cancelAnimationFrame(this.raf);
  }
}

// Register the custom element
customElements.define('c-hero', Hero);
