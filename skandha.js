// Horizon of the Captivating Skandha - Dagon
// Ocean wave particles, blue water distortion, floating fish silhouettes.

window.initSkandha = function (scene) {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);

    // Target: Wave-like structure
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        const y = Math.sin(x * 0.5) + Math.cos(z * 0.5);

        targetPositions[i3] = x;
        targetPositions[i3 + 1] = y - 2;
        targetPositions[i3 + 2] = z;

        initialPositions[i3] = (Math.random() - 0.5) * 0.2;
        initialPositions[i3 + 1] = (Math.random() - 0.5) * 0.2;
        initialPositions[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));

    const material = new THREE.PointsMaterial({
        color: 0x06b6d4,
        size: 0.15,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });

    const water = new THREE.Points(geometry, material);
    water.userData.isEffect = true;
    scene.add(water);

    // Fish
    const fishGeo = new THREE.ConeGeometry(0.1, 0.4, 4);
    const fishMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const fish = [];

    for (let i = 0; i < 20; i++) {
        const f = new THREE.Mesh(fishGeo, fishMat);
        f.userData.targetPos = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 10
        );
        f.position.set(0, 0, 0);
        f.rotation.z = Math.PI / 2;
        f.userData.speed = 0.05 + Math.random() * 0.05;
        f.userData.isEffect = true;
        scene.add(f);
        fish.push(f);
    }

    // Animation Data
    const animationData = { progress: 0 };

    gsap.to(animationData, {
        progress: 1,
        duration: 2.0,
        ease: "power2.out",
        onUpdate: () => {
            const positions = water.geometry.attributes.position.array;
            material.opacity = animationData.progress * 0.6;
            fishMat.opacity = animationData.progress;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], animationData.progress);
                positions[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], targetPositions[i3 + 1], animationData.progress);
                positions[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], targetPositions[i3 + 2], animationData.progress);
            }
            water.geometry.attributes.position.needsUpdate = true;

            fish.forEach(f => {
                f.position.lerpVectors(new THREE.Vector3(0, 0, 0), f.userData.targetPos, animationData.progress);
            });
        }
    });

    const animate = () => {
        if (!water.parent) return;

        if (animationData.progress > 0.8) {
            const positions = water.geometry.attributes.position.array;
            const time = Date.now() * 0.002;

            for (let i = 0; i < particleCount; i++) {
                const x = positions[i * 3];
                const z = positions[i * 3 + 2];
                // Try to preserve base position from lerp, just add sine wave
                // Simple approx: re-calc Y based on X/Z
                positions[i * 3 + 1] = (Math.sin(x * 0.5 + time) + Math.cos(z * 0.5 + time) - 2) * animationData.progress + (1 - animationData.progress) * initialPositions[i * 3 + 1];
            }
            water.geometry.attributes.position.needsUpdate = true;

            fish.forEach(f => {
                f.position.x += f.userData.speed;
                if (f.position.x > 10) f.position.x = -10;
            });
        }

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
