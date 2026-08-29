/* ==========================================================================
   THREE.JS 3D TECHNICAL & ELECTRONICS HERO SCENE
   Replaces abstract shapes with real 3D VLSI & Hardware Engineering models:
   1. 3D VLSI Silicon Processor / IC Package with Golden Pins & Die (Bottom-Right)
   2. 3D Digital Clock Waveform / Logic Bus Traces with Signal Pulses (Top-Left)
   3. 3D Silicon Wafer / Crystal Oscillator Component (Top-Right)
   4. 3D Cylindrical Electrolytic Capacitor & SMD Components (Mid-Left)
   5. Glowing Semiconductor Data Particles & Interactive Mouse Physics
   ========================================================================== */

(function() {
  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // ==========================================
  // LIGHTING SYSTEM
  // ==========================================
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
  scene.add(ambientLight);

  const mainDirectional = new THREE.DirectionalLight(0xffffff, 2.0);
  mainDirectional.position.set(12, 16, 14);
  mainDirectional.castShadow = true;
  scene.add(mainDirectional);

  // Warm Copper/Gold accent light
  const goldLight = new THREE.PointLight(0xff8c42, 2.5, 35);
  goldLight.position.set(8, -4, 8);
  scene.add(goldLight);

  // Electric Blue / Silicon Tech accent light
  const blueTechLight = new THREE.PointLight(0x38bdf8, 1.8, 30);
  blueTechLight.position.set(-8, 6, 8);
  scene.add(blueTechLight);

  // Mouse dynamic follower light
  const mouseLight = new THREE.PointLight(0xffb74d, 1.6, 22);
  mouseLight.position.set(0, 0, 10);
  scene.add(mouseLight);

  // ==========================================
  // MATERIALS
  // ==========================================
  // IC Dark Ceramic / Silicon Package
  const icBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181B,
    roughness: 0.35,
    metalness: 0.25,
  });

  // Gold / Copper Metallic Pins
  const goldPinMaterial = new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    roughness: 0.18,
    metalness: 0.92,
  });

  // Silver / Chrome Metallic
  const silverMaterial = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    roughness: 0.15,
    metalness: 0.95,
  });

  // Glowing Orange Silicon Die / Signal Trace
  const glowingTraceMaterial = new THREE.MeshStandardMaterial({
    color: 0xF25B2A,
    emissive: 0xEA580C,
    emissiveIntensity: 0.65,
    roughness: 0.2,
    metalness: 0.5,
  });

  // Capacitor Body Material (Dark Matte Blue / Charcoal)
  const capBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    roughness: 0.3,
    metalness: 0.4,
  });

  // Main Group for interactive parallax & rotation
  const objectsGroup = new THREE.Group();
  scene.add(objectsGroup);

  // =========================================================================
  // 1. BOTTOM-RIGHT: 3D VLSI SILICON IC MICROCHIP (QFP PACKAGE)
  // =========================================================================
  const icGroup = new THREE.Group();

  // Chip Main Ceramic Body
  const chipWidth = 2.4;
  const chipHeight = 0.32;
  const chipDepth = 2.4;
  const chipBodyGeo = new THREE.BoxGeometry(chipWidth, chipHeight, chipDepth);
  const chipBody = new THREE.Mesh(chipBodyGeo, icBodyMaterial);
  icGroup.add(chipBody);

  // Central Gold Die / Heat Spreader
  const dieGeo = new THREE.BoxGeometry(1.3, 0.04, 1.3);
  const dieMesh = new THREE.Mesh(dieGeo, goldPinMaterial);
  dieMesh.position.y = chipHeight / 2 + 0.02;
  icGroup.add(dieMesh);

  // Silicon Core Substrate (Glowing center)
  const coreGeo = new THREE.BoxGeometry(0.75, 0.03, 0.75);
  const coreMesh = new THREE.Mesh(coreGeo, glowingTraceMaterial);
  coreMesh.position.y = chipHeight / 2 + 0.045;
  icGroup.add(coreMesh);

  // Pin 1 Index Indicator Dot
  const dotGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16);
  const dotMesh = new THREE.Mesh(dotGeo, goldPinMaterial);
  dotMesh.position.set(-0.9, chipHeight / 2 + 0.02, -0.9);
  icGroup.add(dotMesh);

  // Metallic Pins Array (Around all 4 sides of the QFP package)
  const pinsPerSide = 8;
  const pinLength = 0.55;
  const pinWidth = 0.08;
  const pinThick = 0.035;
  const pinSpacing = (chipWidth * 0.78) / (pinsPerSide - 1);
  const startOffset = -(chipWidth * 0.78) / 2;

  const pinGeoX = new THREE.BoxGeometry(pinLength, pinThick, pinWidth);
  const pinGeoZ = new THREE.BoxGeometry(pinWidth, pinThick, pinLength);

  for (let i = 0; i < pinsPerSide; i++) {
    const offset = startOffset + i * pinSpacing;

    // Left Side Pins (+X & -X)
    const pinLeft = new THREE.Mesh(pinGeoX, goldPinMaterial);
    pinLeft.position.set(-(chipWidth / 2 + pinLength / 2 - 0.05), -0.04, offset);
    icGroup.add(pinLeft);

    const pinRight = new THREE.Mesh(pinGeoX, goldPinMaterial);
    pinRight.position.set((chipWidth / 2 + pinLength / 2 - 0.05), -0.04, offset);
    icGroup.add(pinRight);

    // Top & Bottom Side Pins (+Z & -Z)
    const pinTop = new THREE.Mesh(pinGeoZ, goldPinMaterial);
    pinTop.position.set(offset, -0.04, -(chipDepth / 2 + pinLength / 2 - 0.05));
    icGroup.add(pinTop);

    const pinBottom = new THREE.Mesh(pinGeoZ, goldPinMaterial);
    pinBottom.position.set(offset, -0.04, (chipDepth / 2 + pinLength / 2 - 0.05));
    icGroup.add(pinBottom);
  }

  // Position & Tilt IC Package in Bottom-Right
  icGroup.position.set(6.8, -3.2, 1.8);
  icGroup.rotation.set(0.65, -0.55, 0.45);
  icGroup.scale.set(1.15, 1.15, 1.15);
  objectsGroup.add(icGroup);


  // =========================================================================
  // 2. TOP-LEFT: 3D DIGITAL CLOCK & LOGIC WAVEFORM BUS TRACES
  // =========================================================================
  const waveGroup = new THREE.Group();

  // Create a 3D Digital Square Clock Pulse Signal Path (_П_П_П_)
  const clockPoints = [
    new THREE.Vector3(-3.2, 0.0, 0.0),
    new THREE.Vector3(-2.2, 0.0, 0.1),
    new THREE.Vector3(-2.2, 1.2, 0.2),
    new THREE.Vector3(-1.4, 1.2, 0.1),
    new THREE.Vector3(-1.4, 0.0, 0.0),
    new THREE.Vector3(-0.5, 0.0, -0.1),
    new THREE.Vector3(-0.5, 1.2, 0.1),
    new THREE.Vector3( 0.4, 1.2, 0.2),
    new THREE.Vector3( 0.4, 0.0, 0.0),
    new THREE.Vector3( 1.3, 0.0, -0.1),
    new THREE.Vector3( 1.3, 1.2, 0.0),
    new THREE.Vector3( 2.2, 1.2, 0.1),
    new THREE.Vector3( 2.2, 0.0, 0.0),
    new THREE.Vector3( 3.2, 0.0, 0.0),
  ];

  const clockCurve = new THREE.CatmullRomCurve3(clockPoints, false, 'catmullrom', 0.05);
  const clockTubeGeo = new THREE.TubeGeometry(clockCurve, 120, 0.12, 16, false);
  const clockMesh = new THREE.Mesh(clockTubeGeo, glowingTraceMaterial);
  waveGroup.add(clockMesh);

  // Parallel Secondary Ground / Bus Trace
  const busPoints = [
    new THREE.Vector3(-3.4, -0.4, -0.2),
    new THREE.Vector3(-1.2, -0.4, -0.1),
    new THREE.Vector3( 0.0, -0.2, 0.0),
    new THREE.Vector3( 1.5, -0.5, -0.1),
    new THREE.Vector3( 3.4, -0.3, -0.2),
  ];
  const busCurve = new THREE.CatmullRomCurve3(busPoints);
  const busTubeGeo = new THREE.TubeGeometry(busCurve, 64, 0.07, 12, false);
  const busMesh = new THREE.Mesh(busTubeGeo, goldPinMaterial);
  waveGroup.add(busMesh);

  // Data Pulse Nodes on the wave
  const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const node1 = new THREE.Mesh(nodeGeo, goldPinMaterial);
  node1.position.set(-1.4, 1.2, 0.1);
  waveGroup.add(node1);

  const node2 = new THREE.Mesh(nodeGeo, goldPinMaterial);
  node2.position.set(0.4, 1.2, 0.2);
  waveGroup.add(node2);

  const node3 = new THREE.Mesh(nodeGeo, goldPinMaterial);
  node3.position.set(2.2, 1.2, 0.1);
  waveGroup.add(node3);

  // Position & Tilt Digital Wave in Top-Left
  waveGroup.position.set(-6.5, 4.4, 1.2);
  waveGroup.rotation.set(0.25, 0.35, -0.12);
  waveGroup.scale.set(1.05, 1.05, 1.05);
  objectsGroup.add(waveGroup);


  // =========================================================================
  // 3. TOP-RIGHT: 3D SILICON WAFER DISK / CRYSTAL OSCILLATOR
  // =========================================================================
  const waferGroup = new THREE.Group();

  // Wafer Disk (Metallic Silicon with Grid etchings)
  const waferGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 36);
  const waferMesh = new THREE.Mesh(waferGeo, silverMaterial);
  waferGroup.add(waferMesh);

  // Wafer Outer Gold Ring
  const ringGeo = new THREE.TorusGeometry(1.22, 0.05, 16, 36);
  const ringMesh = new THREE.Mesh(ringGeo, goldPinMaterial);
  ringMesh.rotation.x = Math.PI / 2;
  waferGroup.add(ringMesh);

  // Die Grid Pattern on Wafer
  const gridLineGeoX = new THREE.BoxGeometry(2.1, 0.02, 0.02);
  const gridLineGeoZ = new THREE.BoxGeometry(0.02, 0.02, 2.1);
  
  for (let g = -0.75; g <= 0.75; g += 0.35) {
    const glx = new THREE.Mesh(gridLineGeoX, glowingTraceMaterial);
    glx.position.set(0, 0.045, g);
    waferGroup.add(glx);

    const glz = new THREE.Mesh(gridLineGeoZ, glowingTraceMaterial);
    glz.position.set(g, 0.045, 0);
    waferGroup.add(glz);
  }

  waferGroup.position.set(6.2, 4.6, 0.5);
  waferGroup.rotation.set(0.7, 0.4, -0.3);
  waferGroup.scale.set(0.9, 0.9, 0.9);
  objectsGroup.add(waferGroup);


  // =========================================================================
  // 4. MID-LEFT: 3D CYLINDRICAL CAPACITOR & SMD RESISTOR
  // =========================================================================
  const capGroup = new THREE.Group();

  // Capacitor Can (Cylinder)
  const capCanGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.3, 24);
  const capCanMesh = new THREE.Mesh(capCanGeo, capBodyMaterial);
  capGroup.add(capCanMesh);

  // Top Metallic Vent
  const capTopGeo = new THREE.CylinderGeometry(0.53, 0.53, 0.04, 24);
  const capTopMesh = new THREE.Mesh(capTopGeo, silverMaterial);
  capTopMesh.position.y = 0.66;
  capGroup.add(capTopMesh);

  // Golden Negative Stripe Indicator
  const stripeGeo = new THREE.BoxGeometry(0.12, 1.25, 0.56);
  const stripeMesh = new THREE.Mesh(stripeGeo, goldPinMaterial);
  stripeMesh.position.set(0.28, 0, 0);
  capGroup.add(stripeMesh);

  // Metallic Lead Pins (Bottom)
  const leadGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.7, 12);
  const lead1 = new THREE.Mesh(leadGeo, silverMaterial);
  lead1.position.set(-0.2, -0.9, 0);
  capGroup.add(lead1);

  const lead2 = new THREE.Mesh(leadGeo, silverMaterial);
  lead2.position.set(0.2, -0.9, 0);
  capGroup.add(lead2);

  capGroup.position.set(-5.4, 0.3, 1.6);
  capGroup.rotation.set(0.5, 0.3, -0.4);
  capGroup.scale.set(0.85, 0.85, 0.85);
  objectsGroup.add(capGroup);


  // =========================================================================
  // 5. 3D GLOWING DATA PARTICLES / SILICON ATOMS
  // =========================================================================
  const particleCount = 28;
  const particleGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const particles = [];

  for (let p = 0; p < particleCount; p++) {
    const mat = (p % 2 === 0) ? goldPinMaterial : glowingTraceMaterial;
    const particle = new THREE.Mesh(particleGeo, mat);
    
    particle.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 6
    );

    particle.userData = {
      speedX: (Math.random() - 0.5) * 0.008,
      speedY: (Math.random() - 0.5) * 0.008,
      baseY: particle.position.y
    };

    objectsGroup.add(particle);
    particles.push(particle);
  }

  // =========================================================================
  // RESPONSIVE SCREEN RESIZING
  // =========================================================================
  function adjustPositionsForScreen() {
    const width = container.clientWidth;
    if (width < 768) {
      // Mobile positioning
      icGroup.position.set(2.8, -4.5, 0.0);
      icGroup.scale.set(0.75, 0.75, 0.75);

      waveGroup.position.set(-2.8, 4.8, -1.0);
      waveGroup.scale.set(0.65, 0.65, 0.65);

      waferGroup.position.set(2.6, 5.0, -1.0);
      waferGroup.scale.set(0.55, 0.55, 0.55);

      capGroup.position.set(-2.6, -1.0, 0.5);
      capGroup.scale.set(0.55, 0.55, 0.55);

      camera.position.z = 18;
    } else if (width < 1100) {
      icGroup.position.set(5.2, -3.2, 1.5);
      waveGroup.position.set(-5.0, 4.2, 1.0);
      waferGroup.position.set(4.8, 4.2, 0.5);
      capGroup.position.set(-4.2, 0.2, 1.4);
      camera.position.z = 16;
    } else {
      icGroup.position.set(6.8, -3.2, 1.8);
      icGroup.scale.set(1.15, 1.15, 1.15);
      waveGroup.position.set(-6.5, 4.4, 1.2);
      waveGroup.scale.set(1.05, 1.05, 1.05);
      waferGroup.position.set(6.2, 4.6, 0.5);
      waferGroup.scale.set(0.9, 0.9, 0.9);
      capGroup.position.set(-5.4, 0.3, 1.6);
      capGroup.scale.set(0.85, 0.85, 0.85);
      camera.position.z = 15;
    }
  }

  adjustPositionsForScreen();

  // =========================================================================
  // MOUSE & TOUCH INTERACTION (DRAG TO ROTATE & PARALLAX)
  // =========================================================================
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    mouseX = (e.clientX - windowHalfX) / windowHalfX;
    mouseY = (e.clientY - windowHalfY) / windowHalfY;

    // Shift point light with cursor
    mouseLight.position.x = mouseX * 9;
    mouseLight.position.y = -mouseY * 9;
  });

  // Drag interaction
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    objectsGroup.rotation.y += deltaX * 0.005;
    objectsGroup.rotation.x += deltaY * 0.005;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch controls for mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    objectsGroup.rotation.y += deltaX * 0.005;
    objectsGroup.rotation.x += deltaY * 0.005;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // =========================================================================
  // ANIMATION LOOP
  // =========================================================================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // 1. VLSI Microchip Continuous Technical Float & Rotation
    icGroup.rotation.y += 0.007; // Smooth continuous chip spin
    icGroup.rotation.x = 0.65 + Math.sin(elapsedTime * 0.9) * 0.08;
    icGroup.position.y = (-3.2) + Math.cos(elapsedTime * 1.2) * 0.15;

    // Pulsing Silicon Core Die Emission
    glowingTraceMaterial.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 3.5) * 0.35;

    // 2. Digital Clock Wave Oscillation
    waveGroup.position.y = (4.4) + Math.sin(elapsedTime * 1.1) * 0.12;
    waveGroup.rotation.z = -0.12 + Math.sin(elapsedTime * 0.7) * 0.06;

    // 3. Silicon Wafer Rotation
    waferGroup.rotation.y += 0.009;
    waferGroup.rotation.z += 0.004;
    waferGroup.position.y = (4.6) + Math.cos(elapsedTime * 1.4) * 0.12;

    // 4. Capacitor Float & Wobble
    capGroup.rotation.y += 0.006;
    capGroup.position.y = (0.3) + Math.sin(elapsedTime * 1.3) * 0.15;

    // 5. Data Particles Drift
    particles.forEach((p, idx) => {
      p.position.y = p.userData.baseY + Math.sin(elapsedTime * 1.5 + idx) * 0.3;
      p.position.x += p.userData.speedX;
      p.position.z += p.userData.speedY;
    });

    // Smooth Parallax Lerp
    targetX = mouseX * 0.35;
    targetY = mouseY * 0.35;
    
    if (!isDragging) {
      objectsGroup.rotation.y += (targetX - objectsGroup.rotation.y) * 0.05;
      objectsGroup.rotation.x += (targetY - objectsGroup.rotation.x) * 0.05;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Window Resize Listener
  window.addEventListener('resize', () => {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    adjustPositionsForScreen();
  });
})();
