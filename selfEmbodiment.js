// Self-Embodiment of Perfection - Mahito
// Translucent soul-like particles, organic movement, hands.

window.initSelfEmbodiment = function (scene) {
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        targetPositions[i3] = (Math.random() - 0.5) * 12;
        targetPositions[i3 + 1] = (Math.random() - 0.5) * 12;
        targetPositions[i3 + 2] = (Math.random() - 0.5) * 12;

        initialPositions[i3] = (Math.random() - 0.5) * 0.1;
        initialPositions[i3 + 1] = (Math.random() - 0.5) * 0.1;
        initialPositions[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));

    const material = new THREE.PointsMaterial({
        color: 0x3b82f6, // Soul blue
        size: 0.1,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });

    const soulParticles = new THREE.Points(geometry, material);
    soulParticles.userData.isEffect = true;
    scene.add(soulParticles);

    // Hands
    const handsMeshes = [];
    const palmGeo = new THREE.BoxGeometry(0.5, 0.6, 0.1);
    const handMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0, wireframe: true });

    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(palmGeo, handMat);
        mesh.userData.targetPos = new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
        mesh.position.set(0, 0, 0); // Start center
        mesh.rotation.z = Math.random() * Math.PI;
        mesh.userData.isEffect = true;
        scene.add(mesh);
        handsMeshes.push(mesh);
    }

    // Animation Data
    const animationData = { progress: 0 };

    gsap.to(animationData, {
        progress: 1,
        duration: 1.8,
        ease: "back.out(1.2)",
        onUpdate: () => {
            const positions = soulParticles.geometry.attributes.position.array;
            material.opacity = animationData.progress * 0.5;
            handMat.opacity = animationData.progress * 0.4;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], animationData.progress);
                positions[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], targetPositions[i3 + 1], animationData.progress);
                positions[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], targetPositions[i3 + 2], animationData.progress);
            }
            soulParticles.geometry.attributes.position.needsUpdate = true;

            handsMeshes.forEach(h => {
                h.position.lerpVectors(new THREE.Vector3(0, 0, 0), h.userData.targetPos, animationData.progress);
            });
        }
    });

    const animate = () => {
        if (!soulParticles.parent) return;

        soulParticles.rotation.y += 0.002;
        handsMeshes.forEach(h => {
            h.rotation.x += 0.01;
            h.rotation.y += 0.01;
        });

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        scene.remove(soulParticles);
        handsMeshes.forEach(h => scene.remove(h));
        geometry.dispose();
        material.dispose();
        palmGeo.dispose();
        handMat.dispose();
    };
};
