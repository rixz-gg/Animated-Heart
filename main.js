let config = {
    text: "I Love You",
    numPoints: 80,
    speed: 0.002,
    fontSize: 14,
    primaryColor: "#ff149d",
    glowColor: "#ff0077",
    effect: "normal",
    rotation: 305,
};

const heartContainer = document.getElementById("heart-container");
const controlsEl = document.getElementById("controls");
const mobileToggle = document.getElementById("mobile-toggle");
const textInput = document.getElementById("text-input");
const pointsSlider = document.getElementById("points-slider");
const pointsValue = document.getElementById("points-value");
const speedSlider = document.getElementById("speed-slider");    
const speedValue = document.getElementById("speed-value");
const sizeSlider = document.getElementById("size-slider");
const sizeValue = document.getElementById("size-value");
const primaryColorInput = document.getElementById("primary-color");
const glowColorInput = document.getElementById("glow-color");
const effectSelect = document.getElementById("effect-select");
const rotationSlider = document.getElementById("rotation-slider");
const rotationValue = document.getElementById("rotation-value");
const loadingScreen = document.querySelector(".loading-screen");

let spans = [];
let rafId;
let lastTime = 0;

function setupHeart() {
    heartContainer.innerHTML = "";
    spans = [];

    for (let i = 0; i < config.numPoints; i++) {
        let span = document.createElement("span");
        span.className = "text";
        span.innerText = config.text;
        span.style.fontSize = `${config.fontSize}px`;

        heartContainer.appendChild(span);
        spans.push(span);
    }

    if (config.effect === "pulse") {
        heartContainer.classList.add("pulse");
    } else {
        heartContainer.classList.remove("pulse");
    }

    document.documentElement.style.setProperty(
        "--color-primary",
        config.primaryColor
    );
    document.documentElement.style.setProperty(
        "--color-accent",
        config.glowColor
    );
}

function animateHeart(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;

    const scaleFactor = window.innerWidth < 768 ? 8 : 12;

    for (let i = 0; i < spans.length; i++) {
        let t =
            (Math.PI * 2 * (i + timestamp * config.speed)) / config.numPoints;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

        let translateX = x * scaleFactor;
        let translateY = -y * scaleFactor;

        let transform = `translate(${translateX}px, ${translateY}px) rotate(${config.rotation}deg)`;
        const progress = (timestamp * config.speed) % (Math.PI * 2);

        switch (config.effect) {
            case "rainbow":
                const hue =
                    ((360 * i) / config.numPoints + timestamp * 0.05) % 360;
                spans[i].style.color = `hsl(${hue}, 100%, 70%)`;
                spans[
                    i
                ].style.textShadow = `0 0 5px hsl(${hue}, 100%, 70%), 0 0 10px hsl(${hue}, 100%, 50%)`;
                break;
            case "wave":
                const wave = Math.sin(progress + i * 0.1) * 5;
                transform += ` scale(${1 + wave * 0.05})`;
                break;
            case "explode":
                const explodeProgress = (timestamp % 5000) / 5000;
                if (explodeProgress < 0.5) {
                    const scale = 1 + explodeProgress * 2 * 0.3;
                    transform += ` scale(${scale})`;
                    spans[i].style.opacity = 1 - explodeProgress;
                } else {
                    const scale = 1.3 - (explodeProgress - 0.5) * 2 * 0.3;
                    transform += ` scale(${scale})`;
                    spans[i].style.opacity = (explodeProgress - 0.5) * 2;
                }
                break;
            default:
                spans[i].style.color = "#ffffff";
                spans[
                    i
                ].style.textShadow = `0 0 5px ${config.glowColor}, 0 0 10px ${config.glowColor}, 0 0 15px ${config.primaryColor}`;
                break;
        }

        spans[i].style.transform = transform;
    }

    lastTime = timestamp;
    rafId = requestAnimationFrame(animateHeart);
}

function init() {
    setupHeart();

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animateHeart);

    textInput.value = config.text;
    pointsSlider.value = config.numPoints;
    pointsValue.textContent = config.numPoints;
    speedSlider.value = config.speed * 1000;
    speedValue.textContent = (config.speed * 1000).toFixed(0);
    sizeSlider.value = config.fontSize;
    sizeValue.textContent = `${config.fontSize}px`;
    primaryColorInput.value = config.primaryColor;
    glowColorInput.value = config.glowColor;
    effectSelect.value = config.effect;
    rotationSlider.value = config.rotation;
    rotationValue.textContent = `${config.rotation}°`;

    setTimeout(() => {
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 1000);
    }, 1500);
}

textInput.addEventListener("input", (e) => {
    config.text = e.target.value || "Te Amo";
    setupHeart();
});

pointsSlider.addEventListener("input", (e) => {
    config.numPoints = parseInt(e.target.value);
    pointsValue.textContent = config.numPoints;
    setupHeart();
});

speedSlider.addEventListener("input", (e) => {
    config.speed = parseInt(e.target.value) * 0.001;
    speedValue.textContent = e.target.value;
});

sizeSlider.addEventListener("input", (e) => {
    config.fontSize = parseInt(e.target.value);
    sizeValue.textContent = `${config.fontSize}px`;
    setupHeart();
});

primaryColorInput.addEventListener("input", (e) => {
    config.primaryColor = e.target.value;
    setupHeart();
});

glowColorInput.addEventListener("input", (e) => {
    config.glowColor = e.target.value;
    setupHeart();
});

effectSelect.addEventListener("change", (e) => {
    config.effect = e.target.value;
    setupHeart();
});

rotationSlider.addEventListener("input", (e) => {
    config.rotation = parseInt(e.target.value);
    rotationValue.textContent = `${config.rotation}°`;
});

mobileToggle.addEventListener("click", () => {
    controlsEl.classList.toggle("visible");
});

window.addEventListener("load", init);

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        controlsEl.classList.remove("visible");
    }
});