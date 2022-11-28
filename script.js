const grid = document.querySelector(".grid");
let boxes;

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
            if (e.buttons === 1) e.target.style.backgroundColor = "black";
        });
        element.addEventListener("dragstart", e => {
            // Stops the drag function
            e.preventDefault();
        });
        element.addEventListener("mousedown", (e) => {
            if (e.buttons === 1) e.target.style.backgroundColor = "black"
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
// clear.addEventListener("click", e => )

const penColor = document.querySelector(".penColor");

   
