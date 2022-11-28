const grid = document.querySelector(".grid");
grid.style.backgroundColor = "#ffffff";
let boxes;
let penColor = "#000000";
let gridLinesOn = 1;
const rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];

const slider = document.querySelector(".slider");
const sliderValue = document.querySelector(".sliderValue")
const backgroundColor = document.querySelector(".backgroundColor");
const clear = document.querySelector(".clear");
const penColorSelect = document.querySelector(".penColor");
const gridLines = document.querySelector(".lines");
const rainbow = document.querySelector(".rainbow");
const shading = document.querySelector(".shading");
const eraser = document.querySelector(".eraser");
const lighten = document.querySelector(".lighten")

const modes = [[eraserFunc, eraser], [rainbowFunc, rainbow], [shadingFunc, shading], [lightenFunc], [defaultFunc]]
let currentMode = 4;

function eraserFunc(box) {
    box.style.backgroundColor = "";
}

function rainbowFunc(box) {
    box.style.backgroundColor = rainbowColors[Math.floor(Math.random() * 7)];
}

function shadingFunc(box) {
    changeShading(box, 0.9)
}

function lightenFunc(box) {
    changeShading(box, 1.1)
}

function changeShading(box, percent)
{
    let currentColor = box.style.backgroundColor;
    if (!currentColor) {
        currentColor = grid.style.backgroundColor;
    }
    let newColor;
    newColor = currentColor.slice(4, currentColor.length - 1).split(", ").map((i) => i * percent);
    box.style.background = `rgba(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`;
}

function defaultFunc(box) {
    box.style.backgroundColor = penColor;
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
            if (gridLinesOn) box.classList.add("boxBorder");
            if (j === 0) box.style.borderLeftWidth = "1px";
            if (i === 0) box.style.borderTopWidth = "1px";         
            line.appendChild(box);
        }
        grid.appendChild(line);
                   
    }
    boxes = document.querySelectorAll(".box");
    function colorBox(box)
    {
        modes[currentMode][0](box);
    }

    boxes.forEach(element => {
        element.addEventListener("mouseover", (e) => {
            // Checks that left mouse button is down
            if (e.buttons === 1) colorBox(e.target);
        });
        element.addEventListener("mousedown", (e) => {
            if (e.buttons === 1) colorBox(e.target);
        })
    });  
      
}

createGrid(10);



slider.addEventListener("change", e => {
    sliderValue.textContent = `Grid size: ${e.target.value} x ${e.target.value}`;
    createGrid(e.target.value);
});


// input event listener so color dynamically changes depending on cursor
backgroundColor.addEventListener("input", e => grid.style.backgroundColor = e.target.value);


clear.addEventListener("click", () => {
    boxes.forEach(box => box.style.backgroundColor = "");
})


penColorSelect.addEventListener("input", e => penColor = e.target.value);

gridLines.addEventListener("click", () => {
    // .style only has access to inline styles
    gridLines.classList.toggle("buttonActive");
    boxes.forEach(box =>  {
        box.classList.toggle("boxBorder");
    })
});

eraser.addEventListener("click", () => {
    toggleButtons(eraser, 0);
})


rainbow.addEventListener("click", () => {
    toggleButtons(rainbow, 1);
})


shading.addEventListener("click", () => {
    toggleButtons(shading, 2)
})



function toggleButtons(button, selfArrayIndex)
{
    console.log(button, selfArrayIndex);
    if (selfArrayIndex === currentMode) {
        currentMode = 4;
    } else {
        if (currentMode !== 4) modes[currentMode][1].classList.toggle("buttonActive")
        currentMode = selfArrayIndex
    }
    button.classList.toggle("buttonActive");
}


    




   
