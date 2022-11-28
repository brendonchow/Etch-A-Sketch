const grid = document.querySelector(".grid");
grid.style.backgroundColor = "rgb(255,255,255)";
let boxes;
let penColor = "rgb(0,0,0)";
let gridLinesOn = 1;
const rainbowColors =   ["rgb(255,0,0)", "rgb(255,127,0)", "rgb(255,255,0)",
                         "rgb(0,255,0)", "rgb(0,0,255)", "rgb(75,0,130)", "rgb(127,0,255)"];

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

const modes = [[eraserFunc, eraser], [rainbowFunc, rainbow], [shadingFunc, shading], [lightenFunc, lighten], [defaultFunc]]

let currentMode = 4;

function defaultFunc(box) {
    box.style.backgroundColor = penColor;
    box.setAttribute("color", penColor);
    box.setAttribute("shade", "1");
}

function eraserFunc(box) {
    box.style.removeProperty("background-color");
    box.setAttribute("color", grid.style.backgroundColor);
    box.setAttribute("shade", "1");
}

function rainbowFunc(box) {
    const newColor = rainbowColors[Math.floor(Math.random() * 7)];
    box.style.backgroundColor = newColor;
    box.setAttribute("color", newColor);
    box.setAttribute("shade", "1");
}

function shadingFunc(box) {
    let shading = parseFloat(box.getAttribute("shade"));
    box.removeAttribute("shade");
    if (shading > 1) {
        shading = 0.9;
        box.setAttribute("color", box.style.backgroundColor);
    } else shading -= 0.1;
    box.setAttribute("shade", shading);
    let newColor = rgbToDecimal(box.getAttribute("color"), i => parseInt(i) * shading);
    box.style.background = arrayToRGBA(newColor);    
}

function lightenFunc(box) {
    let shading = parseFloat(box.getAttribute("shade"));
    box.removeAttribute("shade");
    if (shading < 1) {
        shading = 1.1;
        box.setAttribute("color", box.style.backgroundColor);
    } else shading += 0.1;
    box.setAttribute("shade", shading);

    let newColor = rgbToDecimal(box.getAttribute("color"), i => {
        i = parseInt(i);
        return (255 - i) * (shading - 1) + i;
    });
    box.style.background = arrayToRGBA(newColor);
}

function rgbToDecimal(color, fn) {
    return color.slice(4, color.length - 1).split(",").map(fn);
}

function arrayToRGBA(color) {
    return `rgb(${color[0]},${color[1]},${color[2]})`
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
            box.setAttribute("shade", 1);
            box.setAttribute("color", grid.style.backgroundColor);
            if (gridLinesOn) box.classList.add("boxBorder");
            if (j === 0) box.style.borderLeftWidth = "1px";
            if (i === 0) box.style.borderTopWidth = "1px";         
            line.appendChild(box);
        }
        grid.appendChild(line);       
    }
    boxes = document.querySelectorAll(".box");

    boxes.forEach(element => {
        element.addEventListener("mouseover", (e) => {
            // Checks that left mouse button is down
            if (e.buttons === 1) modes[currentMode][0](e.target);
        });
        element.addEventListener("mousedown", (e) => {
            if (e.buttons === 1) modes[currentMode][0](e.target);
        })
    });  
      
}

createGrid(10);

slider.addEventListener("change", e => {
    sliderValue.textContent = `Grid size: ${e.target.value} x ${e.target.value}`;
    createGrid(e.target.value);
});

let count;
// input event listener so color dynamically changes depending on cursor
backgroundColor.addEventListener("input", e => {
    const currentRgb = arrayToRGBA(hexaToDecimal(e.target.value, i => i));
    grid.style.backgroundColor = currentRgb;
    count = 0;
    boxes.forEach(box => {
        let shade = parseFloat(box.getAttribute("shade"));
        let newColor;
        if (shade <= 1) {
            newColor = hexaToDecimal(e.target.value, i => i * shade);
        } else {
            newColor = hexaToDecimal(e.target.value, i => (255 - i) * (shade - 1) + i);
        }
        newColor = arrayToRGBA(newColor);
        box.setAttribute("color", currentRgb);
        box.style.backgroundColor = newColor;       
    });
});

function hexaToDecimal(color, fn) {
    const rgb = [];
    for (let i = 1; i < 7; i += 2) {
        rgb.push(parseInt(color.substr(i, 2), 16));
    }
    return rgb.map(fn);
}


clear.addEventListener("click", () => {
    boxes.forEach(box => {
        box.style.removeProperty("background-color");
        box.setAttribute("color", grid.style.backgroundColor);
        box.setAttribute("shade", "1");
    });
});

penColorSelect.addEventListener("input", e => penColor = arrayToRGBA(hexaToDecimal(e.target.value, i => i)));

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


    




   
