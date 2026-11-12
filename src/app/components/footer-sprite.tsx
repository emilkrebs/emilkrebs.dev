"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * The footer's one gated easter egg: a shaded pixel-art crab (Krebs = crab)
 * perched on the top hairline rule, in the outlined three-tone style of a
 * 32x32 game sprite. Inert on load; a click makes it raise its big fiddler
 * claw in a wave, then the arrow keys scuttle it sideways along the rule.
 * Escape or 20s of inactivity settles it back down. Decorative only
 * (aria-hidden, never focusable) and fully static under reduced motion.
 * See DESIGN.md > Motion for the scoped exception.
 */

const ART = "/pictures/easter-egg";
const FRAMES = {
    sit: `${ART}/crab-sit.png`,
    wave1: `${ART}/crab-wave-1.png`,
    wave2: `${ART}/crab-wave-2.png`,
    stand: `${ART}/crab-stand.png`,
    walk1: `${ART}/crab-walk-1.png`,
    walk2: `${ART}/crab-walk-2.png`,
};

const SCALE = 2; // integer 2x only: crisp on retina and non-retina
const WIDTH = 32 * SCALE; // 64px
const HEIGHT = 40 * SCALE; // 80px
const WAVE_FRAME_MS = 180;
const WAVE_TOTAL_MS = 720; // two visible raises, then stand
const REDUCED_WAVE_MS = 800; // one static raised-arm frame
const WALK_SPEED = 40; // px per second
const WALK_FRAME_MS = 125; // 8 fps
const IDLE_EXIT_MS = 20_000;

type Phase = "seated" | "waving" | "walking";

/** Keys belong to the page while the visitor is typing somewhere. */
function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    if (target.closest("input, textarea, select")) return true;
    return target instanceof HTMLElement && target.isContentEditable;
}

