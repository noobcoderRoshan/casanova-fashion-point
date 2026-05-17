/**
 * Advanced Lanyard Component - Physics-based rope simulation
 * Based on React Bits Lanyard component, vanilla Three.js version
 * Requires: Three.js, cannon-es (or use simplified version below)
 */

class LanyardAdvanced {
  constructor(containerId = 'lanyard-container', options = {}) {
    this.containerId = containerId;
    this.options = {
      position: options.position || [0, 0, 30],
      gravity: options.gravity || [0, -40, 0],
      fov: options.fov || 20,
      transparent: options.transparent !== false,
      cardPath: options.cardPath || null,
      lanyardPath: options.lanyardPath || null,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.container = null;
    this.isDragging = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.dragPoint = new THREE.Vector3();
    
    // Rope segments
    this.segments = [];
    this.segmentCount = 4;
    this.ropeLine = null;
    this.card = null;
  }

  init() {
    console.log('[LanyardAdvanced] Init called');
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('[LanyardAdvanced] Container not found:', this.containerId);
      return;
    }
    
    console.log('[LanyardAdvanced] Container found:', this.container);
    console.log('[LanyardAdvanced] THREE available:', typeof THREE !== 'undefined');
    
    if (typeof THREE === 'undefined') {
      console.error('[LanyardAdvanced] THREE.js not loaded!');
      // Show fallback message
      this.container.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Three.js library not loaded</div>';
      return;
    }

    try {
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupLights();
      this.createRope();
      this.loadCard();
      this.setupEventListeners();
      this.animate();
      console.info('[LanyardAdvanced] Initialized successfully');
    } catch (err) {
      console.error('[LanyardAdvanced] Fatal error during init:', err);
      this.container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Error: ' + err.message + '</div>';
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1220);
    this.scene.fog = new THREE.Fog(0x1a1220, 100, 500);
  }

  setupCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      this.options.fov,
      width / height,
      0.1,
      1000
    );
    this.camera.position.set(...this.options.position);
    this.camera.lookAt(0, -0.5, 0);
  }

  setupRenderer() {
    const width = this.container.clientWidth || 360;
    const height = this.container.clientHeight || 480;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: this.options.transparent,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.far = 50;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-10, 5, -10);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.PointLight(0xffffff, 0.4);
    rimLight.position.set(0, 0, 15);
    this.scene.add(rimLight);
  }

  createRope() {
    // Create rope using TubeGeometry or Line
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push(new THREE.Vector3(0, 3 - (i * 0.75), 0));
    }

    // Use line for rope
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x333333,
      linewidth: 8
    });
    this.ropeLine = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(this.ropeLine);

    // Initialize segments
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push({
        position: new THREE.Vector3(0, 3 - (i * 0.75), 0),
        prevPosition: new THREE.Vector3(0, 3 - (i * 0.75), 0),
        pinned: i === this.segmentCount - 1,
        mass: 1
      });
    }
  }

  loadCard() {
    console.log('[LanyardAdvanced] Loading card...');
    try {
      // Create a larger card box
      const width = 3.2;
      const height = 4.5;
      const depth = 0.05;

      const geometry = new THREE.BoxGeometry(width, height, depth);
      console.log('[LanyardAdvanced] Geometry created');

      // Create canvas texture
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1400;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context is null');
      }

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1000, 1400);

      // Border
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, 960, 1360);

      // Decorative circle
      ctx.fillStyle = '#f0f0f0';
      ctx.beginPath();
      ctx.arc(500, 250, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text - larger and clearer
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 120px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CASANOVA', 500, 450);

      ctx.font = 'bold 90px monospace';
      ctx.fillText('FASHION POINT', 500, 590);

      ctx.font = 'bold 60px monospace';
      ctx.fillStyle = '#000000';
      ctx.fillText('@Casanova_guy_since2004', 500, 800);

      ctx.font = '32px monospace';
      ctx.fillStyle = '#666666';
      ctx.fillText('Premium Menswear', 500, 950);

      // Bottom bar - make it more visible
      ctx.fillStyle = '#ff9900';
      ctx.fillRect(80, 1050, 840, 80);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 38px monospace';
      ctx.fillText('instagram.com/@Casanova_guy_since2004', 500, 1095);

      console.log('[LanyardAdvanced] Canvas drawn, creating texture...');

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;

      // Material that will definitely show
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.FrontSide,
        shininess: 100,
        color: 0xffffff
      });

      console.log('[LanyardAdvanced] Material created, adding mesh...');

      this.card = new THREE.Mesh(geometry, material);
      this.card.position.set(0, -1.0, 0);
      this.card.castShadow = true;
      this.card.receiveShadow = true;
      this.card.userData.velocity = new THREE.Vector3();
      this.card.userData.angularVelocity = new THREE.Vector3();
      this.card.userData.targetRotX = 0;
      this.card.userData.targetRotY = 0;
      this.card.userData.rotationEasing = 0.08; // Smooth easing

      this.scene.add(this.card);
      console.log('[LanyardAdvanced] Card added to scene successfully');
    } catch (err) {
      console.error('[LanyardAdvanced] Error loading card:', err);
      // Fallback - add a simple white box
      const geometry = new THREE.BoxGeometry(3.2, 4.5, 0.05);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.card = new THREE.Mesh(geometry, material);
      this.card.position.set(0, -1.0, 0);
      this.card.userData.targetRotX = 0;
      this.card.userData.targetRotY = 0;
      this.card.userData.rotationEasing = 0.08;
      this.scene.add(this.card);
      console.warn('[LanyardAdvanced] Using fallback white box');
    }
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    document.addEventListener('touchmove', (e) => this.onTouchMove(e));
    document.addEventListener('touchstart', (e) => this.onTouchStart(e));
    document.addEventListener('touchend', (e) => this.onTouchEnd(e));
    window.addEventListener('resize', () => this.onWindowResize());
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!this.isDragging && this.card) {
      // Smoother rotation based on mouse position
      this.card.userData.targetRotY = this.mouse.x * 0.6;
      this.card.userData.targetRotX = -this.mouse.y * 0.5;
    }

    if (this.isDragging && this.card) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPoint);
      this.card.position.x += (this.dragPoint.x - this.card.position.x) * 0.15;
      this.card.position.y += (this.dragPoint.y - this.card.position.y) * 0.15;
    }
  }

  onMouseDown(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.card);

    if (intersects.length > 0) {
      this.isDragging = true;
      this.dragPlane.setFromNormalAndCoplanarPoint(
        this.camera.getWorldDirection(new THREE.Vector3()),
        this.card.position
      );
      document.body.style.cursor = 'grabbing';
    }
  }

  onMouseUp() {
    this.isDragging = false;
    document.body.style.cursor = 'auto';
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      if (this.isDragging && this.card) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPoint);
        this.card.position.x += (this.dragPoint.x - this.card.position.x) * 0.1;
        this.card.position.y += (this.dragPoint.y - this.card.position.y) * 0.1;
      }
    }
  }

  onTouchStart(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.card);

      if (intersects.length > 0) {
        this.isDragging = true;
        this.dragPlane.setFromNormalAndCoplanarPoint(
          this.camera.getWorldDirection(new THREE.Vector3()),
          this.card.position
        );
      }
    }
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  updateRope() {
    if (!this.card) return;

    // Simple rope physics
    const gravity = 0.98;
    const damping = 0.99;
    const constraintIterations = 2;

    for (let i = 0; i < this.segments.length - 1; i++) {
      const segment = this.segments[i];
      if (!segment.pinned) {
        const vx = (segment.position.x - segment.prevPosition.x) * damping;
        const vy = (segment.position.y - segment.prevPosition.y) * damping;
        const vz = (segment.position.z - segment.prevPosition.z) * damping;

        segment.prevPosition.copy(segment.position);
        segment.position.x += vx;
        segment.position.y += vy + gravity;
        segment.position.z += vz;
      }
    }

    // Constraint: last segment follows card
    this.segments[this.segments.length - 1].position.copy(this.card.position);
    this.segments[this.segments.length - 1].prevPosition.copy(this.card.position);

    // Apply constraints
    for (let iter = 0; iter < constraintIterations; iter++) {
      for (let i = 0; i < this.segments.length - 1; i++) {
        const seg1 = this.segments[i];
        const seg2 = this.segments[i + 1];
        const restDistance = 0.75;

        const dx = seg2.position.x - seg1.position.x;
        const dy = seg2.position.y - seg1.position.y;
        const dz = seg2.position.z - seg1.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const diff = (restDistance - dist) / dist;

        if (!seg1.pinned) {
          seg1.position.x -= dx * diff * 0.5;
          seg1.position.y -= dy * diff * 0.5;
          seg1.position.z -= dz * diff * 0.5;
        }

        if (!seg2.pinned) {
          seg2.position.x += dx * diff * 0.5;
          seg2.position.y += dy * diff * 0.5;
          seg2.position.z += dz * diff * 0.5;
        }
      }
    }

    // Update rope geometry
    if (this.ropeLine) {
      const points = this.segments.map(s => s.position);
      this.ropeLine.geometry.setFromPoints(points);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.card && !this.isDragging) {
      // Smooth easing for rotation - use stored easing value or default
      const easing = this.card.userData.rotationEasing || 0.08;
      
      // Apply smooth interpolation
      this.card.rotation.x += (this.card.userData.targetRotX - this.card.rotation.x) * easing;
      this.card.rotation.y += (this.card.userData.targetRotY - this.card.rotation.y) * easing;

      // Subtle floating animation when not dragging
      const floatY = Math.sin(Date.now() * 0.0005) * 0.2;
      const baseY = -1.0;
      this.card.position.y = baseY + floatY;
    }

    // Update rope
    this.updateRope();

    this.renderer.render(this.scene, this.camera);
  }
}

// Export
window.LanyardAdvanced = LanyardAdvanced;
