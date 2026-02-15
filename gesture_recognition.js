class GestureRecognizer {
    constructor() {
        this.fingerState = {
            thumb: false,
            index: false,
            middle: false,
            ring: false,
            pinky: false
        };
    }

    predict(landmarksList) {
        // Simplified Logic: We look at the first hand detected mostly, or combination if needed.
        // For accurate Domain Expansions, we need specific two-hand combos usually,
        // but single-hand approximations make it usable for webcams without complex training.

        // If we have two hands, we can do more complex checks.
        // For now, let's map complex domains to simple distinct hand states.

        if (landmarksList.length === 0) return null;

        // Check first hand
        const hand = landmarksList[0];
        const state = this.getFingerState(hand);

        // 1. Unlimited Void: Crossed Fingers (Index + Middle)
        if (this.isCrossed(hand)) {
            return 'unlimited_void';
        }

        // 2. Malevolent Shrine: Prayer/Clap (Requires 2 hands usually, but let's emulate with open palm fingers together)
        // OR: If 2 hands are detected and close.
        if (landmarksList.length === 2) {
            if (this.areHandsPraying(landmarksList[0], landmarksList[1])) {
                return 'malevolent_shrine';
            }
        }

        // 3. Chimera Shadow Garden: Interlocked fingers approx -> "Devil Horns" or "Fist"
        // Let's use "Devil Horns" (Index + Pinky up, others down)
        if (state.index && state.pinky && !state.middle && !state.ring) {
            return 'chimera_shadow_garden';
        }

        // 4. Coffin of the Iron Mountain: Hand Clasped -> Fist
        if (!state.index && !state.middle && !state.ring && !state.pinky && !state.thumb) {
            return 'iron_mountain';
        }

        // 5. Self-Embodiment of Perfection: Hands in mouth (Too hard) -> Open Palm (High 5)
        if (state.thumb && state.index && state.middle && state.ring && state.pinky) {
            // Need to distinguish from Malevolent Shrine prayer which might arguably look like this for 1 hand
            // Let's check spread.
            return 'self_embodiment';
        }

        // 6. Horizon of the Captivating Skandha: Dagon makes a box -> "L" Shape (Thumb + Index)
        if (state.thumb && state.index && !state.middle && !state.ring && !state.pinky) {
            return 'skandha';
        }

        return null;
    }

    getFingerState(landmarks) {
        // Tips: 4, 8, 12, 16, 20
        // PIPs: 2, 6, 10, 14, 18 (Knuckles/Lower joints)

        // Simple "Is Extended" check: Tip y < PIP y (assuming hand is upright)
        // For thumb, we check x distance relative to wrist/MCP

        const wrist = landmarks[0];

        return {
            thumb: this.isThumbExtended(landmarks),
            index: landmarks[8].y < landmarks[6].y,
            middle: landmarks[12].y < landmarks[10].y,
            ring: landmarks[16].y < landmarks[14].y,
            pinky: landmarks[20].y < landmarks[18].y
        };
    }

    isThumbExtended(landmarks) {
        // Simple logic: extended if tip is far from index base
        const dx = landmarks[4].x - landmarks[2].x;
        // Direction depends on hand (left/right), checking absolute distance is safer for simple open/close
        return Math.abs(dx) > 0.05;
    }

    isCrossed(landmarks) {
        // Index (8) and Middle (12)
        // Check if x-coordinates swap relative to their base
        // or just if distance between tips is very small while extended

        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const distance = Math.hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y);

        const areExtended = (indexTip.y < landmarks[6].y) && (middleTip.y < landmarks[10].y);

        return areExtended && distance < 0.04; // Detected as "close/crossed"
    }

    areHandsPraying(hand1, hand2) {
        // Check distance between wrists
        const dist = Math.hypot(hand1[0].x - hand2[0].x, hand1[0].y - hand2[0].y);
        return dist < 0.2; // Arbitrary close threshold
    }
}