export function FooterSprite() {
    const [phase, setPhase] = useState<Phase>("seated");
    const [frame, setFrame] = useState(FRAMES.sit);
    const xRef = useRef(0); // offset from the column's left content edge, kept across states
    const maxXRef = useRef(0);
    const rootRef = useRef<HTMLDivElement>(null);

    // Live prefers-reduced-motion, as an external store. Turning it on sits
    // the sprite down; the server snapshot is false (the sprite is inert anyway).
    const subscribeReducedMotion = useCallback((onChange: () => void) => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const notify = () => {
            if (query.matches) setPhase("seated");
            onChange();
        };
        query.addEventListener("change", notify);
        return () => query.removeEventListener("change", notify);
    }, []);
    const readReducedMotion = useCallback(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
    const reducedMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);

    // Keep the figure inside the rule whenever the column changes width, in any
    // phase: a visitor can walk to the right edge, sit down, then rotate the
    // phone, and the sprite must not end up outside the footer's content edge.
    useEffect(() => {
        const root = rootRef.current;
        const column = root?.parentElement;
        if (!root || !column) return;
        const clamp = () => {
            const styles = window.getComputedStyle(column);
            const padLeft = parseFloat(styles.paddingLeft);
            const contentWidth = column.clientWidth - padLeft - parseFloat(styles.paddingRight);
            maxXRef.current = Math.max(0, contentWidth - WIDTH);
            xRef.current = Math.min(xRef.current, maxXRef.current);
            root.style.left = `${padLeft + xRef.current}px`;
        };
        clamp();
        window.addEventListener("resize", clamp);
        return () => window.removeEventListener("resize", clamp);
    }, []);

    // Waving: wave-2 (set on click), wave-1, wave-2 at 180ms per frame, then
    // stand and walk. Reduced motion: hold the static wave-2, then sit.
    useEffect(() => {
        if (phase !== "waving") return;
        if (reducedMotion) {
            const timer = window.setTimeout(() => setPhase("seated"), REDUCED_WAVE_MS);
            return () => window.clearTimeout(timer);
        }
        const timers = [
            window.setTimeout(() => setFrame(FRAMES.wave1), WAVE_FRAME_MS),
            window.setTimeout(() => setFrame(FRAMES.wave2), WAVE_FRAME_MS * 2),
            window.setTimeout(() => {
                setFrame(FRAMES.stand);
                setPhase("walking");
            }, WAVE_TOTAL_MS),
        ];
        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, [phase, reducedMotion]);

    // Walking: the key listeners, movement loop and idle exit exist only here.
    useEffect(() => {
        const root = rootRef.current;
        const column = root?.parentElement;
        if (phase !== "walking" || reducedMotion || !root || !column) return;

        const pressed = { left: false, right: false };
        let padLeft = 0;
        let raf = 0;
        let lastTime = 0;
        let walkClock = 0;
        let walkStep = 0;
        let idleTimer = 0;

        const applyPosition = () => {
            root.style.left = `${padLeft + xRef.current}px`;
        };

        // Clamp the 64px box to the column's content width (the rule's span).
        const measure = () => {
            const styles = window.getComputedStyle(column);
            padLeft = parseFloat(styles.paddingLeft);
            const contentWidth = column.clientWidth - padLeft - parseFloat(styles.paddingRight);
            maxXRef.current = Math.max(0, contentWidth - WIDTH);
            xRef.current = Math.min(xRef.current, maxXRef.current);
            applyPosition();
        };

        const stopLoop = () => {
            if (raf) window.cancelAnimationFrame(raf);
            raf = 0;
            lastTime = 0;
            walkClock = 0;
        };

        const tick = (now: number) => {
            const dir = (pressed.right ? 1 : 0) - (pressed.left ? 1 : 0);
            if (dir === 0) {
                stopLoop();
                setFrame(FRAMES.stand);
                return;
            }
            const dt = lastTime ? Math.min(now - lastTime, 100) : 0;
            lastTime = now;
            xRef.current = Math.min(maxXRef.current, Math.max(0, xRef.current + (dir * WALK_SPEED * dt) / 1000));
            applyPosition();
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
            if (event.key === "ArrowLeft") pressed.left = true;
            else pressed.right = true;
            startLoop();
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") pressed.left = false;
            else if (event.key === "ArrowRight") pressed.right = false;
            else return;
            if (pressed.left || pressed.right) {
                // The opposite key is still held: keep walking instead of stalling.
                startLoop();
                return;
            }
            stopLoop();
            setFrame(FRAMES.stand);
        };

        // A held key never sends keyup once the window loses focus.
        const onBlur = () => {
            pressed.left = false;
            pressed.right = false;
            stopLoop();
            setFrame(FRAMES.stand);
        };

        const onResize = () => measure();

        measure();
        armIdle();
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", onBlur);
        window.addEventListener("resize", onResize);
        return () => {
            window.clearTimeout(idleTimer);
            stopLoop();
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("resize", onResize);
        };
    }, [phase, reducedMotion]);

    // Click from seated starts the wave; click while walking re-waves in place.
    const activate = () => {
        if (phase === "waving") return;
        setFrame(FRAMES.wave2);
        setPhase("waving");
    };

    // Seated is always sit; under reduced motion walking is disabled (sit) and
    // waving is the single static raised-arm frame.
    let src = FRAMES.sit;
    if (phase === "waving") src = reducedMotion ? FRAMES.wave2 : frame;
    else if (phase === "walking" && !reducedMotion) src = frame;
    const darkSrc = src.replace(".png", "-dark.png");
    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            tabIndex={-1}
            onClick={activate}
            // Decorative: a click must not pull focus off the page, and the
            // global focus-visible ring (signal) never prints on the sprite.
            onMouseDown={(event) => event.preventDefault()}
            // -57px, not -56px: the absolutely positioned box starts inside the
            // column's 1px top border, so the extra pixel lands the art's row 28
            // (its seat / feet) exactly on the hairline.
            className="absolute -top-[57px] left-6 z-10 cursor-pointer select-none"
            style={{ width: WIDTH, height: HEIGHT, outline: "none" }}
        >
            {/* Day and night art are the same drawing; the night twin lifts the
                near-black outline so the silhouette still reads on ink. CSS picks
                one per scheme, so the swap needs no JS and survives pre-hydration. */}
            <Image
                src={src}
                alt=""
                width={WIDTH}
                height={HEIGHT}
                unoptimized
                priority={false}
                draggable={false}
                className="footer-sprite footer-sprite-light block"
                style={{ imageRendering: "pixelated" }}
            />
            <Image
                src={darkSrc}
                alt=""
                width={WIDTH}
                height={HEIGHT}
                unoptimized
                priority={false}
                draggable={false}
                aria-hidden="true"
                className="footer-sprite footer-sprite-dark absolute inset-0 block"
                style={{ imageRendering: "pixelated" }}
            />
        </div>
    );
}
