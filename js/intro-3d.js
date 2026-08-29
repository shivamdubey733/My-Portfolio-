/**
 * =========================================================================
 * Bespoke 3D WebGL Intro Experience for Shivam Dubey Portfolio
 * - Three.js 3D depth scene with interactive lighting & mouse parallax
 * - Multi-layer 3D glowing typography & 1,500+ interactive particle field
 * - Geometric wireframe hardware accents & dynamic light sweep
 * - Cinematic zoom-through transition into the Hero Section
 * =========================================================================
 */

(function () {
  'use strict';

  const introContainer = document.getElementById('intro-3d-wrapper');
  const canvasContainer = document.getElementById('intro-canvas-container');
  const enterBtn = document.getElementById('btn-enter-portfolio');
  const skipBtn = document.getElementById('btn-skip-intro');
  const progressBar = document.getElementById('intro-progress-bar');
  const progressText = document.getElementById('intro-progress-text');

  if (!introContainer || !canvasContainer || typeof THREE === 'undefined') {
    return;
  }

  // --- THREE.JS SCENE SETUP ---
  let scene, camera, renderer;
  let particlesMesh, textGroup, geometricGroup;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let animFrameId;
  let isTransitioning = false;
  let startTime = Date.now();
  const AUTO_ENTER_DURATION = 4200; // ms

  function initThreeScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.0018);

    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 850;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0c10, 1);
    canvasContainer.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x222630, 1.2);
    scene.add(ambientLight);

    const orangeLight = new THREE.PointLight(0xf97316, 2.5, 1200);
    orangeLight.position.set(200, 150, 400);
    scene.add(orangeLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 1.8, 1000);
    blueLight.position.set(-250, -100, 300);
    scene.add(blueLight);

    const cursorLight = new THREE.PointLight(0xffedd5, 1.5, 600);
    cursorLight.position.set(0, 0, 500);
    scene.add(cursorLight);

    // Store lights for mouse tracking
    scene.userData = { orangeLight, blueLight, cursorLight };

    // --- PARTICLE FIELD ---
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const color1 = new THREE.Color(0xf97316); // Orange
    const color2 = new THREE.Color(0xfbbf24); // Amber
    const color3 = new THREE.Color(0x38bdf8); // Sky blue
    const color4 = new THREE.Color(0xffffff); // White sparkle

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2200;
      positions[i3 + 1] = (Math.random() - 0.5) * 1400;
      positions[i3 + 2] = (Math.random() - 0.5) * 1600;

      // Color distribution
      const rand = Math.random();
      let chosenColor;
      if (rand < 0.45) chosenColor = color1;
      else if (rand < 0.7) chosenColor = color2;
      else if (rand < 0.85) chosenColor = color3;
      else chosenColor = color4;

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;

      scales[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with round glowing texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(249, 115, 22, 0.8)');
    grad.addColorStop(0.8, 'rgba(249, 115, 22, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 14,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particlesMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(particlesMesh);

    // --- 3D FLOATING HARDWARE & GEOMETRIC ACCENTS ---
    geometricGroup = new THREE.Group();

    // 1. Sleek wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(90, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: 0xf97316,
      emissiveIntensity: 0.2
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-420, 160, -200);
    geometricGroup.add(icoMesh);

    // 2. Rotating Torus ring (circuit orbital)
    const torusGeo = new THREE.TorusGeometry(140, 2, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.3
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(400, -120, -150);
    torusMesh.rotation.x = Math.PI / 3;
    geometricGroup.add(torusMesh);

    // 3. Silicon Octahedron
    const octGeo = new THREE.OctahedronGeometry(60);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    octMesh.position.set(380, 200, -300);
    geometricGroup.add(octMesh);

    scene.add(geometricGroup);

    // --- EVENTS ---
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    mouse.targetX = (event.clientX - windowHalfX) * 0.5;
    mouse.targetY = (event.clientY - windowHalfY) * 0.5;
  }

  function onTouchMove(event) {
    if (event.touches.length > 0) {
      mouse.targetX = (event.touches[0].clientX - windowHalfX) * 0.5;
      mouse.targetY = (event.touches[0].clientY - windowHalfY) * 0.5;
    }
  }

  // --- ANIMATION LOOP ---
  function animate() {
    if (isTransitioning) return;
    animFrameId = requestAnimationFrame(animate);

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Camera parallax
    camera.position.x = mouse.x * 0.4;
    camera.position.y = -mouse.y * 0.4;
    camera.lookAt(scene.position);

    // Cursor light following
    if (scene.userData.cursorLight) {
      scene.userData.cursorLight.position.x = mouse.x * 1.2;
      scene.userData.cursorLight.position.y = -mouse.y * 1.2;
    }

    // Rotate particle field slowly
    if (particlesMesh) {
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0004;
    }

    // Rotate geometric shapes
    if (geometricGroup) {
      geometricGroup.children.forEach((mesh, index) => {
        mesh.rotation.x += 0.004 * (index % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.006 * (index % 2 === 0 ? -1 : 1);
      });
    }

    // Dynamic 3D depth text tilt based on mouse
    const intro3DText = document.getElementById('intro-3d-text-container');
    if (intro3DText) {
      const tiltX = (mouse.y / windowHalfY) * 16;
      const tiltY = -(mouse.x / windowHalfX) * 20;
      intro3DText.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(30px)`;
    }

    // Update progress timer
    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, Math.floor((elapsed / AUTO_ENTER_DURATION) * 100));
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
    if (progressText) {
      progressText.textContent = `${progress}%`;
    }

    // Auto trigger entry once progress reaches 100%
    if (elapsed >= AUTO_ENTER_DURATION && !isTransitioning) {
      exitIntroScene();
    }

    renderer.render(scene, camera);
  }

  // --- TRANSITION INTO HERO PAGE ---
  function exitIntroScene() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Smooth GSAP or Three.js camera zoom warp
    if (typeof gsap !== 'undefined') {
      // Zoom camera forward through the 3D text
      gsap.to(camera.position, {
        z: -600,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => {
          renderer.render(scene, camera);
        }
      });

      // Fade out overlay with scale
      gsap.to(introContainer, {
        opacity: 0,
        scale: 1.05,
        duration: 1.1,
        ease: 'power2.inOut',
        onComplete: cleanupIntro
      });

      // Animate Hero elements in
      const hero = document.getElementById('hero');
      if (hero) {
        gsap.fromTo(
          hero,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, delay: 0.4, ease: 'power2.out' }
        );
      }
    } else {
      // Fallback CSS transition
      introContainer.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s ease';
      introContainer.style.opacity = '0';
      introContainer.style.transform = 'scale(1.04)';
      setTimeout(cleanupIntro, 900);
    }
  }

  function cleanupIntro() {
    introContainer.style.display = 'none';
    if (animFrameId) cancelAnimationFrame(animFrameId);
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('mousemove', onMouseMove);

    // Clean up Three.js memory
    if (renderer) {
      renderer.dispose();
    }
  }

  // Attach button listeners
  if (enterBtn) {
    enterBtn.addEventListener('click', exitIntroScene);
  }
  if (skipBtn) {
    skipBtn.addEventListener('click', exitIntroScene);
  }

  // Initialize and run
  initThreeScene();
  animate();
})();
