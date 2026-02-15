// Horizon of the Captivating Skandha - Dagon
// Ocean wave particles, blue water distortion, floating fish silhouettes.

window.initSkandha = function (scene) {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    // Wave-like structure
    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        // y is sine wave based
        const y = Math.sin(x * 0.5) + Math.cos(z * 0.5);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y - 2; // Move down
        positions[i * 3 + 2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x06b6d4,
        size: 0.15,
        transparent: true,
        opacity: 0.6
    });

    const water = new THREE.Points(geometry, material);
    water.userData.isEffect = true;
    scene.add(water);

    // Fish
    const fishGeo = new THREE.ConeGeometry(0.1, 0.4, 4);
    const fishMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const fish = [];

    for (let i = 0; i < 20; i++) {
        const f = new THREE.Mesh(fishGeo, fishMat);
        f.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 10
        );
        f.rotation.z = Math.PI / 2; // Horizontal
        f.userData.speed = 0.05 + Math.random() * 0.05;
        f.userData.isEffect = true;
        scene.add(f);
        fish.push(f);
    }

    const animate = () => {
        if (!water.parent) return;

        // Animate waves
        const positions = water.geometry.attributes.position.array;
        const time = Date.now() * 0.002;

        for (let i = 0; i < particleCount; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];
            positions[i * 3 + 1] = Math.sin(x * 0.5 + time) + Math.cos(z * 0.5 + time) - 2;
        }
        water.geometry.attributes.position.needsUpdate = true;

        // Fish swimming
        fish.forEach(f => {
            f.position.x += f.userData.speed;
            if (f.position.x > 10) f.position.x = -10;
        });

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        scene.remove(water);
        fish.forEach(f => scene.remove(f));
        geometry.dispose();
        material.dispose();
        fishGeo.dispose();
        fishMat.dispose();
    };
};
