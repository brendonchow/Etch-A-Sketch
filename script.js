// Should have converted all color values to hexadecimal rather than rgb values

const grid = document.querySelector(".grid");
grid.style.backgroundColor = "rgb(255, 255, 255)";
let boxes;
let penColor = "rgb(0, 0, 0)";
let gridLinesOn = 1;
const rainbowColors =   ["rgb(255, 0, 0)", "rgb(255, 127, 0)", "rgb(255, 255, 0)",
                         "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(75, 0, 130)", "rgb(127, 0, 255)"];

const slider = document.querySelector(".slider");
const sliderValue = document.querySelector(".sliderValue")
const backgroundColor = document.querySelector(".backgroundColor");
const clear = document.querySelector(".clear");
const penColorSelect = document.querySelector(".penColor");
const gridLines = document.querySelector(".lines");
const rainbow = document.querySelector(".rainbow");
const shading = document.querySelector(".shading");
const eraser = document.querySelector(".eraser");
const lighten = document.querySelector(".lighten");

const fill = document.querySelector(".fill");
let fillOn = 0;

const grabber = document.querySelector(".grabber");
let grabberOn = 0;

const modes = [[eraserFunc, eraser], [rainbowFunc, rainbow], [shadingFunc, shading], [lightenFunc, lighten], [defaultFunc]]

let currentMode = 4;
/*
Color stores the original color before any shading
Shade stores the level of shading/lighting where 0 <= shading < 1 and 1 < lighting <= 2
prev stores the shaded/lighten color before applying the opposite effect.
prev is used to ensure that starting from any rgb value regardless of whether it has been shaded/lightened, 
it will always be 10 pass to either white or black
*/
function defaultFunc(box) {
    box.style.backgroundColor = penColor;
    box.setAttribute("color", penColor);
    box.setAttribute("shade", "1");
    box.removeAttribute("prev");
}

function eraserFunc(box) {
    box.style.removeProperty("background-color");
    box.setAttribute("color", grid.style.backgroundColor);
    box.setAttribute("shade", "1");
    box.removeAttribute("prev");
}

function rainbowFunc(box) {
    const newColor = rainbowColors[Math.floor(Math.random() * 7)];
    box.style.backgroundColor = newColor;
    box.setAttribute("color", newColor);
    box.setAttribute("shade", "1");
    box.removeAttribute("prev");
}

function shadingFunc(box) {
    let shading = parseFloat(box.getAttribute("shade"));

    if (shading >= 1){
        shading = 0.9;
        box.setAttribute("prev", box.style.backgroundColor);
    } else {
        shading = (shading <= 0) ? 0 : shading - 0.1;
    }
    box.setAttribute("shade", shading);
    let newColor = rgbToDecimal(box.getAttribute("prev"), i => parseInt(i) * shading);
    box.style.background = arrayToRGBA(newColor); 
}

function lightenFunc(box) {
    let shading = parseFloat(box.getAttribute("shade"));

    if (shading <= 1){
        shading = 1.1;
        box.setAttribute("prev", box.style.backgroundColor);
    } else {
        shading = (shading >= 2) ? 2 : shading + 0.1;
    }

    box.setAttribute("shade", shading);
    let newColor = rgbToDecimal(box.getAttribute("prev"), i => {
        i = parseInt(i);
        return (255 - i) * (shading - 1) + i;
    });
    box.style.background = arrayToRGBA(newColor);
}

function rgbToDecimal(color, fn) {
    return color.slice(4, color.length - 1).split(",").map(fn);
}

function arrayToRGBA(color) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

function hexaToDecimal(color, fn) {
    const rgb = [];
    for (let i = 1; i < 7; i += 2) {
        rgb.push(parseInt(color.substr(i, 2), 16));
    }
    return rgb.map(fn);
}

function rgbToHexa(rgb)
{
    const decimal = rgbToDecimal(rgb, i => {
        let decimalString = parseInt(i).toString(16).trim();
        return (decimalString.length === 1) ? "0" + decimalString : decimalString;
    });
    return "#" + decimal.join("");
}

