/**
 * MagicBento Component - Vanilla JavaScript Version
 * Interactive card grid with particles, spotlight, and glow effects
 */

class MagicBento {
  constructor(options = {}) {
    this.options = {
      textAutoHide: options.textAutoHide !== false,
      enableStars: options.enableStars !== false,
      enableSpotlight: options.enableSpotlight !== false,
      enableBorderGlow: options.enableBorderGlow !== false,
      enableTilt: options.enableTilt || false,
      enableMagnetism: options.enableMagnetism !== false,
      clickEffect: options.clickEffect !== false,
      spotlightRadius: options.spotlightRadius || 300,
      particleCount: options.particleCount || 12,
      glowColor: options.glowColor || '255, 255, 255',
      disableAnimations: options.disableAnimations || false,
      containerId: options.containerId || 'magic-bento-grid',
      cardData: options.cardData || []
    };

    this.isMobile = window.innerWidth <= 768;
    this.container = null;
    this.spotlight = null;
    this.cards = [];
  }

  /**
   * Initialize MagicBento
   */
  init() {
    this.container = document.getElementById(this.options.containerId);
    if (!this.container) return;

    this.createCards();
    if (this.options.enableSpotlight) {
      this.setupGlobalSpotlight();
    }
    this.setupEventListeners();
  }

  /**
   * Create card elements
   */
  createCards() {
    this.options.cardData.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = `magic-bento-card ${this.options.textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${this.options.enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`;
      cardEl.innerHTML = `
        <div class="magic-bento-card__header">
          <div class="magic-bento-card__label">${card.label || 'Feature'}</div>
        </div>
        <div class="magic-bento-card__content">
          <h2 class="magic-bento-card__title">${card.title || 'Card'}</h2>
          <p class="magic-bento-card__description">${card.description || ''}</p>
        </div>
      `;
      cardEl.style.backgroundColor = card.color || '#1a1a1a';
      cardEl.dataset.index = index;

      // Attach particle container if stars enabled
      if (this.options.enableStars) {
        cardEl.classList.add('particle-container');
      }

      this.setupCardInteractions(cardEl);
      this.container.appendChild(cardEl);
      this.cards.push(cardEl);
    });
  }

  /**
   * Setup card interactions
   */
  setupCardInteractions(card) {
    const particlesList = [];
    let isHovered = false;

    card.addEventListener('mouseenter', () => {
      if (this.options.disableAnimations || this.isMobile) return;
      isHovered = true;

      if (this.options.enableStars) {
        this.animateParticles(card, particlesList);
      }

      if (this.options.enableTilt) {
        gsap.to(card, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;

      if (this.options.enableStars) {
        this.clearParticles(particlesList);
      }

      if (this.options.enableTilt) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (this.options.enableMagnetism) {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    card.addEventListener('mousemove', (e) => {
      if (this.options.disableAnimations || this.isMobile) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (this.options.enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (this.options.enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        gsap.to(card, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      // Update glow position
      if (this.options.enableBorderGlow) {
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        card.style.setProperty('--glow-x', `${relativeX}%`);
        card.style.setProperty('--glow-y', `${relativeY}%`);
      }
    });

    card.addEventListener('click', (e) => {
      if (this.options.clickEffect && !this.options.disableAnimations) {
        this.createRipple(card, e);
      }
    });
  }

  /**
   * Animate particles on hover
   */
  animateParticles(card, particlesList) {
    const { width, height } = card.getBoundingClientRect();

    for (let i = 0; i < this.options.particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(${this.options.glowColor}, 1);
          box-shadow: 0 0 6px rgba(${this.options.glowColor}, 0.6);
          pointer-events: none;
          z-index: 100;
          left: ${Math.random() * width}px;
          top: ${Math.random() * height}px;
        `;

        card.appendChild(particle);
        particlesList.push(particle);

        gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(particle, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, i * 100);
    }
  }

  /**
   * Clear particles
   */
  clearParticles(particlesList) {
    particlesList.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesList.length = 0;
  }

  /**
   * Create ripple effect on click
   */
  createRipple(card, e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${maxDistance * 2}px;
      height: ${maxDistance * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(${this.options.glowColor}, 0.4) 0%, rgba(${this.options.glowColor}, 0.2) 30%, transparent 70%);
      left: ${x - maxDistance}px;
      top: ${y - maxDistance}px;
      pointer-events: none;
      z-index: 1000;
    `;

    card.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      }
    );
  }

  /**
   * Setup global spotlight
   */
  setupGlobalSpotlight() {
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${this.options.glowColor}, 0.15) 0%,
        rgba(${this.options.glowColor}, 0.08) 15%,
        rgba(${this.options.glowColor}, 0.04) 25%,
        rgba(${this.options.glowColor}, 0.02) 40%,
        rgba(${this.options.glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    this.spotlight = spotlight;

    document.addEventListener('mousemove', (e) => {
      if (this.options.disableAnimations || this.isMobile || !this.container) return;

      const section = this.container.closest('.bento-section') || this.container;
      const rect = section.getBoundingClientRect();
      const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!isInside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        this.cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
        return;
      }

      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(spotlight, {
        opacity: 0.6,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }
}

// Export for use
window.MagicBento = MagicBento;
