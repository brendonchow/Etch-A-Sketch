const grid = document.querySelector(".grid");
grid.style.backgroundColor = "white";
let boxes;
let penColor = "black";
let gridLinesOn = 1;
let eraserOn = 0;
let rainbowOn = 0;
const rainbowColors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

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
        if (eraserOn) box.style.backgroundColor = "";
        else if (rainbowOn) {
            //const rgb = Math.floor(Math.random() * 16777215);
            //box.style.backgroundColor = `#${rgb}`;
            box.style.backgroundColor = rainbowColors[Math.floor(Math.random() * 7)];
        }
        else box.style.backgroundColor = penColor;
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


const slider = document.querySelector(".slider");
const sliderValue = document.querySelector(".sliderValue")
slider.addEventListener("change", e => {
    sliderValue.textContent = `Grid size: ${e.target.value} x ${e.target.value}`;
    createGrid(e.target.value);
});

const backgroundColor = document.querySelector(".backgroundColor");
// input event listener so color dynamically changes depending on cursor
backgroundColor.addEventListener("input", e => grid.style.backgroundColor = e.target.value);

const clear = document.querySelector(".clear");
clear.addEventListener("click", () => {
    boxes.forEach(box => box.style.backgroundColor = "");
})

const penColorSelect = document.querySelector(".penColor");
penColorSelect.addEventListener("input", e => penColor = e.target.value);

const gridLines = document.querySelector(".lines");
gridLines.addEventListener("click", () => {
    // .style only has access to inline styles
    gridLines.classList.toggle("buttonActive");
    gridLinesOn ^= 1;
    boxes.forEach(box =>  {
        box.classList.toggle("boxBorder");
    })
});

const eraser = document.querySelector(".eraser")
eraser.addEventListener("click", () => {
    eraser.classList.toggle("buttonActive");
    eraserOn ^= 1;
})

const rainbow = document.querySelector(".rainbow");
rainbow.addEventListener("click", () => {
    rainbow.classList.toggle("buttonActive");
    rainbowOn ^= 1;
})


    




   
