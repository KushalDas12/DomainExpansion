// Unlimited Void - Gojo Satoru
// Deep cosmic purple/blue space effect, infinite floating particles, starfield background.

window.initUnlimitedVoid = function (scene) {
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;

    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const blue = new THREE.Color(0x00ffff);
    const purple = new THREE.Color(0xbf00ff);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Sphere distribution
        const r = 15 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);

        // Mix colors
        const rand = Math.random();
        let color = white;
        if (rand < 0.33) color = blue;
        else if (rand < 0.66) color = purple;

        colorArray[i] = color.r;
        colorArray[i + 1] = color.g;
        colorArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(particlesGeometry, particlesMaterial);
    starField.userData.isEffect = true;
    scene.add(starField);

    // Animation Loop for this specific effect
    const animate = () => {
        if (!starField.parent) return; // Stop if removed

        starField.rotation.y += 0.0005;
        starField.rotation.x += 0.0002;

        // Pulse effect
        const time = Date.now() * 0.001;
        starField.scale.setScalar(1 + Math.sin(time) * 0.05);

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        // Cleanup function
        scene.remove(starField);
        particlesGeometry.dispose();
        particlesMaterial.dispose();
    };
};
