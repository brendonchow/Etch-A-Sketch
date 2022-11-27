const DIMENSION = 750;
const grid = document.querySelector(".grid")
let numberOfBoxes = 24;

let box;
for (let i = 0; i < numberOfBoxes ** 2; i++)
{
    box = document.createElement("div");
    box.classList.add("box");
    box.style.height = `${DIMENSION / 24}px`;
    box.style.width = `${DIMENSION / 24}px`;
    if (i % 24 === 0)
    {
        grid.appendChild(document.createElement("br"));
        box.style.borderLeftWidth = "1px";
    }
    if (i < 24)
    {
        box.style.borderTopWidth = "1px";
    }
    grid.appendChild(box);               
}

const boxes = document.querySelectorAll(".box");
boxes.forEach(element => {
    element.addEventListener("mouseover", (e) => {
        // Checks that left mouse button is down
        if (e.buttons === 1) e.target.style.backgroundColor = "black";
    });
});

   
