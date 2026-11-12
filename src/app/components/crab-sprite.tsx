"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * The footer's one gated easter egg: a simple pixel-art crab (Krebs = crab)
 * perched on the top hairline rule — a low, wide, symmetric 32x40 sprite with
 * a 1px black outline (black in both schemes), flat red shell and two open side
 * pincers, redrawn from Emil's 8-bit crab references. All eight poses live in
 * one 256x40 sprite sheet shared by both color schemes, so the whole egg costs
 * a single image request and the pose is a background-position offset, not a
 * URL swap. Inert on load; hovering blinks once, a click holds the whole
 * pincers up in a wave, then the arrow keys scuttle it sideways along the rule.
 * Escape or 20s of inactivity settles it back down. Decorative only
 * (aria-hidden, never focusable) and fully static under reduced motion.
 * See DESIGN.md > Motion.
 */

const ART = "/pictures/easter-egg";
const SPRITE = `${ART}/crab-sprite.png`;

// Frame indices in the horizontal sheet, left to right.
const FRAMES = {
    sit: 0,
    sitBlink: 1,
    stand: 2,
    standBlink: 3,
    wave1: 4,
    wave2: 5,
    walk1: 6,
    walk2: 7,
} as const;

// Closed-eye variants for the hover blink (idle poses only).
const BLINK: Partial<Record<number, number>> = {
    [FRAMES.sit]: FRAMES.sitBlink,
    [FRAMES.stand]: FRAMES.standBlink,
};
const BLINK_MS = 160;

const SCALE = 2; // integer 2x, same 64x80 footprint
const WIDTH = 32 * SCALE; // 64px
const HEIGHT = 40 * SCALE; // 80px
const SHEET_WIDTH = 256 * SCALE; // 8 frames of 32px, at 2x
const WAVE_FRAME_MS = 180;
// wave-2 (set on click) -> wave-1 -> wave-2 held an extra beat -> stand, one
// step per WAVE_FRAME_MS, so the stand lands at 720ms after two visible raises.
const WAVE_STEPS = [FRAMES.wave1, FRAMES.wave2, FRAMES.wave2, FRAMES.stand];
const REDUCED_WAVE_MS = 800; // one static raised-arm frame
const WALK_SPEED = 40; // px per second
const WALK_FRAME_MS = 125; // 8 fps
const IDLE_EXIT_MS = 20_000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type Phase = "seated" | "waving" | "walking";

/** Keys belong to the page while the visitor is typing somewhere. */
function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    if (target.closest("input, textarea, select")) return true;
    return target instanceof HTMLElement && target.isContentEditable;
}

