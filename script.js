const VIDEO_element = document.getElementById('input_video');
const CANVAS_element = document.getElementById('output_canvas');
const CANVAS_CTX = CANVAS_element.getContext('2d');

// --- Three.js Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

camera.position.z = 5;

// Global State
let currentDomain = null;
let lastGesture = null;
let gestureHoldStart = 0;
const ACTIVATION_THRESHOLD = 1500; // 1.5 seconds

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- MediaPipe Hands Setup ---
const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

// --- Camera Setup ---
const cameraUtils = new Camera(VIDEO_element, {
    onFrame: async () => {
        await hands.send({image: VIDEO_element});
    },
    width: 1280,
    height: 720
});
cameraUtils.start();

// --- Gesture Recognition Integration ---
// dependent on gesture_recognition.js loading first
const gestureRecognizer = new GestureRecognizer();

function onResults(results) {
    // Draw landmarks on the preview canvas
    CANVAS_CTX.save();
    CANVAS_CTX.clearRect(0, 0, CANVAS_element.width, CANVAS_element.height);
    CANVAS_CTX.drawImage(results.image, 0, 0, CANVAS_element.width, CANVAS_element.height);
    
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(CANVAS_CTX, landmarks, HAND_CONNECTIONS,
                           {color: '#00FF00', lineWidth: 2});
            drawLandmarks(CANVAS_CTX, landmarks, {color: '#FF0000', lineWidth: 1});
        }

        // Logic
        const detectedGesture = gestureRecognizer.predict(results.multiHandLandmarks);
        handleGesture(detectedGesture);
    }
    CANVAS_CTX.restore();
}

function handleGesture(gesture) {
    if (!gesture) {
        lastGesture = null;
        return;
    }

    if (gesture === lastGesture) {
        const holdDuration = Date.now() - gestureHoldStart;
        if (holdDuration > ACTIVATION_THRESHOLD && currentDomain !== gesture) {
            activateDomain(gesture);
        }
    } else {
        lastGesture = gesture;
        gestureHoldStart = Date.now();
    }
}

function activateDomain(domainKey) {
    console.log(`Activating Domain: ${domainKey}`);
    currentDomain = domainKey;
    
    // Update UI
    const domainData = getDomainData(domainKey);
    updateUI(domainData);

    // Trigger Particle Effect
    clearCurrentEffect();
    startParticleEffect(domainKey);
}

function getDomainData(key) {
    const data = {
        'unlimited_void': { 
            name: 'Unlimited Void', 
            desc: 'Infinite Information. Absolute Stasis.',
            color: '#a855f7'
        },
        'malevolent_shrine': { 
            name: 'Malevolent Shrine', 
            desc: 'Relentless Slashing. Divine Techinque.',
            color: '#ef4444' 
        },
        'chimera_shadow_garden': { 
            name: 'Chimera Shadow Garden', 
            desc: 'Shadows become fluid. Potential unleashed.',
            color: '#10b981' 
        },
        'iron_mountain': {
            name: 'Coffin of the Iron Mountain',
            desc: 'Magma and Heat. Inescapable burning.',
            color: '#f97316'
        },
        'self_embodiment': {
            name: 'Self-Embodiment of Perfection',
            desc: 'Soul manipulation. Touching the soul.',
            color: '#3b82f6'
        },
        'skandha': {
            name: 'Horizon of the Captivating Skandha',
            desc: 'Infinite ocean. Shikigami swarm.',
            color: '#06b6d4'
        }
    };
    return data[key] || { name: 'Unknown', desc: '', color: '#fff' };
}

function updateUI(data) {
    const title = document.getElementById('domain-name');
    const desc = document.getElementById('domain-description');
    const container = document.getElementById('domain-name-container');

    title.innerText = data.name;
    title.dataset.text = data.name; // For glitch effect
    title.style.color = data.color;
    title.style.textShadow = `0 0 30px ${data.color}`; // Glow
    desc.innerText = data.desc;

    container.classList.remove('active');
    void container.offsetWidth; // Trigger reflow
    container.classList.add('active');

    // Add screen shake or other simple DOM manipulations here
    gsap.fromTo("body", {x: -10}, {x: 10, duration: 0.1, yoyo: true, repeat: 5});
}

// --- Particle System Management ---
// We will define these functions in the specific particle files and attach them to window or a global object
// For now, simple routing

let currentEffectCleanup = null;

function clearCurrentEffect() {
    if (currentEffectCleanup) {
        currentEffectCleanup();
        currentEffectCleanup = null;
    }
    // Clear specifically added objects from scene (excluding camera/lights)
    // A robust system would use a specific group for effects.
    // For this prototype, we'll iterate and remove "EffectObject" tagged items.
    for (let i = scene.children.length - 1; i >= 0; i--) {
        if (scene.children[i].userData.isEffect) {
            scene.remove(scene.children[i]);
        }
    }
}

function startParticleEffect(key) {
    switch(key) {
        case 'unlimited_void':
            if (window.initUnlimitedVoid) currentEffectCleanup = window.initUnlimitedVoid(scene);
            break;
        case 'malevolent_shrine':
            if (window.initMalevolentShrine) currentEffectCleanup = window.initMalevolentShrine(scene);
            break;
        case 'chimera_shadow_garden':
            if (window.initChimeraShadow) currentEffectCleanup = window.initChimeraShadow(scene);
            break;
        case 'iron_mountain':
            if (window.initIronMountain) currentEffectCleanup = window.initIronMountain(scene);
            break;
        case 'self_embodiment':
            if (window.initSelfEmbodiment) currentEffectCleanup = window.initSelfEmbodiment(scene);
            break;
        case 'skandha':
            if (window.initSkandha) currentEffectCleanup = window.initSkandha(scene);
            break;
    }
}

// Animation Loop for Three.js
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
