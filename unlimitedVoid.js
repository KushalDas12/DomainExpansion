// Unlimited Void - Gojo Satoru
// Deep cosmic purple/blue space effect, infinite floating particles, starfield background.

window.initUnlimitedVoid = function (scene) {
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;

    // We store final positions to animate towards
    const targetPositions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const blue = new THREE.Color(0x00ffff);
    const purple = new THREE.Color(0xbf00ff);
    const white = new THREE.Color(0xffffff);
    const startColor = new THREE.Color(0xffffff); // Start white/bright

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Target: Sphere distribution
        const r = 15 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        targetPositions[i] = r * Math.sin(phi) * Math.cos(theta);
        targetPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        targetPositions[i + 2] = r * Math.cos(phi);

        // Initial: Center with slight randomness
        initialPositions[i] = (Math.random() - 0.5) * 0.5;
        initialPositions[i + 1] = (Math.random() - 0.5) * 0.5;
        initialPositions[i + 2] = (Math.random() - 0.5) * 0.5;

        // Start with startColor
        colors[i] = startColor.r;
        colors[i + 1] = startColor.g;
        colors[i + 2] = startColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1, // Slightly larger for visibility
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(particlesGeometry, particlesMaterial);
    starField.userData.isEffect = true;
    scene.add(starField);

    // Animation Variables
    const animationData = { progress: 0 };

    // GSAP Tween for Expansion
    gsap.to(animationData, {
        progress: 1,
        duration: 2.0, // 2 seconds expansion
        ease: "power2.out",
        onUpdate: () => {
            const positions = starField.geometry.attributes.position.array;
            const colorAttr = starField.geometry.attributes.color.array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;

                // Position Interpolation
                positions[i3] = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], animationData.progress);
                positions[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], targetPositions[i3 + 1], animationData.progress);
                positions[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], targetPositions[i3 + 2], animationData.progress);

                // Color Interpolation (White -> Purple/Blue)
                // Determine target color for this particle
                // Re-calculating random choice deterministicly or storing it would be better, 
                // but for now let's just lerp to a mix based on index

                let targetC = (i % 3 === 0) ? blue : ((i % 2 === 0) ? purple : white);

                colorAttr[i3] = THREE.MathUtils.lerp(startColor.r, targetC.r, animationData.progress);
                colorAttr[i3 + 1] = THREE.MathUtils.lerp(startColor.g, targetC.g, animationData.progress);
                colorAttr[i3 + 2] = THREE.MathUtils.lerp(startColor.b, targetC.b, animationData.progress);
            }
            starField.geometry.attributes.position.needsUpdate = true;
            starField.geometry.attributes.color.needsUpdate = true;
        }
    });

    // Animation Loop for this specific effect (Idle animation)
    const animate = () => {
        if (!starField.parent) return; // Stop if removed

        // Rotate entire field slowly
        starField.rotation.y += 0.0005;
        starField.rotation.x += 0.0002;

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