function createGrid(sideLength) 
{
    let box, line, i, j;
    grid.replaceChildren();
    for (i = 0; i < sideLength; i++)
    {
        line = document.createElement("div");
        line.classList.add("row")
        for (j = 0; j < sideLength; j++)
        {
            box = document.createElement("div");
            box.classList.add("box");
            box.setAttribute("shade", "1");
            box.setAttribute("color", grid.style.backgroundColor);
            box.style.backgroundColor = grid.style.backgroundColor;
            if (gridLinesOn) box.classList.add("boxBorder");
            if (j === 0) box.style.borderLeftWidth = "1px";
            if (i === 0) box.style.borderTopWidth = "1px";         
            line.appendChild(box);
        }
        grid.appendChild(line);       
    }
    boxes = document.querySelectorAll(".box");

    boxes.forEach(element => {
        element.addEventListener("mousedown", (e) => {
            if (e.buttons === 1)
            {
                if (fillOn) {
                    fillBackground(penColor);
                    fill.classList.toggle("buttonActive");
                    fillOn = 0;
                }
                else if (grabberOn) {
                    penColor = e.target.style.backgroundColor;
                    let newColor = rgbToHexa(e.target.style.backgroundColor);
                    if (newColor == "#") newColor = "#ffffff";
                    penColorSelect.value = newColor;
                    grabber.classList.toggle("buttonActive");
                    grabberOn = 0;
                }
                else modes[currentMode][0](e.target);
            }
        });        
        element.addEventListener("mouseover", (e) => {
            if (e.buttons === 1) modes[currentMode][0](e.target);
            // Checks that left mouse button is down
        });

    });  
}

createGrid(10);

function fillBackground(rgb) {
    boxes.forEach(box => {
        // CHECK
        let boxColor = box.style.backgroundColor;
        if (boxColor == grid.style.backgroundColor) {
            box.style.backgroundColor = rgb;
            box.setAttribute("color", rgb);
        };
    });
    grid.style.backgroundColor = rgb;
}

slider.addEventListener("change", e => {
    sliderValue.textContent = `Grid size: ${e.target.value} x ${e.target.value}`;
    createGrid(e.target.value);
});

let count = 0;
// input event listener so color dynamically changes depending on cursor
backgroundColor.addEventListener("input", e => changeBackground(e.target.value));

function changeBackground(e) {
    // input gives us hexadecimal color values
    const currentRgb = arrayToRGBA(hexaToDecimal(e, i => i));
    
    count = 0;
    boxes.forEach(box => {
        if (box.getAttribute("color") !== grid.style.backgroundColor) return;
        let shade = parseFloat(box.getAttribute("shade"));
        let newColor;
        if (shade <= 1) {
            newColor = hexaToDecimal(e, i => i * shade);
        } else {
            newColor = hexaToDecimal(e, i => (255 - i) * (shade - 1) + i);
        }
        newColor = arrayToRGBA(newColor);
        box.setAttribute("color", currentRgb);
        box.style.backgroundColor = newColor;
        box.setAttribute("prev", currentRgb);
    });
    grid.style.backgroundColor = currentRgb;
}

clear.addEventListener("click", () => {
    boxes.forEach(box => {
        box.style.removeProperty("background-color");
        box.setAttribute("color", grid.style.backgroundColor);
        box.setAttribute("shade", "1");
    });
});

penColorSelect.addEventListener("input", e => {
    penColor = arrayToRGBA(hexaToDecimal(e.target.value, i => i));
});

gridLines.addEventListener("click", () => {
    gridLines.classList.toggle("buttonActive");
    boxes.forEach(box =>  {
        box.classList.toggle("boxBorder");
    });
});

eraser.addEventListener("click", () => {
    toggleRadio(eraser, 0);
})

rainbow.addEventListener("click", () => {
    toggleRadio(rainbow, 1);
})

shading.addEventListener("click", () => {
    toggleRadio(shading, 2)
})

lighten.addEventListener("click", () => {
    toggleRadio(lighten, 3)
})

function toggleRadio(button, selfArrayIndex)
{
    if (selfArrayIndex === currentMode) {
        currentMode = 4;
    } else {
        // Finds the button active beforehand and toggle it off if mode was not default
        if (currentMode !== 4) modes[currentMode][1].classList.toggle("buttonActive");
        currentMode = selfArrayIndex;
    }
    button.classList.toggle("buttonActive");
}

fill.addEventListener("click", () => turnFill(fill, grabber));

grabber.addEventListener("click", () => turnGrabber(grabber, fill))

function turnGrabber(grabber, fill) {
    grabberOn ^= 1;
    grabber.classList.toggle("buttonActive");
    if (grabberOn === 1 && fillOn === 1) turnFill(fill, grabber);
}

function turnFill(fill, grabber) {
    fillOn ^= 1;
    fill.classList.toggle("buttonActive");
    if (grabberOn === 1 && fillOn === 1) turnGrabber(grabber, fill);
}



    




   
