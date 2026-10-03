/**
 * Three.js Interactive 3D Abstract Orange Element
 * Vicky — Portfolio Hero Visual
 */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // Verify THREE availability
  if (typeof THREE === 'undefined') {
    renderCanvasFallback(container);
    return;
  }

  try {
    initThreeScene(container);
  } catch (err) {
    console.warn('WebGL init warning, using dynamic canvas fallback:', err);
    renderCanvasFallback(container);
  }

  function initThreeScene(mountPoint) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      mountPoint.clientWidth / mountPoint.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(mountPoint.clientWidth, mountPoint.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountPoint.appendChild(renderer.domElement);

    // Group for mouse interaction
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Core Crystalline Icosahedron (Inner solid with orange shading)
    const coreGeo = new THREE.IcosahedronGeometry(1.65, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xFF5A1F,
      emissive: 0x8C2400,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Outer Wireframe Cage (Precision architectural lattice)
    const wireGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xFFA066,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // 3. Orbital Rings (Code / System planetary tracks)
    const ringGeo1 = new THREE.TorusGeometry(2.6, 0.018, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xFF5A1F,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.9, 0.014, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xFDBA74,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    mainGroup.add(ring2);

    // 4. Floating Particles Constellation (Emerging tech nodes)
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFF5A1F,
      size: 0.065,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const orangePointLight = new THREE.PointLight(0xFF5A1F, 2.5, 12);
    orangePointLight.position.set(-2, 2, 3);
    scene.add(orangePointLight);

    const backRimLight = new THREE.DirectionalLight(0xFF8A48, 1.5);
    backRimLight.position.set(-4, -4, -3);
    scene.add(backRimLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0006;
      mouseY = (e.clientY - windowHalfY) * 0.0006;
    });

    // Resize Handler
    function handleResize() {
      if (!mountPoint) return;
      const width = mountPoint.clientWidth;
      const height = mountPoint.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth damping interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Group rotation linked to mouse + idle spin
      mainGroup.rotation.y = elapsedTime * 0.22 + targetX * 1.5;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.18) * 0.15 + targetY * 1.5;

      // Secondary rotations
      coreMesh.rotation.y -= 0.006;
      coreMesh.rotation.z += 0.004;

      wireMesh.rotation.y += 0.004;
      wireMesh.rotation.x -= 0.005;

      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.28;

      particles.rotation.y = elapsedTime * 0.08;

      // Subtle breathing scale
      const breath = 1 + Math.sin(elapsedTime * 1.2) * 0.035;
      coreMesh.scale.set(breath, breath, breath);

      renderer.render(scene, camera);
    }

    animate();
  }

  // Graceful 2D Canvas Fallback
  function renderCanvasFallback(mountPoint) {
    const canvas = document.createElement('canvas');
    canvas.width = mountPoint.clientWidth || 500;
    canvas.height = mountPoint.clientHeight || 500;
    mountPoint.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let angle = 0;

    function drawFallback() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Glowing aura
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180);
      grad.addColorStop(0, 'rgba(255, 90, 31, 0.25)');
      grad.addColorStop(0.6, 'rgba(255, 90, 31, 0.05)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();

      // Rotating faceted wireframe
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = '#FF5A1F';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = Math.cos(a) * 90;
        const y = Math.sin(a) * 90;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner polygon
      ctx.rotate(-angle * 1.5);
      ctx.strokeStyle = '#FF9E2C';
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const x = Math.cos(a) * 60;
        const y = Math.sin(a) * 60;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      angle += 0.01;
      requestAnimationFrame(drawFallback);
    }
    drawFallback();
  }
})();
