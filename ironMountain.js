// Coffin of the Iron Mountain - Jogo
// Lava particles, smoke, ember effects, rising heat.

window.initIronMountain = function (scene) {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorHot = new THREE.Color(0xffff00); // Yellow
    const colorMed = new THREE.Color(0xff8800); // Orange
    const colorCool = new THREE.Color(0xff0000); // Red

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Target: Box
        targetPositions[i3] = (Math.random() - 0.5) * 10;
        targetPositions[i3 + 1] = (Math.random() - 0.5) * 10;
        targetPositions[i3 + 2] = (Math.random() - 0.5) * 10;

        // Initial: Center
        initialPositions[i3] = (Math.random() - 0.5) * 0.4;
        initialPositions[i3 + 1] = (Math.random() - 0.5) * 0.4;
        initialPositions[i3 + 2] = (Math.random() - 0.5) * 0.4;

        const rand = Math.random();
        const c = rand > 0.6 ? colorHot : (rand > 0.3 ? colorMed : colorCool);

        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });

    const embers = new THREE.Points(geometry, material);
    embers.userData.isEffect = true;
    scene.add(embers);

    // Animation Data
    const animationData = { progress: 0 };

    gsap.to(animationData, {
        progress: 1,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
            const positions = embers.geometry.attributes.position.array;
            material.opacity = animationData.progress * 0.8;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], animationData.progress);
                positions[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], targetPositions[i3 + 1], animationData.progress);
                positions[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], targetPositions[i3 + 2], animationData.progress);
            }
            embers.geometry.attributes.position.needsUpdate = true;
        }
    });

    const animate = () => {
        if (!embers.parent) return;

        if (animationData.progress > 0.9) {
            const positions = embers.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const yIdx = i * 3 + 1;
                positions[yIdx] += 0.05;
                positions[i * 3] += (Math.random() - 0.5) * 0.02; // Jitter

                if (positions[yIdx] > 5) positions[yIdx] = -5;
            }
            embers.geometry.attributes.position.needsUpdate = true;
        }

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        scene.remove(embers);
        geometry.dispose();
        material.dispose();
    };
};
