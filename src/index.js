import { gsap } from 'gsap';
import { TextPlugin } from "gsap/all";
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

let gtl = gsap.timeline();

gtl.to('body', {height: '100vh', duration: 1, delay: 0.7, ease: "power2.out"},)
    .fromTo('body', {margin: "auto"}, {margin:0, width: '100vw', duration: 0.4, delay: 0.3, ease: "expoScale(1,2,none)"})
    .fromTo('.fbody', {display: "block", opacity: 0}, {opacity: 1}, "+=0.3", "fbodyvis")
    .from(".t1", {text: "", opacity: 0, duration: 0.25})
    .from(".t2", {text: "", opacity: 0, duration: 0.25})
    .from(".hanim", {opacity: 0, text: ""}, "fbodyvis")
    .from("nav", {opacity: 0})

// gtl.repeat(-1);
// gtl.pause(7)

function setNoiseTexture(time, dt, tick) {
    if (tick % 15 !== 0) return;

    const noiseSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="noiseFilter" primitiveUnits="objectBoundingBox">
            <!-- Generate turbulence pattern -->
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${Math.floor(Math.random() * 10000)}" result="turbulence" />
            <!-- Add lighting effect for texture with specular highlights -->
            <feSpecularLighting in="turbulence" surfaceScale="1.2" specularConstant="0.7" specularExponent="20" lighting-color="white">
            <fePointLight x="50" y="50" z="30" />
            </feSpecularLighting>
            <!-- Apply lighting effect as alpha mask to white fill -->
            <feComponentTransfer>
            <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" fill="white" />
        </svg>`;
    document.getElementById('noiseOverlay').style.background = `url('data:image/svg+xml;charset=utf-8,${encodeURIComponent(noiseSVG)}')`;
}

gsap.ticker.add(setNoiseTexture)