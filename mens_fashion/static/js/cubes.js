/**
 * Cubes Component - Vanilla JavaScript Version
 * Interactive 3D cube grid with tilt and ripple effects
 * Dependencies: GSAP
 */

class Cubes {
  constructor(options = {}) {
    this.options = {
      gridSize: options.gridSize || 8,
      cubeSize: options.cubeSize || undefined,
      maxAngle: options.maxAngle || 45,
      radius: options.radius || 3,
      easing: options.easing || 'power3.out',
      duration: options.duration || { enter: 0.3, leave: 0.6 },
      cellGap: options.cellGap || undefined,
      borderStyle: options.borderStyle || '2px dashed #5227FF',
      faceColor: options.faceColor || '#1a1a2e',
      shadow: options.shadow || false,
      autoAnimate: options.autoAnimate !== false,
      rippleOnClick: options.rippleOnClick !== false,
      rippleColor: options.rippleColor || '#ff6b6b',
      rippleSpeed: options.rippleSpeed || 1.5,
      containerId: options.containerId || 'cubes-container'
    };

    this.container = null;
    this.sceneRef = null;
    this.rafRef = null;
    this.idleTimerRef = null;
    this.userActiveRef = false;
    this.simPosRef = { x: 0, y: 0 };
    this.simTargetRef = { x: 0, y: 0 };
    this.simRAFRef = null;
  }

  /**
   * Initialize the component
   */
  init() {
    this.container = document.getElementById(this.options.containerId);
    if (!this.container) {
      console.error(`Container with id "${this.options.containerId}" not found`);
      return;
    }

    this.createGrid();
    this.setupEventListeners();
    this.setupAutoAnimation();
  }

