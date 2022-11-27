const DIMENSION = 500;
const grid = document.querySelector(".grid");


function createGrid(sideLength) 
{
    let box, line, i, j;
    grid.replaceChildren();
    
    for (i = 0; i < sideLength; i++)
    {
        line = document.createElement("div");
        line.classList.add("row");
        line.setAttribute("draggable", "false");
        const boxDimensions = DIMENSION / sideLength;
        for (j = 0; j < sideLength; j++)
        {
            box = document.createElement("div");
            box.classList.add("box");
            box.style.height = `${boxDimensions}px`;
            box.style.width = `${boxDimensions}px`;     
            box.setAttribute("draggable", "false")
            if (j === 0)
            {
                box.style.borderLeftWidth = "1px";
            }
            
            if (i === 0)
            {
                box.style.borderTopWidth = "1px";
            }
            
            line.appendChild(box);
            
        }
        grid.appendChild(line);
                   
    }
    const boxes = document.querySelectorAll(".box");
    
    boxes.forEach(element => {
        element.addEventListener("mouseover", (e) => {
            // Checks that left mouse button is down    
            if (e.buttons === 1) e.target.style.backgroundColor = "black";
        });
        element.addEventListener("dragstart", e => {
            console.log(e);
            // Stops the drag function
            e.preventDefault();
        })
    });  
      
}

createGrid(10);


const slider = document.querySelector(".slider");
slider.addEventListener("change", () => createGrid(parseInt(slider.value)))

   
