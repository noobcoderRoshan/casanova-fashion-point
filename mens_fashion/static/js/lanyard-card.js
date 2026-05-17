/**
 * Lanyard Component - Vanilla Three.js Version
 * Interactive 3D card on a lanyard
 */

class LanyardCard {
  constructor(containerId = 'lanyard-container', options = {}) {
    this.containerId = containerId;
    this.options = {
      text: options.text || 'Casanova_guy_since2004',
      position: options.position || [0, 0, 30],
      gravity: options.gravity || [0, -40, 0],
      fov: options.fov || 20,
      transparent: options.transparent !== false,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.container = null;
    this.card = null;
    this.lanyard = null;
    this.isDragging = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.dragPoint = new THREE.Vector3();
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('[LanyardCard] container not found:', this.containerId);
      return;
    }

    if (typeof THREE === 'undefined') {
      console.error('[LanyardCard] THREE is not loaded. Make sure three.js is included before lanyard-card.js');
      return;
    }

    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.createLanyard();
    this.createCard();
    this.setupLights();
    this.setupEventListeners();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background
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
    this.camera.position.set(0, 0, 12);
    this.camera.lookAt(0, 0.5, 0);
  }

  setupRenderer() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: this.options.transparent
    });
    // If container has zero dimensions (CSS not applied yet), fallback to sensible defaults
    const renderWidth = width > 0 ? width : 360;
    const renderHeight = height > 0 ? height : 480;
    if (width === 0 || height === 0) {
      console.warn('[LanyardCard] container has zero size, using fallback renderer size', renderWidth, renderHeight);
      this.container.style.width = renderWidth + 'px';
      this.container.style.height = renderHeight + 'px';
    }
    this.renderer.setSize(renderWidth, renderHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.domElement.style.display = 'block';
    this.container.appendChild(this.renderer.domElement);
    console.info('[LanyardCard] renderer attached', this.renderer.domElement);
  }

  createLanyard() {
    // Create lanyard band using a better approach
    const lanyardGroup = new THREE.Group();

    // Create the lanyard band (rectangle shape)
    const bandGeometry = new THREE.PlaneGeometry(0.3, 8);
    const bandMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.2,
      roughness: 0.8,
      side: THREE.DoubleSide
    });

    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.castShadow = true;
    band.receiveShadow = true;
    lanyardGroup.add(band);

    // Add chain links at top
    const chainGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8);
    const chainMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.6,
      roughness: 0.4
    });

    for (let i = 0; i < 3; i++) {
      const link = new THREE.Mesh(chainGeometry, chainMaterial);
      link.position.y = 4 + (i * 0.25);
      link.castShadow = true;
      link.receiveShadow = true;
      lanyardGroup.add(link);
    }

    this.scene.add(lanyardGroup);
    this.lanyard = lanyardGroup;
  }

  createCard() {
    console.info('[LanyardCard] Starting createCard...');
    try {
      const width = 2.5;
      const height = 3.5;
      const depth = 0.05;
      const geometry = new THREE.BoxGeometry(width, height, depth);
      
      // Create canvas texture
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas 2D context is null');
      }
      
      console.info('[LanyardCard] Canvas ready, drawing...');

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1000, 1400);

      // Border
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, 960, 1360);

      // Circle
      ctx.fillStyle = '#f0f0f0';
      ctx.beginPath();
      ctx.arc(500, 250, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text - use monospace as guaranteed fallback
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 90px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CASANOVA', 500, 450);

      ctx.font = 'bold 70px monospace';
      ctx.fillText('FASHION POINT', 500, 570);

      ctx.font = 'bold 52px monospace';
      ctx.fillStyle = '#ff9900';
      ctx.fillText('@Casanova_guy_since2004', 500, 750);

      ctx.font = '32px monospace';
      ctx.fillStyle = '#666666';
      ctx.fillText('Premium Menswear', 500, 900);
      ctx.fillText('Follow for Updates', 500, 970);

      ctx.fillStyle = '#ff9900';
      ctx.fillRect(80, 1100, 840, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('instagram.com/@Casanova_guy_since2004', 500, 1135);

      // Create texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      
      console.info('[LanyardCard] Canvas texture created');

      // Material with both texture and white color fallback
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
        color: 0xffffff
      });

      this.card = new THREE.Mesh(geometry, material);
      this.card.position.set(0, 0.5, 0);
      this.card.castShadow = true;
      this.card.receiveShadow = true;
      this.card.userData.targetRotationX = 0;
      this.card.userData.targetRotationY = 0;
      
      this.scene.add(this.card);
      console.info('[LanyardCard] Card added to scene');
      
    } catch (err) {
      console.error('[LanyardCard] Error:', err);
      // Fallback: white box
      const geometry = new THREE.BoxGeometry(2.5, 3.5, 0.05);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.card = new THREE.Mesh(geometry, material);
      this.card.position.set(0, 0.5, 0);
      this.card.userData.targetRotationX = 0;
      this.card.userData.targetRotationY = 0;
      this.scene.add(this.card);
      console.warn('[LanyardCard] Using fallback white box');
    }
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 5, -7);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.PointLight(0xffffff, 0.3);
    rimLight.position.set(0, 0, 10);
    this.scene.add(rimLight);
  }

  setupEventListeners() {
    // Mouse events
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));

    // Touch events
    document.addEventListener('touchmove', (e) => this.onTouchMove(e));
    document.addEventListener('touchstart', (e) => this.onTouchStart(e));
    document.addEventListener('touchend', (e) => this.onTouchEnd(e));

    // Resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!this.isDragging && this.card) {
      // Rotate card based on mouse position
      this.card.userData.targetRotationY = this.mouse.x * 0.5;
      this.card.userData.targetRotationX = -this.mouse.y * 0.3;
    }

    if (this.isDragging && this.card) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPoint);
      this.card.position.x = this.dragPoint.x;
      this.card.position.y = this.dragPoint.y;
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
    const touch = event.touches[0];
    this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

    if (this.isDragging && this.card) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPoint);
      this.card.position.x = this.dragPoint.x;
      this.card.position.y = this.dragPoint.y;
    }
  }

  onTouchStart(event) {
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

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.card && !this.isDragging) {
      // Smooth rotation
      this.card.rotation.x += (this.card.userData.targetRotationX - this.card.rotation.x) * 0.1;
      this.card.rotation.y += (this.card.userData.targetRotationY - this.card.rotation.y) * 0.1;

      // Slight floating animation
      this.card.position.y = 2 + Math.sin(Date.now() * 0.001) * 0.3;
    }

    // Lanyard animation
    if (this.lanyard) {
      this.lanyard.rotation.z = Math.sin(Date.now() * 0.0005) * 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Export for use
window.LanyardCard = LanyardCard;
