import { gsap } from 'gsap';
import { TextPlugin } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

const isTouchDevice = 'ontouchstart' in window;
function setNoiseTexture(time, dt, tick) {
    // if (tick % skip !== 0) return;
    // if (gsap.ticker.deltaRatio(60) > 3) {
    //     skip = Math.floor(skip * gsap.ticker.deltaRatio(60) / 3)
    //     console.log("Skip updated", skip)
    //     setTimeout(() => {
    //         console.log((gsap.ticker.frame - tick))
    //     }, 10000)
    // }

    const noiseSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<filter id="noiseFilter" primitiveUnits="objectBoundingBox">
<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${Math.floor(Math.random() * 100)}" result="turbulence" />
<feSpecularLighting in="turbulence" surfaceScale="1.1" specularConstant="0.7" specularExponent="20" lighting-color="white">
<fePointLight x="50" y="50" z="30" />
</feSpecularLighting>
<feComponentTransfer>
<feFuncA type="linear" slope="0.45" />
</feComponentTransfer>
</filter>
<rect width="100%" height="100%" filter="url(#noiseFilter)" fill="white" />
</svg>`;
    document.getElementById('noiseUnderlay').style.background = `url('data:image/svg+xml;charset=utf-8,${encodeURIComponent(noiseSVG)}')`;
}

setNoiseTexture()

let gtl = gsap.timeline();

gtl.set(':root', {cursor: 'none'})
    .set('body', {overflowY: "hidden"})
    .set('#noiseUnderlay', {opacity: 0})
    .fromTo('body', {height: '0vh'}, {height: '100vh', duration: 0.3, delay:0.1, ease: "none"},)
    .fromTo('body', {margin: "auto"}, {margin:0, width: '100vw', duration: 0.3, ease: "power2.in"})
    .fromTo('.fbody', {display: "none", opacity: 0}, {display: "block", opacity: 1})
    .addLabel("fbodyvis")
    .from(".t1", {text: "", opacity: 0, duration: 0.1})
    .from(".t2", {text: "", opacity: 0, duration: 0.1})
    .from(".hanim", {opacity: 0, text: "", duration: 0.3}, "fbodyvis")
    .from("nav", {opacity: 0, duration: 0.3}, "fbodyvis").eventCallback("onComplete", () => {
        document.querySelectorAll("#about > div").forEach(div => {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: div,
                    toggleActions: "play reverse play reverse",
                    start: "top center",
                    end: "bottom center",
                    pin: div,
                    snap: {
                        snapTo: () => 0.01,
                    },
                    // markers: true,
                    pinSpacing: false,
                    preventOverlaps: true,
                }
            })
            tl.from(div.getElementsByTagName("h1")[0], {opacity: 0, text: ""})
            .from(div.getElementsByTagName("p")[0], {opacity: 0, text: ""}, "<").addLabel("visible")
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

        document.querySelectorAll(".circ-text").forEach(makeCircTextDecl)
    }).set('body', {height: "fit-content", overflowY: "scroll"})
    .set(':root', {cursor: 'crosshair'})
    .to('#noiseUnderlay', {opacity: 1, duration: 0.3}, "fbodyvis")

// gtl.pause(12)
// let stl = gsap.timeline({
//     scrollTrigger: {
//         trigger: "h1, p"
//     },
// })

// stl.from("h1", {text: "", opacity: 0, y: -30}).from("p", {text: "", opacity: 0, y: -10})


// gtl.repeat(-1);
// gtl.pause(7)

const fsig = (x) => x / (1 + x)

const dur = 0.3
const createCursorFollower = () => {
    const cur = document.querySelector('#cursor');
    let isDown = false;
    let lastX = 0
    let lastY = 0
    let last = performance.now()

    let lock = false
    window.addEventListener('mousemove', (e) => {
        const now = performance.now()
        const { target, clientX:x, clientY:y } = e;
        const isTargetLinkOrBtn = target?.closest('a');
        const dt = now - last;
        const vel = Math.sqrt(Math.pow((x - lastX) / dt, 2) + Math.pow((y - lastY) / dt, 2))
        const scale = fsig(vel);

        last = now
        lastX = x;
        lastY = y;

        gsap.to(cur, {
            x: x,
            y: y,
            duration: dur,
            ease: 'power2.out',
        });

        if (lock === false && vel > 3) {
            lock = true
            setTimeout(() => {setNoiseTexture(); lock = false;}, 500)
        }

        gsap.to(cur, {
            backgroundColor: `rgba(${255 * (1 - scale)}, 0, ${255 * scale}, ${scale})`,
            backdropFilter: isTargetLinkOrBtn ? "sepia(100%)" : "invert(100%)",
            scale: (isDown || target?.closest('h1, p, .hero-text, .contcirc') ? 4 : isTargetLinkOrBtn ? 3 : 1),
            duration: 0.5,
            ease: 'power3.out',
        })
    });

    document.addEventListener('mouseleave', (e) => {
        isDown = false;
        gsap.to(cur, {
            duration: dur,
            opacity: 0,
        });
    });

    document.addEventListener('mouseenter', _ => gsap.to(cur, {duration: dur, opacity: 1}))

    document.addEventListener('mousedown', _ => {
        if (lock === false) {
            lock = true
            setTimeout(() => {setNoiseTexture(); lock = false;}, 300)
        }
        isDown = true;
        gsap.to(cur, {scale: 4, ease: "expo.out", duration: dur})
    })

    document.addEventListener('mouseup', e => {
        isDown = false;
        const target = e.target;
        const isTargetLinkOrBtn = target?.closest('a') || target?.closest('button');
        gsap.to(cur, {scale: isDown || target?.closest('h1, p, .hero-text, .contcirc') ? 4 : isTargetLinkOrBtn ? 3 : 1, ease: "expo.out", duration: dur})
    })
};

if (!isTouchDevice) createCursorFollower();


function makeCircText(elem, arcRad = 1.9 * Math.PI, repeat = 1, textOrient = 1, bullet = "•") {
    // console.log(elem.dataset.text);
    const _text = elem.dataset.text;
    let text = []

    for (let i = 0; i < repeat; i++) {
        text = text.concat(_text.split(""));
        text.push(" ")
        text.push(bullet)
        text.push(" ")
    }

    const len = text.length;
    const radPerChar = arcRad / len;

    let centerX = elem.offsetWidth / 2
    let centerY = elem.offsetHeight / 2

    text.forEach((char, index) => {
        const self = document.createElement("div")
        const theta = index * radPerChar;
        self.innerText = char;
        self.style.transformOrigin = "top left"
        self.style.transform = `translate(${centerX - Math.cos(theta) * centerX * textOrient}px, ${centerY - Math.sin(theta) * centerY * textOrient}px) rotate(${theta - Math.PI / 2}rad)`;
        elem.appendChild(self);
    })

    // gsap.to(elem, {rotate: "720deg", duration:20, repeat: -1, ease: "none"})
}

function makeCircTextDecl(elem) {
    makeCircText(elem, elem.dataset.arcRad || 2 * Math.PI, elem.dataset.repeat || 1, elem.dataset.textOrient || 1, elem.dataset.bullet || "•")
}

