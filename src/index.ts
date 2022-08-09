import bezier from './bezier';

/**
 * Bonny is an animation engine for the browser.
 * It is a singleton and can be accessed via Bonny.
 */

interface Animation extends EventTarget {
    currentTime: CSSNumberish | null;
    effect: AnimationEffect | null;
    readonly finished: Promise<Animation>;
    id: string;
    oncancel: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null;
    onfinish: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null;
    onremove: ((this: Animation, ev: Event) => any) | null;
    readonly pending: boolean;
    readonly playState: AnimationPlayState;
    playbackRate: number;
    readonly ready: Promise<Animation>;
    readonly replaceState: AnimationReplaceState;
    startTime: CSSNumberish | null;
    timeline: AnimationTimeline | null;
    cancel(): void;
    commitStyles(): void;
    finish(): void;
    pause(): void;
    persist(): void;
    play(): void;
    reverse(): void;
    updatePlaybackRate(playbackRate: number): void;
    addEventListener<K extends keyof AnimationEventMap>(type: K, listener: (this: Animation, ev: AnimationEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AnimationEventMap>(type: K, listener: (this: Animation, ev: AnimationEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}


interface BonnyOptions {
    /**
     * The default duration of an animation in milliseconds.
     * @default 1000
     */
    duration?: number;

    /**
     * The default easing of an animation.
     * @default 'ease-in-out'
     * @see https://easings.net/
     *
     */
    easing?: keyof typeof easings;


    /**
     * The default delay of an animation in milliseconds.
     * @default 0
     */
    delay?: number;


    /**
     * The default fill mode of an animation.
     * @default 'both'
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode
     * 
     */
    fillMode?: 'both' | 'forwards' | 'backwards' | 'none';


    /**
     * The default direction of an animation.
     *
     * @default 'normal'
     */
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';


    /**
     * The default iteration count of an animation.
     *
     * @default 1
     */
    iteration?: number;


    /**
     * The Target element to animate.
     */
    target?: HTMLElement;

}


const easings = {
    'ease-in-out': [0.37, 0, 0.63, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'linear': [0, 0, 1, 1],
    'ease-in-quad': [0.55, 0.085, 0.68, 0.53],
    'ease-in-cubic': [0.55, 0.055, 0.675, 0.19],
    'ease-in-quart': [0.895, 0.03, 0.685, 0.22],
    'ease-in-quint': [0.755, 0.05, 0.855, 0.06],
    'ease-in-sine': [0.47, 0, 0.745, 0.715],
    'ease-in-expo': [0.95, 0.05, 0.795, 0.035],
    'ease-in-circ': [0.6, 0.04, 0.98, 0.335],
    'ease-in-back': [0.6, -0.28, 0.735, 0.045],
    'ease-out-quad': [0.25, 0.46, 0.45, 0.94],
    'ease-out-cubic': [0.215, 0.61, 0.355, 1],
    'ease-out-quart': [0.165, 0.84, 0.44, 1],
    'ease-out-quint': [0.23, 1, 0.32, 1],
    'ease-out-sine': [0.39, 0.575, 0.565, 1],
    'ease-out-expo': [0.19, 1, 0.22, 1],
    'ease-out-circ': [0.075, 0.82, 0.165, 1],
    'ease-out-back': [0.175, 0.885, 0.32, 1.275],
    'ease-in-out-quad': [0.455, 0.03, 0.515, 0.955],
    'ease-in-out-cubic': [0.645, 0.045, 0.355, 1],
    'ease-in-out-quart': [0.77, 0, 0.175, 1],
    'ease-in-out-quint': [0.86, 0, 0.07, 1],
    'ease-in-out-sine': [0.445, 0.05, 0.55, 0.95],
}

const ease = (easing: keyof typeof easings) => {
    if (easings[easing]) {
        return easings[easing];
    }
    return easings['ease-in-out'];
}

function animation(options: BonnyOptions) {

    const {
        duration = 1000,
        easing = 'ease-in-out',
        delay = 0,
        fillMode = 'both',
        direction = 'normal',
        iteration = 1,
        target = document.body,
        ...rest
    } = options;

    const start = Date.now();

    const loop = () => {
        const now = Date.now();
        const delta = now - start;
        const progress = delta / duration;

        if (progress < 1) {
            const value = bezier(...(ease(easing) as [0, 0, 0, 0]))(progress);

            Object
                .keys(rest)
                .forEach((key: any) => {
                    target.style[key] = `${value * rest[key as keyof typeof rest]}`;
                });


            requestAnimationFrame(loop);
        }
    }

    loop();

}


export default animation;