  /**
   * Create the 3D cube grid
   */
  createGrid() {
    const colGap = typeof this.options.cellGap === 'number'
      ? `${this.options.cellGap}px`
      : this.options.cellGap?.col
        ? `${this.options.cellGap.col}px`
        : '5%';
    const rowGap = typeof this.options.cellGap === 'number'
      ? `${this.options.cellGap}px`
      : this.options.cellGap?.row
        ? `${this.options.cellGap.row}px`
        : '5%';

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'cubes-wrapper';
    wrapper.style.cssText = `
      --cube-face-border: ${this.options.borderStyle};
      --cube-face-bg: ${this.options.faceColor};
      --cube-face-shadow: ${this.options.shadow === true ? '0 0 6px rgba(0,0,0,.5)' : this.options.shadow || 'none'};
      width: 100%;
      height: 100%;
      position: relative;
    `;

    // Create scene
    this.sceneRef = document.createElement('div');
    this.sceneRef.className = 'cubes-scene';
    this.sceneRef.style.cssText = `
      display: grid;
      width: 100%;
      height: 100%;
      grid-template-columns: repeat(${this.options.gridSize}, 1fr);
      grid-template-rows: repeat(${this.options.gridSize}, 1fr);
      column-gap: ${colGap};
      row-gap: ${rowGap};
      perspective: 999999999px;
    `;

    // Create cubes
    for (let r = 0; r < this.options.gridSize; r++) {
      for (let c = 0; c < this.options.gridSize; c++) {
        const cube = document.createElement('div');
        cube.className = 'cube';
        cube.dataset.row = r;
        cube.dataset.col = c;
        cube.style.cssText = `
          position: relative;
          width: 100%;
          height: 100%;
          aspect-ratio: 1 / 1;
          transform-style: preserve-3d;
        `;

        // Create cube faces
        const faces = [
          { class: 'cube-face cube-face--top', transform: 'translateY(-50%) rotateX(90deg)' },
          { class: 'cube-face cube-face--bottom', transform: 'translateY(50%) rotateX(-90deg)' },
          { class: 'cube-face cube-face--left', transform: 'translateX(-50%) rotateY(-90deg)' },
          { class: 'cube-face cube-face--right', transform: 'translateX(50%) rotateY(90deg)' },
          { class: 'cube-face cube-face--front', transform: 'rotateY(0deg)' },
          { class: 'cube-face cube-face--back', transform: 'rotateY(180deg)' }
        ];

        faces.forEach(face => {
          const faceEl = document.createElement('div');
          faceEl.className = face.class;
          faceEl.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${this.options.faceColor};
            border: ${this.options.borderStyle};
            transform: ${face.transform};
            opacity: 1;
            box-shadow: ${this.options.shadow === true ? '0 0 6px rgba(0,0,0,.5)' : this.options.shadow || 'none'};
          `;
          cube.appendChild(faceEl);
        });

        this.sceneRef.appendChild(cube);
      }
    }

    wrapper.appendChild(this.sceneRef);
    this.container.appendChild(wrapper);
  }

  /**
   * Tilt cubes at position
   */
  tiltAt(rowCenter, colCenter) {
    if (!this.sceneRef) return;

    const cubes = this.sceneRef.querySelectorAll('.cube');
    cubes.forEach(cube => {
      const r = +cube.dataset.row;
      const c = +cube.dataset.col;
      const dist = Math.hypot(r - rowCenter, c - colCenter);

      if (dist <= this.options.radius) {
        const pct = 1 - dist / this.options.radius;
        const angle = pct * this.options.maxAngle;
        gsap.to(cube, {
          duration: this.options.duration.enter,
          ease: this.options.easing,
          overwrite: true,
          rotateX: -angle,
          rotateY: angle
        });
      } else {
        gsap.to(cube, {
          duration: this.options.duration.leave,
          ease: 'power3.out',
          overwrite: true,
          rotateX: 0,
          rotateY: 0
        });
      }
    });
  }

  /**
   * Reset all cubes to default rotation
   */
  resetAll() {
    if (!this.sceneRef) return;
    const cubes = this.sceneRef.querySelectorAll('.cube');
    cubes.forEach(cube => {
      gsap.to(cube, {
        duration: this.options.duration.leave,
        rotateX: 0,
        rotateY: 0,
        ease: 'power3.out'
      });
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const onPointerMove = (e) => {
      this.userActiveRef = true;
      if (this.idleTimerRef) clearTimeout(this.idleTimerRef);

      const rect = this.sceneRef.getBoundingClientRect();
      const cellW = rect.width / this.options.gridSize;
      const cellH = rect.height / this.options.gridSize;
      const colCenter = (e.clientX - rect.left) / cellW;
      const rowCenter = (e.clientY - rect.top) / cellH;

      if (this.rafRef) cancelAnimationFrame(this.rafRef);
      this.rafRef = requestAnimationFrame(() => this.tiltAt(rowCenter, colCenter));

      this.idleTimerRef = setTimeout(() => {
        this.userActiveRef = false;
      }, 3000);
    };

    const onPointerLeave = () => {
      this.resetAll();
    };

    const onClick = (e) => {
      if (!this.options.rippleOnClick) return;

      const rect = this.sceneRef.getBoundingClientRect();
      const cellW = rect.width / this.options.gridSize;
      const cellH = rect.height / this.options.gridSize;

      const colHit = Math.floor((e.clientX - rect.left) / cellW);
      const rowHit = Math.floor((e.clientY - rect.top) / cellH);

      const baseRingDelay = 0.15;
      const baseAnimDur = 0.3;
      const baseHold = 0.6;

      const spreadDelay = baseRingDelay / this.options.rippleSpeed;
      const animDuration = baseAnimDur / this.options.rippleSpeed;
      const holdTime = baseHold / this.options.rippleSpeed;

      const rings = {};
      const cubes = this.sceneRef.querySelectorAll('.cube');
      cubes.forEach(cube => {
        const r = +cube.dataset.row;
        const c = +cube.dataset.col;
        const dist = Math.hypot(r - rowHit, c - colHit);
        const ring = Math.round(dist);
        if (!rings[ring]) rings[ring] = [];
        rings[ring].push(cube);
      });

      Object.keys(rings)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach(ring => {
          const delay = ring * spreadDelay;
          const faces = rings[ring].flatMap(cube => Array.from(cube.querySelectorAll('.cube-face')));

          gsap.to(faces, {
            backgroundColor: this.options.rippleColor,
            duration: animDuration,
            delay,
            ease: 'power3.out'
          });
          gsap.to(faces, {
            backgroundColor: this.options.faceColor,
            duration: animDuration,
            delay: delay + animDuration + holdTime,
            ease: 'power3.out'
          });
        });
    };

    this.sceneRef.addEventListener('pointermove', onPointerMove);
    this.sceneRef.addEventListener('pointerleave', onPointerLeave);
    this.sceneRef.addEventListener('click', onClick);

    this._onPointerMove = onPointerMove;
    this._onPointerLeave = onPointerLeave;
    this._onClick = onClick;
  }

  /**
   * Setup auto animation when idle
   */
  setupAutoAnimation() {
    if (!this.options.autoAnimate) return;

    this.simPosRef = {
      x: Math.random() * this.options.gridSize,
      y: Math.random() * this.options.gridSize
    };
    this.simTargetRef = {
      x: Math.random() * this.options.gridSize,
      y: Math.random() * this.options.gridSize
    };

    const speed = 0.02;
    const loop = () => {
      if (!this.userActiveRef) {
        const pos = this.simPosRef;
        const tgt = this.simTargetRef;
        pos.x += (tgt.x - pos.x) * speed;
        pos.y += (tgt.y - pos.y) * speed;
        this.tiltAt(pos.y, pos.x);
        if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
          this.simTargetRef = {
            x: Math.random() * this.options.gridSize,
            y: Math.random() * this.options.gridSize
          };
        }
      }
      this.simRAFRef = requestAnimationFrame(loop);
    };
    this.simRAFRef = requestAnimationFrame(loop);
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.rafRef) cancelAnimationFrame(this.rafRef);
    if (this.simRAFRef) cancelAnimationFrame(this.simRAFRef);
    if (this.idleTimerRef) clearTimeout(this.idleTimerRef);

    if (this.sceneRef) {
      this.sceneRef.removeEventListener('pointermove', this._onPointerMove);
      this.sceneRef.removeEventListener('pointerleave', this._onPointerLeave);
      this.sceneRef.removeEventListener('click', this._onClick);
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Cubes;
}
