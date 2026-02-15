// Coffin of the Iron Mountain - Jogo
// Lava particles, smoke, ember effects, rising heat.

window.initIronMountain = function (scene) {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorHot = new THREE.Color(0xffff00); // Yellow
    const colorMed = new THREE.Color(0xff8800); // Orange
    const colorCool = new THREE.Color(0xff0000); // Red

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        // Gradient coloring based on height (hotter lower?)
        // Let's just mix random fire colors
        const rand = Math.random();
        const c = rand > 0.6 ? colorHot : (rand > 0.3 ? colorMed : colorCool);

        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const embers = new THREE.Points(geometry, material);
    embers.userData.isEffect = true;
    scene.add(embers);

    const animate = () => {
        if (!embers.parent) return;

        const positions = embers.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            const yIdx = i * 3 + 1;
            // Embers rise
            positions[yIdx] += 0.05;

            // Jitter x/z
            positions[i * 3] += (Math.random() - 0.5) * 0.02;
            positions[i * 3 + 2] += (Math.random() - 0.5) * 0.02;

            // Reset
            if (positions[yIdx] > 5) {
                positions[yIdx] = -5;
            }
        }
        embers.geometry.attributes.position.needsUpdate = true;

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        scene.remove(embers);
        geometry.dispose();
        material.dispose();
    };
};
