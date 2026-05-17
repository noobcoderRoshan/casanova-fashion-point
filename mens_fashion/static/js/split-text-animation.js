/**
 * SplitText Animation - Vanilla JavaScript version using GSAP
 * Animates text by splitting it into characters with stagger effect
 */

class SplitTextAnimation {
  constructor(options = {}) {
    this.elements = [];
    this.defaults = {
      delay: 50,
      duration: 1.25,
      ease: 'power3.out',
      splitType: 'chars', // 'chars', 'words', or 'lines'
      from: { opacity: 0, y: 40 },
      to: { opacity: 1, y: 0 },
      threshold: 0.1,
      triggerOnScroll: true,
      onComplete: null
    };
    this.config = { ...this.defaults, ...options };
  }

  /**
   * Initialize animation on elements
   * @param {string|HTMLElement} selector - CSS selector or DOM element
   */
  init(selector) {
    let elementsToAnimate = [];

    if (typeof selector === 'string') {
      elementsToAnimate = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof HTMLElement) {
      elementsToAnimate = [selector];
    }

    elementsToAnimate.forEach(el => {
      if (!el._splitTextInitialized) {
        this.animateElement(el);
        el._splitTextInitialized = true;
      }
    });

    return this;
  }

  /**
   * Split text into individual characters and wrap them
   * @param {HTMLElement} element
   */
  splitText(element) {
    const text = element.textContent.trim();
    const fragments = [];

    if (this.config.splitType === 'chars') {
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
        span.style.display = 'inline-block';
        fragments.push(span);
      });
    } else if (this.config.splitType === 'words') {
      text.split(/\s+/).forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'split-word';
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.25em';
        fragments.push(span);
      });
    }

    // Clear original content and add fragments
    element.textContent = '';
    fragments.forEach(frag => {
      element.appendChild(frag);
    });

    return fragments;
  }

  /**
   * Animate element using GSAP
   * @param {HTMLElement} element
   */
  animateElement(element) {
    if (!window.gsap) {
      console.error('GSAP is not loaded. Please include GSAP library.');
      return;
    }

    const fragments = this.splitText(element);

    if (fragments.length === 0) return;

    // Set initial state
    gsap.set(fragments, this.config.from);

    if (this.config.triggerOnScroll) {
      // Scroll-triggered animation
      gsap.to(fragments, {
        ...this.config.to,
        duration: this.config.duration,
        ease: this.config.ease,
        stagger: this.config.delay / 1000,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
          markers: false
        },
        onComplete: () => {
          if (this.config.onComplete) {
            this.config.onComplete(element);
          }
        }
      });
    } else {
      // Immediate animation
      gsap.to(fragments, {
        ...this.config.to,
        duration: this.config.duration,
        ease: this.config.ease,
        stagger: this.config.delay / 1000,
        onComplete: () => {
          if (this.config.onComplete) {
            this.config.onComplete(element);
          }
        }
      });
    }
  }

  /**
   * Reverse animation
   * @param {string|HTMLElement} selector
   */
  reverse(selector) {
    let elementsToReverse = [];

    if (typeof selector === 'string') {
      elementsToReverse = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof HTMLElement) {
      elementsToReverse = [selector];
    }

    elementsToReverse.forEach(el => {
      const chars = el.querySelectorAll('.split-char, .split-word');
      gsap.to(chars, {
        ...this.config.from,
        duration: this.config.duration * 0.5,
        ease: 'power2.in',
        stagger: this.config.delay / 1000 * 0.5
      });
    });

    return this;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SplitTextAnimation;
}
