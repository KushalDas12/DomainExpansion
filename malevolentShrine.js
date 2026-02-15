// Malevolent Shrine - Ryomen Sukuna
// Dark red and black particles, blood-like splashes, aggressive movement.

window.initMalevolentShrine = function (scene) {
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const velocities = [];

    // Create particles in a box shape (shrine-ish area)
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Target: Box
        targetPositions[i3] = (Math.random() - 0.5) * 10;
        targetPositions[i3 + 1] = (Math.random() - 0.5) * 10;
        targetPositions[i3 + 2] = (Math.random() - 0.5) * 10;

        // Initial: Center
        initialPositions[i3] = (Math.random() - 0.5) * 0.2;
        initialPositions[i3 + 1] = (Math.random() - 0.5) * 0.2;
        initialPositions[i3 + 2] = (Math.random() - 0.5) * 0.2;

        velocities.push({
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1,
            z: (Math.random() - 0.5) * 0.1
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));

    const material = new THREE.PointsMaterial({
        size: 0.2, // Larger
        color: 0xff0000,
        transparent: true,
        opacity: 0, // Start invisible
        blending: THREE.NormalBlending // Visible on dark background
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData.isEffect = true;
    scene.add(particles);

    // Second layer: Black slashes (LINES)
    const slashGeometry = new THREE.BufferGeometry();
    const slashCount = 100;
    const slashPositions = new Float32Array(slashCount * 6);

    // Initialize slashes (static for now, just opacity fade in)
    for (let i = 0; i < slashCount; i++) {
        const x = (Math.random() - 0.5) * 8;
        const y = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;

        slashPositions[i * 6] = x;
        slashPositions[i * 6 + 1] = y;
        slashPositions[i * 6 + 2] = z;

        slashPositions[i * 6 + 3] = x + (Math.random() - 0.5) * 2;
        slashPositions[i * 6 + 4] = y + (Math.random() - 0.5) * 2;
        slashPositions[i * 6 + 5] = z + (Math.random() - 0.5) * 2;
    }
    slashGeometry.setAttribute('position', new THREE.BufferAttribute(slashPositions, 3));
    const slashMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2, transparent: true, opacity: 0 });
    const slashes = new THREE.LineSegments(slashGeometry, slashMaterial);
    slashes.userData.isEffect = true;
    scene.add(slashes);

    // Animation Data
    const animationData = { progress: 0 };

    gsap.to(animationData, {
        progress: 1,
        duration: 1.5,
        ease: "power3.out",
        onUpdate: () => {
            const positions = particles.geometry.attributes.position.array;

            // Fade in
            material.opacity = animationData.progress * 0.7;
            slashMaterial.opacity = animationData.progress;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], animationData.progress);
                positions[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], targetPositions[i3 + 1], animationData.progress);
                positions[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], targetPositions[i3 + 2], animationData.progress);
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }
    });

    const animate = () => {
        if (!particles.parent) return;

        // Transition from GSAP controlled position to physics controlled? 
        // For simplicity, just add some noise AFTER transition, or overlay noise.
        // Let's just rotate slashes and maybe stir particles slightly if expansion is done

        if (animationData.progress > 0.9) {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] += velocities[i].x;
                positions[i3 + 1] += velocities[i].y;
                positions[i3 + 2] += velocities[i].z;

                // Bounds wrap
                if (Math.abs(positions[i3]) > 5) positions[i3] *= -0.9;
                if (Math.abs(positions[i3 + 1]) > 5) positions[i3 + 1] *= -0.9;
                if (Math.abs(positions[i3 + 2]) > 5) positions[i3 + 2] *= -0.9;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        slashes.rotation.z += 0.02;
        slashes.rotation.y -= 0.01;

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        scene.remove(particles);
        scene.remove(slashes);
        geometry.dispose();
        material.dispose();
        slashGeometry.dispose();
        slashMaterial.dispose();
    };
};
