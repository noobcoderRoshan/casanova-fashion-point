/**
 * MagnetLines Component - Vanilla JavaScript Version
 * Interactive grid of lines that rotate based on mouse position
 */

class MagnetLines {
  constructor(options = {}) {
    this.options = {
      rows: options.rows || 9,
      columns: options.columns || 9,
      containerSize: options.containerSize || '80vmin',
      lineColor: options.lineColor || '#efefef',
      lineWidth: options.lineWidth || '1vmin',
      lineHeight: options.lineHeight || '6vmin',
      baseAngle: options.baseAngle !== undefined ? options.baseAngle : -10,
      containerClass: options.containerClass || 'magnetLines-container',
      containerId: options.containerId || null,
      opacity: options.opacity || 0.5
    };

    this.container = null;
    this.items = [];
    this.bound = false;
  }

  /**
   * Initialize the component
   */
  init() {
    // Find or create container
    if (this.options.containerId) {
      this.container = document.getElementById(this.options.containerId);
    }

    if (!this.container) {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
    }

    this.container.className = this.options.containerClass;
    this.container.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${this.options.columns}, 1fr);
      grid-template-rows: repeat(${this.options.rows}, 1fr);
      width: 100vw;
      height: 100vh;
      justify-items: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: -100;
      opacity: ${this.options.opacity};
    `;

    // Create grid items
    this.createGrid();

    // Bind pointer events
    this.bindPointerEvents();
  }

  /**
   * Create grid of line elements
   */
  createGrid() {
    const total = this.options.rows * this.options.columns;

    for (let i = 0; i < total; i++) {
      const span = document.createElement('span');
      span.style.cssText = `
        display: block;
        width: ${this.options.lineWidth};
        height: ${this.options.lineHeight};
        background-color: ${this.options.lineColor};
        transform-origin: center;
        will-change: transform;
        transition: transform 0.1s ease-out;
        transform: rotate(${this.options.baseAngle}deg);
      `;
      this.container.appendChild(span);
      this.items.push(span);
    }
  }

  /**
   * Bind pointer movement events
   */
  bindPointerEvents() {
    let lastUpdate = 0;
    const throttleDelay = 16; // ~60fps throttle
    
    const onPointerMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate >= throttleDelay) {
        this.updateRotation(e.clientX, e.clientY);
        lastUpdate = now;
      }
    };

    window.addEventListener('pointermove', onPointerMove);

    // Initialize with center position
    if (this.items.length) {
      const middleIndex = Math.floor(this.items.length / 2);
      const rect = this.items[middleIndex].getBoundingClientRect();
      this.updateRotation(rect.x, rect.y);
    }

    // Store for cleanup
    this._onPointerMove = onPointerMove;
  }

  /**
   * Update line rotations based on pointer position
   */
  updateRotation(pointerX, pointerY) {
    this.items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;

      const b = pointerX - centerX;
      const a = pointerY - centerY;
      const c = Math.sqrt(a * a + b * b) || 1;
      const r = ((Math.acos(b / c) * 180) / Math.PI) * (pointerY > centerY ? 1 : -1);

      item.style.transform = `rotate(${r}deg)`;
    });
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    if (this._onPointerMove) {
      window.removeEventListener('pointermove', this._onPointerMove);
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.items = [];
    this.container = null;
  }
}

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', function() {
  const magnetLineElements = document.querySelectorAll('[data-magnet-lines]');
  magnetLineElements.forEach(el => {
    const options = {
      rows: parseInt(el.dataset.rows || 9),
      columns: parseInt(el.dataset.columns || 9),
      containerSize: el.dataset.containerSize || '80vmin',
      lineColor: el.dataset.lineColor || '#efefef',
      lineWidth: el.dataset.lineWidth || '1vmin',
      lineHeight: el.dataset.lineHeight || '6vmin',
      baseAngle: parseInt(el.dataset.baseAngle || -10),
      opacity: parseFloat(el.dataset.opacity || 0.5),
      containerId: el.id
    };
    const magnet = new MagnetLines(options);
    magnet.init();
  });
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MagnetLines;
}
