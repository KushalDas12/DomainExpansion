// Chimera Shadow Garden - Megumi Fushiguro
// Expanding shadow particles, dark liquid ripple spreading, fluid-like movement.

window.initChimeraShadow = function (scene) {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    // Create a floor of shadows
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 8;
        const angle = Math.random() * Math.PI * 2;

        positions[i3] = Math.cos(angle) * radius; // x
        positions[i3 + 1] = -3 + Math.random() * 0.5; // y (floor level)
        positions[i3 + 2] = Math.sin(angle) * radius; // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.3,
        color: 0x10b981, // Greenish tint found in anime/manga art for shadows sometimes, or pure black
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    // Override color to dark teal/black
    material.color.setHex(0x022c22);

    const shadows = new THREE.Points(geometry, material);
    shadows.userData.isEffect = true;
    scene.add(shadows);

    // Floating blobs (simulating liquid shadow)
    const blobGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const blobMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blobs = [];

    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(blobGeo, blobMat);
        mesh.position.set(
            (Math.random() - 0.5) * 10,
            -3,
            (Math.random() - 0.5) * 10
        );
        mesh.userData.isEffect = true;
        mesh.userData.speedY = Math.random() * 0.05 + 0.01;
        scene.add(mesh);
        blobs.push(mesh);
    }

    const animate = () => {
        if (!shadows.parent) return;

        // Ripple effect on floor
        const positions = shadows.geometry.attributes.position.array;
        const time = Date.now() * 0.002;

        for (let i = 0; i < particleCount; i++) {
            const textIdx = i * 3 + 1;
            // Wave movement
            positions[textIdx] = -3 + Math.sin(time + positions[i * 3]) * 0.2;
        }
        shadows.geometry.attributes.position.needsUpdate = true;

        // Rising blobs
        blobs.forEach(blob => {
            blob.position.y += blob.userData.speedY;
            // Reset if too high
            if (blob.position.y > 3) {
                blob.position.y = -3;
                blob.position.x = (Math.random() - 0.5) * 10;
                blob.position.z = (Math.random() - 0.5) * 10;
            }
        });

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