export function CrabSprite() {
    const [phase, setPhase] = useState<Phase>("seated");
    const [frame, setFrame] = useState<number>(FRAMES.sit);
    const [blink, setBlink] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const xRef = useRef(0); // offset from the column's left content edge, kept across states
    const boundsRef = useRef({ padLeft: 0, maxX: 0 });
    const blinkTimer = useRef(0);
    useEffect(() => () => window.clearTimeout(blinkTimer.current), []);

    // Live prefers-reduced-motion, as an external store. Turning it on sits
    // the sprite down; the server snapshot is false (the sprite is inert anyway).
    const subscribeReducedMotion = useCallback((onChange: () => void) => {
        const query = window.matchMedia(REDUCED_MOTION_QUERY);
        const notify = () => {
            if (query.matches) setPhase("seated");
            onChange();
        };
        query.addEventListener("change", notify);
        return () => query.removeEventListener("change", notify);
    }, []);
    const readReducedMotion = useCallback(() => window.matchMedia(REDUCED_MOTION_QUERY).matches, []);
    const reducedMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);

    // Blink on hover
    const onHover = () => {
        if (reducedMotion) return;
        window.clearTimeout(blinkTimer.current);
        setBlink(true);
        blinkTimer.current = window.setTimeout(() => setBlink(false), BLINK_MS);
    };

    // Measure the column's content span (the rule's width), clamp x into it and
    // place the sprite. One implementation shared by the resize watcher and the
    // walk loop; bounds live in a ref so ticks read fresh values after a resize.
    const measure = useCallback(() => {
        const root = rootRef.current;
        const column = root?.parentElement;
        if (!root || !column) return;
        const styles = window.getComputedStyle(column);
        const padLeft = parseFloat(styles.paddingLeft);
        const contentWidth = column.clientWidth - padLeft - parseFloat(styles.paddingRight);
        boundsRef.current = { padLeft, maxX: Math.max(0, contentWidth - WIDTH) };
        xRef.current = Math.min(xRef.current, boundsRef.current.maxX);
        root.style.left = `${padLeft + xRef.current}px`;
    }, []);

    // Keep the figure inside the rule whenever the column changes width, in any phase.
    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure]);

    // Waving: step the raise sequence on a single interval, then stand and walk.
    // Reduced motion: hold the static wave-2, then sit.
    useEffect(() => {
        if (phase !== "waving") return;
        if (reducedMotion) {
            const timer = window.setTimeout(() => setPhase("seated"), REDUCED_WAVE_MS);
            return () => window.clearTimeout(timer);
        }
        let step = 0;
        const timer = window.setInterval(() => {
            const next = WAVE_STEPS[step++];
            setFrame(next);
            if (next === FRAMES.stand) {
                window.clearInterval(timer);
                setPhase("walking");
            }
        }, WAVE_FRAME_MS);
        return () => window.clearInterval(timer);
    }, [phase, reducedMotion]);

    // Walking: the key listeners, movement loop and idle exit exist only here.
    useEffect(() => {
        const root = rootRef.current;
        if (phase !== "walking" || reducedMotion || !root) return;
        measure();

        const pressed = new Set<string>();
        let raf = 0;
        let lastTime = 0;
        let walkClock = 0;
        let walkStep = 0;
        let idleTimer = 0;

        const stopLoop = () => {
            if (raf) window.cancelAnimationFrame(raf);
            raf = 0;
            lastTime = 0;
            walkClock = 0;
        };
        // Stop and stand. Cleanup uses stopLoop alone so a re-wave keeps its frame.
        const halt = () => {
            stopLoop();
            setFrame(FRAMES.stand);
        };

        const tick = (now: number) => {
            const dir = (pressed.has("ArrowRight") ? 1 : 0) - (pressed.has("ArrowLeft") ? 1 : 0);
            if (dir === 0) {
                halt();
                return;
            }
            const dt = lastTime ? Math.min(now - lastTime, 100) : 0;
            lastTime = now;
            const { padLeft, maxX } = boundsRef.current;
            xRef.current = Math.min(maxX, Math.max(0, xRef.current + (dir * WALK_SPEED * dt) / 1000));
            root.style.left = `${padLeft + xRef.current}px`;
            walkClock += dt;
            if (walkClock >= WALK_FRAME_MS) {
                walkClock %= WALK_FRAME_MS;
                walkStep = 1 - walkStep;
                setFrame(walkStep === 0 ? FRAMES.walk1 : FRAMES.walk2);
            }
            raf = window.requestAnimationFrame(tick);
        };

        const startLoop = () => {
            if (!raf) raf = window.requestAnimationFrame(tick);
        };

        const armIdle = () => {
            window.clearTimeout(idleTimer);
            idleTimer = window.setTimeout(() => setPhase("seated"), IDLE_EXIT_MS);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (isTypingTarget(event.target)) return;
            if (event.key === "Escape") {
                setPhase("seated"); // sits down at the current x
                return;
            }
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault(); // only these two keys, only while walking
            armIdle();
            pressed.add(event.key);
            startLoop();
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (!pressed.delete(event.key)) return;
            if (pressed.size === 0) halt();
            else startLoop(); // the other arrow is still held: keep walking
        };

        // A held key never sends keyup once the window loses focus.
        const onBlur = () => {
            pressed.clear();
            halt();
        };

        armIdle();
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", onBlur);
        return () => {
            window.clearTimeout(idleTimer);
            stopLoop();
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", onBlur);
        };
    }, [phase, reducedMotion, measure]);

    // Click from seated starts the wave; click while walking re-waves in place.
    const activate = () => {
        if (phase === "waving") return;
        setFrame(FRAMES.wave2);
        setPhase("waving");
    };

    // Seated is always sit; under reduced motion walking is disabled (sit) and
    // waving is the single static raised-arm frame.
    let src: number = FRAMES.sit;
    if (phase === "waving") src = reducedMotion ? FRAMES.wave2 : frame;
    else if (phase === "walking" && !reducedMotion) src = frame;
    const blinkFrame = BLINK[src];
    if (blink && blinkFrame !== undefined) src = blinkFrame;
    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            tabIndex={-1}
            onClick={activate}
            onMouseEnter={onHover}
            onMouseDown={(event) => event.preventDefault()}
            className="absolute -top-14.25 left-6 z-10 cursor-pointer select-none"
            style={{
                width: WIDTH,
                height: HEIGHT,
                outline: "none",
                backgroundImage: `url(${SPRITE})`,
                backgroundSize: `${SHEET_WIDTH}px ${HEIGHT}px`,
                backgroundPosition: `-${src * WIDTH}px 0`,
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated",
            }}
        />
    );
}
