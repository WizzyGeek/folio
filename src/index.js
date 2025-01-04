import { gsap } from 'gsap';
import { TextPlugin } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

let gtl = gsap.timeline();

gtl.set('body', {overflowY: "hidden"})
    .fromTo('body', {height: '0vh'}, {height: '100vh', duration: 2, delay: 0.7, ease: "bounce"},)
    .fromTo('body', {margin: "auto"}, {margin:0, width: '100vw', duration: 0.4, ease: "power2.in"})
    .fromTo('.fbody', {display: "none", opacity: 0}, {display: "block", opacity: 1}, "fbodyvis")
    .from(".t1", {text: "", opacity: 0, duration: 0.25})
    .from(".t2", {text: "", opacity: 0, duration: 0.25})
    .from(".hanim", {opacity: 0, text: ""}, "fbodyvis")
    .from("nav", {opacity: 0, duration: 1}).eventCallback("onComplete", () => {
    console.log("a")

    document.querySelectorAll("#about > div").forEach(div => {
        console.log(div)
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: div,
                toggleActions: "play reverse play reverse",
                start: "top center",
                end: "bottom center",
                pin: div,
                markers:true,
                pinSpacing: false,
                preventOverlaps: true,
            }
        })
        tl.from(div.getElementsByTagName("h1")[0], {opacity: 0, text: ""})
        .from(div.getElementsByTagName("p")[0], {opacity: 0, text: ""})
    })

    gsap.fromTo("#godown", {opacity: 1}, {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            // markers: true,
            scroller: "body",
            toggleActions: "play none none reset",
            scrub: 1,
        },
        opacity: 0
    })
    }).set('body', {height: "fit-content", overflowY: "scroll"})

// gtl.pause(1.3)
// let stl = gsap.timeline({
//     scrollTrigger: {
//         trigger: "h1, p"
//     },
// })

// stl.from("h1", {text: "", opacity: 0, y: -30}).from("p", {text: "", opacity: 0, y: -10})


// gtl.repeat(-1);
// gtl.pause(7)

function setNoiseTexture(time, dt, tick) {
    if (tick % 60 !== 0) return;

    const noiseSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="noiseFilter" primitiveUnits="objectBoundingBox">
            <!-- Generate turbulence pattern -->
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${Math.floor(Math.random() * 100)}" result="turbulence" />
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