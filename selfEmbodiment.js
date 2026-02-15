// Self-Embodiment of Perfection - Mahito
// Translucent soul-like particles, organic movement, hands.

window.initSelfEmbodiment = function (scene) {
    const handCount = 50;
    const handsMeshes = [];

    // We don't have a hand model, so we simulate "hands" with stretched spheres or simple geometry groups
    // A group of 5 cylinders might look like a hand abstractly

    // For particles, we use soul flames (cyan/grey)
    const particleCount = 800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
        color: 0x3b82f6, // Soul blue
        size: 0.1,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const soulParticles = new THREE.Points(geo, mat);
    soulParticles.userData.isEffect = true;
    scene.add(soulParticles);

    // Add some "Hands" (Simple meshes)
    const palmGeo = new THREE.BoxGeometry(0.5, 0.6, 0.1);
    const handMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.4, wireframe: true });

    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(palmGeo, handMat);
        mesh.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
        mesh.rotation.z = Math.random() * Math.PI;
        mesh.userData.isEffect = true;
        scene.add(mesh);
        handsMeshes.push(mesh);
    }

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
        geo.dispose();
        mat.dispose();
        palmGeo.dispose();
        handMat.dispose();
    };
};
