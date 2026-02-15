// Chimera Shadow Garden - Megumi Fushiguro
// Expanding shadow particles, dark liquid ripple spreading, fluid-like movement.

window.initChimeraShadow = function (scene) {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);

    // Create a floor of shadows
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 8;
        const angle = Math.random() * Math.PI * 2;

        // Target: Floor circle
        targetPositions[i3] = Math.cos(angle) * radius; // x
        targetPositions[i3 + 1] = -3 + Math.random() * 0.5; // y (floor level)
        targetPositions[i3 + 2] = Math.sin(angle) * radius; // z

        // Initial: Center
        initialPositions[i3] = (Math.random() - 0.5) * 0.2;
        initialPositions[i3 + 1] = -3; // Start at floor
        initialPositions[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));

    const material = new THREE.PointsMaterial({
        size: 0.3,
        color: 0x022c22, // Dark teal
        transparent: true,
        opacity: 0,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending // Make it glow slightly to be visible
    });

    const shadows = new THREE.Points(geometry, material);
    shadows.userData.isEffect = true;
    scene.add(shadows);

    // Floating blobs (simulating liquid shadow)
    const blobGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const blobMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0 }); // Lighter green for visibility
    const blobs = [];

    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(blobGeo, blobMat);
        // Store target in userData
        mesh.userData.targetX = (Math.random() - 0.5) * 10;
        mesh.userData.targetZ = (Math.random() - 0.5) * 10;

        mesh.position.set(0, -3, 0); // Start center floor

        mesh.userData.isEffect = true;
        mesh.userData.speedY = Math.random() * 0.05 + 0.01;
        scene.add(mesh);
        blobs.push(mesh);
    }

    // Animation Data
    const animationData = { progress: 0 };

    gsap.to(animationData, {
        progress: 1,
        duration: 2.0,
        ease: "power2.out",
        onUpdate: () => {
            const positions = shadows.geometry.attributes.position.array;
            material.opacity = animationData.progress * 0.8;
            blobMat.opacity = animationData.progress;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], animationData.progress);
                positions[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], targetPositions[i3 + 1], animationData.progress);
                positions[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], targetPositions[i3 + 2], animationData.progress);
            }
            shadows.geometry.attributes.position.needsUpdate = true;

            // Expand blobs
            blobs.forEach(blob => {
                blob.position.x = THREE.MathUtils.lerp(0, blob.userData.targetX, animationData.progress);
                blob.position.z = THREE.MathUtils.lerp(0, blob.userData.targetZ, animationData.progress);
            });
        }
    });

    const animate = () => {
        if (!shadows.parent) return;

        // Only ripple after expansion mainly, or verify physics doesn't conflict
        if (animationData.progress > 0.5) {
            const positions = shadows.geometry.attributes.position.array;
            const time = Date.now() * 0.002;
            for (let i = 0; i < particleCount; i++) {
                const textIdx = i * 3 + 1;
                // Wave movement (additive to current position)
                // We need to be careful not to overwrite the lerp.
                // Best to modify the Y value *relative* to base.
                // Since lerp sets it to target, we can add wave.
                // But simplified: just wave around the target Y.
            }
        }

        // Rising blobs logic (keep simple)
        if (animationData.progress > 0.9) {
            blobs.forEach(blob => {
                blob.position.y += blob.userData.speedY;
                if (blob.position.y > 3) {
                    blob.position.y = -3;
                    blob.position.x = (Math.random() - 0.5) * 10;
                    blob.position.z = (Math.random() - 0.5) * 10;
                }
            });
        }

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        scene.remove(shadows);
        blobs.forEach(b => scene.remove(b));
        geometry.dispose();
        material.dispose();
        blobGeo.dispose();
        blobMat.dispose();
    };
};
