// Malevolent Shrine - Ryomen Sukuna
// Dark red and black particles, blood-like splashes, aggressive movement.

window.initMalevolentShrine = function (scene) {
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = []; // Store velocities for custom movement

    // Create particles in a box shape (shrine-ish area)
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        velocities.push({
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1,
            z: (Math.random() - 0.5) * 0.1
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xff0000,
        transparent: true,
        opacity: 0.7,
        blending: THREE.MultiplyBlending // Darker look
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData.isEffect = true;
    scene.add(particles);

    // Second layer: Black slashes (LINES)
    const slashGeometry = new THREE.BufferGeometry();
    const slashCount = 100;
    const slashPositions = new Float32Array(slashCount * 6); // 2 points per line

    for (let i = 0; i < slashCount; i++) {
        const x = (Math.random() - 0.5) * 8;
        const y = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;

        // Start point
        slashPositions[i * 6] = x;
        slashPositions[i * 6 + 1] = y;
        slashPositions[i * 6 + 2] = z;

        // End point (slash direction)
        slashPositions[i * 6 + 3] = x + (Math.random() - 0.5) * 2;
        slashPositions[i * 6 + 4] = y + (Math.random() - 0.5) * 2;
        slashPositions[i * 6 + 5] = z + (Math.random() - 0.5) * 2;
    }
    slashGeometry.setAttribute('position', new THREE.BufferAttribute(slashPositions, 3));
    const slashMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const slashes = new THREE.LineSegments(slashGeometry, slashMaterial);
    slashes.userData.isEffect = true;
    scene.add(slashes);


    const animate = () => {
        if (!particles.parent) return;

        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;

            // Reset if out of bounds to create continuous flow
            if (Math.abs(positions[i3]) > 5) positions[i3] *= -0.9;
            if (Math.abs(positions[i3 + 1]) > 5) positions[i3 + 1] *= -0.9;
            if (Math.abs(positions[i3 + 2]) > 5) positions[i3 + 2] *= -0.9;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Randomly rotate slashes
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
