
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();
const colorPicker = document.getElementById('colorPicker');
const chosenColorButton = document.getElementById('chosenColor');
const brushSizeSlider = document.getElementById('brushSize');
const brushSizeDisplay = document.getElementById('brushSizeValue');
const canvasContainer = document.getElementById('canvas-container');
const confirmationDialog = document.getElementById('confirmationDialog');
const undoButton = document.getElementById('undoButton');
const saveButton = document.getElementById('saveButton');
const resetImageButton = document.getElementById('resetImage');
const newPageButton = document.getElementById('newPage');
const fileInputButton = document.getElementById('fileInput');
const PauseButton = document.getElementById('Pause');
const zoomInButton = document.getElementById('ZoomIn');
const zoomOutButton = document.getElementById('ZoomOut');
const DragButton = document.getElementById('Drag');
const switchToPenButton=document.getElementById('switchToPen');
const switchToEraserButton=document.getElementById('switchToEraser');
const pencilButtonsContainer = document.getElementById('pencilButtons');
const switchToPencilButton=document.getElementById('switchToPencil');
const switchToPencil1Button = document.getElementById('switchToPencil1');
const switchToPencil2Button = document.getElementById('switchToPencil2');
const switchToSprayButton = document.getElementById('switchToSpray');
const switchToSplashButton = document.getElementById('switchToSplash');
const toggleFiguresButton=document.getElementById('toggleFigures');

const brushSizeFrame = document.getElementById('brushSizeFrame');
const transparencyOptions = document.getElementById('transparencyOptions');
const settingsscreen = document.getElementById('settingsscreen');
const figuresContainer = document.getElementById("figures-container");

const rectangleButton = document.getElementById('rectangleButton');
const lineButton = document.getElementById('lineButton');
const circleButton = document.getElementById('circleButton');
const triangleButton = document.getElementById('triangleButton');
const elipsaButton = document.getElementById('elipsaButton');
const IsoscelesTriangleButton = document.getElementById('IsoscelesTriangle');
const selectColorButton = document.getElementById('selectColor');
const toggleBrushSizeButton = document.getElementById('toggleBrushSizeButtons');
const PenTransparencyButton = document.getElementById('toggleTransparencyOptions');
const settingsbutton=document.getElementById('settingsbutton');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const MatrixButton = document.getElementById('downloadBtn');
const redColorButton = document.getElementById('redColor');
const greenColorButton = document.getElementById('greenColor');
const blueColorButton = document.getElementById('blueColor');
const yellowColorButton = document.getElementById('yellowColor');
const cyanColorButton = document.getElementById('cyanColor');
const magentaColorButton = document.getElementById('magentaColor');
const confirmYesButton = document.getElementById('confirmYes');
const confirmNoButton = document.getElementById('confirmNo');

const level1Button = document.getElementById('level1');
const level2Button = document.getElementById('level2');
const level3Button = document.getElementById('level3');
const level1Palette = document.getElementById('level1Palette');
const level2Palette = document.getElementById('level2Palette');
const level3Palette = document.getElementById('level3Palette');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const containerWidth = canvasContainer.clientWidth;
const containerHeight = canvasContainer.clientHeight;


let  isSplashMode=false, isPencilMode = false, isPencil_noCompass=false, isEraserMode = false,isZoomOutMode = false,isZoomInMode = false,
     isDragMode=false, isPenMode = false,isSprayMode=false, isDrawing = false, isRectangleMode = false,
     isCircleMode = false, isIsoscelesTriangleMode=false, isTriangleMode = false, isLineMode = false, isEllipseMode=false, 
    startX, startY,start_drawingX, start_drawingY ,currentX=0 ,currentY=0, flag=0, t=0, movement_check=0,
    clientXWithinThreshold, clientYWithinThreshold ,currentAction = null, originalData, originalImageData,interval, 
    brushSize = 1, penAlpha = 1,eraserSize = brushSize, timeoutId = null ,p=0,row=0,scale = 1, distance=1000;

// start_drawingX: The place where the mouse click happened and dwell-click finished!
// startX: The place where the dwell-click started!
// currentX: The place the mouse is in the call to every event function.
// endX/Y: Only for compass use. The place with Z distance from currentX/Y, inside the compass.

let actionsStack = [],matrix_mousePosition = [];

let A = 0.5; // Parameter to control the speed of compass drawing

let timesetting = 2000; // Default timesetting value
let threshold = 40,user_threshold=40; // Default threshold value
let numberOfRows = 100; //number of matrix_mousePosition rows

for (let i = 0; i < numberOfRows; i++) {//initalizing matrix_mousePosition
    matrix_mousePosition[i] = [];
    for (let j = 0; j < 3; j++) {
        matrix_mousePosition[i][j] = [];
    }
}


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", Drawing);
canvas.addEventListener("mouseleave", stopdraw);


function startDraw(event) {
    if (movement_check==1){// So there will be no double-click, mouse & dwell-click
        return;
    }
    currentX = event.offsetX;
    currentY = event.offsetY;
    click_happened();
    clearTimeout(timeoutId);
    timeoutId = null;
    movement_check=1;
}


function Drawing(event) {

    const color = colorPicker.value;
    const rgbaColor = hexToRgba(color, penAlpha);
    currentX = event.offsetX;
    currentY = event.offsetY;

    if (row < numberOfRows) {
        time=getCurrentTime();
        matrix_mousePosition[row] = `${time},${currentX},${currentY}`;
        row++;
    }

    if (isPenMode || isZoomInMode|| isZoomOutMode||isDragMode){// Drawing black circle for help 
        if (p!=0)  {
            undoLastAction();}
        p++;
        saveCanvasState();
        drawBlackCircle(currentX,currentY,threshold)
    }

    distance = getDistance(startX, startY, currentX, currentY);

    if (distance <= threshold) {
        if (!timeoutId){//Starting the timecount
            startX = currentX;
            startY = currentY;
            timeoutId = setTimeout(() => {
                click_happened();
                 }, timesetting); }
                }
    else{
        restart_timeout();
    }
 
    if (movement_check==1){// Click has been made
        restart_timeout();
        if (isDrawing){

            ctx.beginPath(); // creating new path to draw
            undoLastAction();//Delete the circle/dot now!
            saveCanvasState();// Save the current canvas state before drawing

            originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            start_drawingX = event.offsetX;
            start_drawingY = event.offsetY;   
           }
    }



    if (movement_check==0){
        ctx.strokeStyle = rgbaColor;
        ctx.fillStyle = rgbaColor; 
        ctx.lineWidth = brushSize;

        if (isDrawing){
           if (!isSprayMode && !isSplashMode && !isPencilMode  && !isEraserMode){
                ctx.putImageData(originalData, 0, 0);} 

           if (isSprayMode){
            for (let i = 0; i < 100; i++) {
                let x = currentX + (Math.random() - 0.5) *3* brushSize; 
                let y = currentY + (Math.random() - 0.5) *3*brushSize; 
                
                // Draw small circles or dots
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 2 * Math.PI);
                ctx.fill();
            }
           }

           else if (isSplashMode) {
            const splashSize = brushSize; 
            const density = 5;    
    
            for (let i = 0; i < density; i++) {
                let offsetX = Math.random() * splashSize * 2 - splashSize; // Random offset within splash size
                let offsetY = Math.random() * splashSize * 2 - splashSize; // Random offset within splash size
    
                let x = currentX + offsetX;
                let y = currentY + offsetY;
    
                // Create a random splash pattern (e.g., ellipse)
                ctx.beginPath();
                ctx.ellipse(x, y, Math.random() * 5, Math.random() * 10, Math.random() * Math.PI * 2, 0, Math.PI * 2);
                ctx.fill();
                }
            }   
           else if (isPencilMode){
            pencilmode();
           }
           else if (isPencil_noCompass){
            if (isEraserMode){
                ctx.strokeStyle = "#fff";
            }
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
           }
             else if (isRectangleMode) {
                ctx.strokeRect(start_drawingX, start_drawingY, currentX - start_drawingX,currentY-start_drawingY);
            } else if (isCircleMode) {
                drawCircle(ctx, start_drawingX, start_drawingY, currentX, currentY);
            } else if (isEllipseMode) { // Draw Ellipse
                ctx.beginPath();
                ctx.ellipse((start_drawingX + currentX) / 2, (start_drawingY + currentY) / 2, Math.abs(currentX - start_drawingX) / 2, Math.abs(currentY - start_drawingY) / 2, 0, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (isLineMode) {
                ctx.beginPath(); // Begins a new path
                ctx.moveTo(start_drawingX, start_drawingY); 
                ctx.lineTo(currentX, currentY); 
                ctx.stroke();
            } else if (isTriangleMode){ //Draw Triangle
                ctx.beginPath();
                ctx.moveTo(start_drawingX, start_drawingY); // Move to the first vertex of the triangle
                ctx.lineTo(currentX, currentY); // Draw a line to the second vertex based on mouse position
                ctx.lineTo(start_drawingX * 2 - start_drawingX, currentY); // Draw a line to the third vertex based on mouse position
                ctx.closePath();
                ctx.stroke();
            } else if (isIsoscelesTriangleMode) { // Draw Isosceles Triangle
                ctx.beginPath();
                ctx.moveTo(start_drawingX, start_drawingY); // Move to the first vertex of the triangle
                ctx.lineTo(currentX, currentY); // Draw a line to the second vertex based on mouse position
                ctx.lineTo(2 * start_drawingX - currentX, currentY); // Draw a line to the third vertex (mirrored around startX)
                ctx.closePath();
                ctx.stroke();
            }

        }
    }
}

function stopdraw() {
    p=0;
    if (isDrawing){
        isDrawing=false; 
            {undoLastAction();}
    }
    if (isPenMode || isZoomInMode|| isZoomOutMode||isDragMode) {undoLastAction();}
    clearTimeout(timeoutId);
    timeoutId = null;
     if (musicPlayer.src== ('song1.mp3')){
     musicPlayer.src= ('song2.mp3');
     playMusic();}
}


function click_happened(){
    movement_check=1; 
    if(!(isPenMode || isZoomInMode|| isZoomOutMode||isDragMode||isPencilMode)){
    saveCanvasState();
    drawRedDot(currentX, currentY);
    }
    
     if (isPenMode) { 
        undoLastAction();
        handleMouseDownPen();
        saveCanvasState();
        p=0;
     }
     else if (isZoomInMode) {
        if (scale<5){
        scale = scale * 2;
        threshold = threshold/2;}
        updateTransform(); 
    }
    else if (isZoomOutMode){
        scale = scale/2;
        if (threshold<user_threshold){
        threshold = threshold*2;}
        if (scale < 1) scale = 1;// Prevent scaling below the original size
            updateTransform();
        }
    else if (isDragMode){
          updateTransform();
        }
    else if (isDrawing){
        isDrawing=false;
         musicPlayer.src= ('song2.mp3');
        musicPlayer.play();
        undoLastAction(); //command to delete the circle/dot
    }
    else if (!isDrawing){
        isDrawing=true;
         musicPlayer.src= ('song1.mp3');
         musicPlayer.play();
        if (isPencilMode){
            t=0;
            saveCanvasState();
            drawBlackCircle(currentX,currentY,threshold);
        }
    }
}

function pencilmode() {
    distance = getDistance(start_drawingX, start_drawingY, currentX, currentY);
    if(t){undoLastAction();}// Command to delete the circle
    if (!t){t++; }

    if (distance >= threshold && distance <= threshold*2) {
        const speed = A * distance; // Speed is proportional to the distance
        interval = Math.max(1, 100 / speed); // Calculate interval based on speed

        // Calculate angle from current point to last mouse position
        const angle = Math.atan2(start_drawingY - currentY, start_drawingX - currentX);

        // Calculate endpoint at distance Z from currentX, currentY in the angle direction
        const endX = currentX + threshold * Math.cos(angle);
        const endY = currentY + threshold * Math.sin(angle);

        ctx.beginPath();
      
        ctx.moveTo(start_drawingX, start_drawingY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Update start_drawingX, start_drawingY to the endpoint of the drawn line
        [start_drawingX, start_drawingY] = [endX, endY];
    } 
  
    saveCanvasState();
    drawBlackCircle(start_drawingX,start_drawingY,threshold+2);
    //drawBlackCircle(start_drawingX,start_drawingY,3*threshold);
    drawNeedle();
    
  //  setTimeout(() => {
    //    pencilmode();
   // }, interval); // Way to control the velocity
}   

function handleMouseDownPen() {
    isDrawing= false;
    saveCanvasState();
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Get the image data of the canvas
    const data = imageData.data; // Get the pixel data of the canvas
    const color = hexToRgb(colorPicker.value);
    const mouseX = currentX;
    const mouseY = currentY;
    const rectWidth =800; // Adjust rectangle width 
    const rectHeight = 800; // Adjust rectangle height 
    
    
    let xStart = Math.max(0, mouseX - Math.floor(rectWidth / 2));
    let xEnd = Math.min(canvas.width, mouseX + Math.ceil(rectWidth / 2));
    let yStart = Math.max(0, mouseY - Math.floor(rectHeight / 2));
    let yEnd = Math.min(canvas.height, mouseY + Math.ceil(rectHeight / 2));
    let rows_up_zero = Math.max(0,Math.floor(rectHeight / 2) - mouseY);
    let columns_left_zero = Math.max(0,  Math.floor(rectWidth / 2) - mouseX );
    
    //console.log("mouseX:", mouseX);
    //console.log("mouseY:", mouseY);
    //console.log("currentX:", currentX);
    //console.log("currentY:", currentY);
    //console.log("xStart:", xStart);
    //console.log("yStart:", yStart);
    //console.log("xEnd:", xEnd);
    //console.log("yEnd:", yEnd);
    
    
    const grayscaleValues = Array.from({ length: rectHeight }, () => Array(rectWidth).fill(0));
    
    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            const pixelIndex = (y * canvas.width + x) * 4;
            const grayscale = 0.21 * data[pixelIndex] + 0.72 * data[pixelIndex + 1] + 0.07 * data[pixelIndex + 2];
            grayscaleValues[y - yStart + rows_up_zero][x - xStart + columns_left_zero] = grayscale; // Store grayscale value in the matrix
        }
    }
    
    floodFill(Math.floor(rectWidth / 2), Math.floor(rectHeight / 2), grayscaleValues, -1); // Pass relative coordinates (always middle of rectangle) and replacement color (-1)
    updateImagePixels(ctx, imageData, grayscaleValues, xStart, yStart, xEnd - xStart, yEnd - yStart, [color.r, color.g, color.b],rows_up_zero,columns_left_zero);
    
    }
    
function floodFill(x, y, image, replacementColor) {
        const targetColor = image[x][y];
    
        // If the target color is less than 4 or the same as the replacement color, return
        if (targetColor < 1 || targetColor === replacementColor) {
            return;
        }
    
        const stack = [[x, y]];
    
        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
    
            // Check if current position is out of bounds
            if (cx < 0 || cx >= image.length || cy < 0 || cy >= image[0].length) {
                continue;
            }
    
            // Check if the current pixel matches the target color
            if (image[cx][cy] === targetColor) {
                // Replace the color
                image[cx][cy] = replacementColor;
    
                // Add neighboring pixels to the stack
                stack.push([cx + 1, cy]); // Right
                stack.push([cx - 1, cy]); // Left
                stack.push([cx, cy + 1]); // Down
                stack.push([cx, cy - 1]); // Up
            }
        }
    }
    
function updateImagePixels(ctx, imageData, grayscaleValues, xStart, yStart, rectWidth, rectHeight, color,rows_up_zero,columns_left_zero) {
        const data = imageData.data;
        
    
        for (let y = yStart; y < yStart + rectHeight; y++) {
            for (let x = xStart; x < xStart + rectWidth; x++) {
                const grayscaleY = y - yStart+rows_up_zero;
                const grayscaleX = x - xStart+columns_left_zero;
                const pixelIndex = (y * imageData.width + x) * 4;
                if (grayscaleValues[grayscaleY][grayscaleX] === -1) {
                    data[pixelIndex] = color[0]; // Red channel
                    data[pixelIndex + 1] = color[1]; // Green channel
                    data[pixelIndex + 2] = color[2]; // Blue channel
                    //data[pixelIndex + 3] = 100;
                    //console.log(color[0],color[1],color[2],data[pixelIndex + 3])
                }
            }
        }
    
    // Update the canvas with the modified image data
    ctx.putImageData(imageData, 0, 0);
}
    
function drawRedDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI); // Draw a small circle (radius 3)
    ctx.fillStyle = 'red'; // Set the fill color to red
    ctx.fill(); // Fill the circle with the red color
}

function drawNeedle() {
    ctx.save();
    ctx.strokeStyle = 'lightblue';
    ctx.lineWidth = 2; // Set the line width for the needle

    // Calculate the angle of the needle
    const angle = Math.atan2(currentY - start_drawingY, currentX - start_drawingX);

    // Extend the needle line
    const extendedLength = threshold+20; // Length to extend the line
    const extendedX = currentX + extendedLength * Math.cos(angle);
    const extendedY = currentY + extendedLength * Math.sin(angle);

    // Draw the needle line
    ctx.beginPath();
    ctx.moveTo(start_drawingX, start_drawingY);
    ctx.lineTo(extendedX, extendedY);
    ctx.stroke();

    // Draw the red dot at the end of the line
    drawRedDot(currentX, currentY);

    // Draw the arrow head at the end of the extended line
    const arrowLength = 10; // Length of the arrow head
    const arrowAngle = Math.PI / 6; // Angle of the arrow head sides (30 degrees)

    const arrowX1 = extendedX - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = extendedY - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = extendedX - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = extendedY - arrowLength * Math.sin(angle + arrowAngle);

    ctx.beginPath();
    ctx.moveTo(extendedX, extendedY);
    ctx.lineTo(arrowX1, arrowY1);
    ctx.lineTo(arrowX2, arrowY2);
    ctx.lineTo(extendedX, extendedY);
    ctx.fillStyle = 'lightblue';
    ctx.fill();

    ctx.restore();
}

function drawCircle(ctx, startX, startY, endX, endY) {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    }
    
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // Ensure milliseconds have three digits
    return `${hours}:${minutes}:${seconds}.${milliseconds}`; // Return the time as a string without quotes
}
    
function updateTransform() {
    canvas.style.transformOrigin = `${startX}px ${startY}px`;
    canvas.style.transform = `scale(${scale})`;
} 

function restart_timeout(){
    clearTimeout(timeoutId);
    timeoutId = null;
    startX = currentX; //startX goes back to current X
    startY = currentY;
    movement_check=0;
}

function drawBlackCircle(X,Y,Radius){
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(X, Y, Radius, 0, 2 * Math.PI); // Draw circle around start_drawingX, start_drawingY with radius Z
    ctx.stroke();
}

function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}


function handleFileSelect(event) {
    saveCanvasState();
    originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.getElementById('imageCanvas');
                const ctx = canvas.getContext('2d');

                // Calculate the scaling factor for resizing the image
                const scaleFactor = Math.min(900 / img.width, 450 / img.height);

                // Calculate the new dimensions for the resized image
                const newWidth = img.width * scaleFactor;
                const newHeight = img.height * scaleFactor;

                // Clear the canvas to plain white
                canvas.width = 900;
                canvas.height = 450;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the resized image on the canvas
                ctx.drawImage(img, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight);

                // Store the original image data
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                originalImageData = adjustBrightness(originalImageData);
                ctx.putImageData(originalImageData, 0, 0);
            };
            img.src = event.target.result; // Set the source of the image to the result of FileReader
        };

        reader.readAsDataURL(file);
    } else {
        ctx.putImageData(originalData, 0, 0); 
    }
    p=0;
    scale=1;
    threshold=user_threshold;
    updateTransform()
}

function saveImage() {
    const canvas = document.getElementById('imageCanvas');
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  };

  function undoLastAction() {
    if (actionsStack.length > 0) {
      const lastImageData = actionsStack.pop();
      ctx.putImageData(lastImageData, 0, 0);
      console.log("Undo action. Stack size:", actionsStack.length);
    } else {
      console.log("No actions to undo");
    }
  }


function hexToRgb(hex) {
  const bigint = parseInt(hex.substring(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function hexToRgba(hex, alpha) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');
    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    // Return the RGBA string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function rgbToHex(rgb) {
    // Assuming rgb is in the format "rgb(r, g, b)"
    const [r, g, b] = rgb.match(/\d+/g);
    return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
}

function adjustBrightness(imageData) {
    for (let i = 0; i < imageData.data.length; i += 4) {
        const red = imageData.data[i];
        const green = imageData.data[i + 1];
        const blue = imageData.data[i + 2];
        // Calculate grayscale value using the luminosity method
        const grayscale = 0.21 * red + 0.72 * green + 0.07 * blue;
        // Set pixel value to 0 for grayscale value less than 128, and 255 otherwise
        imageData.data[i] = grayscale < 128 ? 0 : 255; // Red channel
        imageData.data[i + 1] = grayscale < 128 ? 0 : 255; // Green channel
        imageData.data[i + 2] = grayscale < 128 ? 0 : 255; // Blue channel
    }

    return imageData;
    }

function saveCanvasState() {
    actionsStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    console.log("Canvas state saved. Stack size:", actionsStack.length);
}

function switchToIsoscelesTriangle ()  { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=true; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToRectangle  () { isPencil_noCompass=false;  isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = true; isCircleMode = false; isTriangleMode = false; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToCircle ()  { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = true; isTriangleMode = false; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToTriangle  () { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = true; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToLine  () { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = true;  scaleTransform();toggleFigures();}
function switchToElipsa ()  { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= true; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false; scaleTransform();toggleFigures(); }
function switchToPen () {p=0;  isPencil_noCompass=false;isSprayMode = false; isSplashMode = false;  isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = true; isZoomInMode= false ;isZoomOutMode= false; isPencilMode= false; isEraserMode= false; isRectangleMode= false; isCircleMode= false; isTriangleMode= false; isLineMode= false; isDrawing= false; scaleTransform(); }
function switchToEraser() {t=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = true; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false; scaleTransform();}
function activateZoomInMode() {p=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false;  isIsoscelesTriangleMode=false;  isEllipseMode= false;  isDragMode = false; isZoomInMode = true; isZoomOutMode = false; isDrawing=false;  isPenMode = false; isPencilMode = false; isEraserMode = false;isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode =false;    scaleTransform();    }
function activateZoomOutMode() {p=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false;  isEllipseMode= false;  isDragMode = false; isZoomInMode = false; isZoomOutMode = true; isDrawing=false;  isPenMode = false; isPencilMode = false; isEraserMode = false;isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode =false;scaleTransform();}
function activateDragMode() {p=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false;  isDragMode = true; isZoomInMode = false; isZoomOutMode = false; isDrawing=false;  isPenMode = false; isPencilMode = false; isEraserMode = false;isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode =false;scaleTransform();}
function switchToSpray () {  isPencil_noCompass=false;  isSprayMode = true; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();   switchToPenciloptoins();}
function switchToSplash () { isPencil_noCompass=false;   isSprayMode = false; isSplashMode = true; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();  switchToPenciloptoins(); }
function switchToPencil () {t=0; isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = true; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();  switchToPenciloptoins();}
function switchToPencil_noCompass () {isPencil_noCompass=true; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();  switchToPenciloptoins();}

function Pause() { isDragMode = false; isPenMode = false;  isZoomInMode = false;isZoomOutMode = false; isPencilMode = false; isDrawing = false; }

function resetScaleTransform() {
    switchToEraserButton.style.transform = 'scale(1)';
    switchToPenButton.style.transform = 'scale(1)';
    switchToPencilButton.style.transform = 'scale(1)';
    zoomInButton.style.transform = 'scale(1)';
    zoomOutButton.style.transform = 'scale(1)';
    DragButton.style.transform = 'scale(1)';
    toggleFiguresButton.style.transform = 'scale(1)';
}

function scaleTransform() {
    resetScaleTransform(); // Reset all buttons before applying scale

    if (isEraserMode) {
        switchToEraserButton.style.transform = 'scale(1.1)';
    }
    if (isPenMode) {
        switchToPenButton.style.transform = 'scale(1.1)';
    }
    if (isPencilMode||isSprayMode||isSplashMode) {
        switchToPencilButton.style.transform = 'scale(1.1)';
    }
    if (isZoomInMode) {
        zoomInButton.style.transform = 'scale(1.1)';
    }
    if (isZoomOutMode) {
        zoomOutButton.style.transform = 'scale(1.1)';
    }
    if (isDragMode) {
        DragButton.style.transform = 'scale(1.1)';
    }
    if (isRectangleMode || isCircleMode || isTriangleMode || isLineMode || isIsoscelesTriangleMode || isEllipseMode) {
        toggleFiguresButton.style.transform = 'scale(1.1)';
    }
}

//function for dwell-click on buttons
function setupTimeoutHandler(button, clickFunction) {
    let timeoutId;

    button.addEventListener('mouseenter', function() {
        timeoutId = setTimeout(function() {
            clickFunction(); // Trigger the click function after delay
        }, timesetting); 
    });

    button.addEventListener('mouseleave', function() {
        clearTimeout(timeoutId); // Clear timeout on mouse leave
    });
}

//Selecting color functions
const matrix_color = [
    ["#eb5196", "#Fa9d00", "#CC00FF", "#006600", "#26867d", "#0F056B", "#8B4513", "#00000F"],
    ["#bd1a21", "#DFAF2C", "#FF00FF", "#009900", "#33b3a6", "#4000FF", "#8b6c5c", "#303030"],
    ["#FF0000", "#FFFF00", "#FF66FF", "#00CC00", "#3acabb", "#0000FF", "#D2B48C", "#D3D3D3"],
    ["#E26A13", "#fdfd96", "#FF99CC", "#00FF00", "#40e0d0", "#77B5FE", "#d8cbc4", "#FFFFFF"]
  ];

function selectColor(color='#000000') {
    p=0;
    isDrawing = false;
    document.getElementById("secondaryColorPalette").style.display = "block";
    document.body.classList.add('secondary-palette-visible'); // Add class to hide brush-size-container and settings
    populateSecondaryPalette(color);
}

function populateSecondaryPalette(primaryColor) {
    // Clear the existing secondary color palette
    const secondaryPalette = document.getElementById("secondaryColorPalette");
    secondaryPalette.innerHTML = "";

    // Create two columns
    for (let j = 0; j <= 7; j++) {
        let column = document.createElement("div");
        column.classList.add("color-column");
        
        // Add shades of the selected color to each column
        for (let i = 0; i <= 3; i++) {
            let shade = matrix_color[i][j]; // Adjust the shade
            addColorOption(shade, column);
        }
        
        // Append the column to the secondary color palette
        secondaryPalette.appendChild(column);
    }
}

function addColorOption(color, column) {
    let colorOption = document.createElement("div");
    colorOption.classList.add("color-option");
    colorOption.style.backgroundColor = color;

    function selectColor() {
        // Set the colorPicker value to the selected color
        colorPicker.value = color;
        document.getElementById("secondaryColorPalette").style.display = "none";
        document.body.classList.remove('secondary-palette-visible'); // Remove class to show brush-size-container and settings
        chosenColorButton.style.backgroundColor = color;
    }

    colorOption.onclick = selectColor;
    setupTimeoutHandler(colorOption, selectColor);

    column.appendChild(colorOption);
}

function select_immidiate_color(){
    p=0;
    isDrawing=false;
    const selectedColor = this.style.backgroundColor;
    colorPicker.value = rgbToHex(selectedColor);
    chosenColorButton.style.backgroundColor = selectedColor;
}

//Shape functions
function toggleFigures() {
    figuresContainer.style.display =  figuresContainer.style.display === 'none' ? 'block' : 'none';
    transparencyOptions.style.display = 'none';
    settingsscreen.style.display = 'none';
    brushSizeFrame.style.display ='none';
    pencilButtonsContainer.style.display ='none';
}




//BrushSize functions
function setBrushSize(size) {
    // Update the brush size
    brushSize = size;
    eraserSize = size;

    document.getElementById('brushSizeValue').textContent = brushSize; // Update the display of the brush size value
}

function toggleBrushSizeFrame() {
    brushSizeFrame.style.display = brushSizeFrame.style.display === 'none' ? 'block' : 'none';
    transparencyOptions.style.display = 'none';
    settingsscreen.style.display = 'none';
    figuresContainer.style.display ='none';
    pencilButtonsContainer.style.display ='none';
}


document.querySelectorAll('.brush-size-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        const size = parseInt(this.textContent);
        setBrushSize(size);
        toggleBrushSizeFrame(); // Close the frame after selecting a size
    });

    setupTimeoutHandler(button, function() {
        button.click(); // Trigger button click after delay
    });
});

// Transparency functoins

function toggleTransparencyOptions() {
    transparencyOptions.style.display = transparencyOptions.style.display === 'block' ? 'none' : 'block';
    brushSizeFrame.style.display = 'none';
    settingsscreen.style.display = 'none';
    figuresContainer.style.display ='none';
    pencilButtonsContainer.style.display ='none';
}

document.querySelectorAll('.transparency-options button').forEach(button => {
    button.addEventListener('click', function() {
        const alpha = parseFloat(button.dataset.alpha);
        penAlpha = alpha; // Update the pen alpha value
        toggleTransparencyOptions(); // Hide options after selection
    });
    setupTimeoutHandler(button, () => button.click());
});

// Settings functions


function toggleSetting() {
    settingsscreen.style.display = settingsscreen.style.display === 'none' ? 'block' : 'none';
    brushSizeFrame.style.display = 'none';
    transparencyOptions.style.display = 'none';
    figuresContainer.style.display ='none';
    pencilButtonsContainer.style.display ='none';
}

document.querySelectorAll('.timesetting-button').forEach(button => {
    button.addEventListener('click', function() {
        timesetting = parseInt(this.dataset.value); // Update timesetting with button's data-value
        toggleSetting(); // Close the settings panel after selecting the option
    });
    setupTimeoutHandler(button, () => button.click());
});

document.querySelectorAll('.thresholdsetting-button').forEach(button => {
    button.addEventListener('click', function() {
        user_threshold = parseInt(this.dataset.value); // Update threshold with button's data-value
        threshold = user_threshold;
        toggleSetting(); // Close the settings panel after selecting the option
    });
    setupTimeoutHandler(button, () => button.click());
});;

function createPictureButtons(level, palette, start, end) {
    toggleSetting();
    palette.style.display = 'block';
    palette.innerHTML = '';

    for (let i = start; i <= end; i++) {
        const button = document.createElement('button');
        button.classList.add('picture-button');
        button.dataset.pictureNumber = i;

        const buttonText = document.createTextNode(`Picture ${i}`);
        button.appendChild(buttonText);

        const imgSrc = `picture${i}.jpg`;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.classList.add('button-image');
        button.appendChild(img);
        

                    
            button.addEventListener('click', function() {
                level1Palette.style.display='none';
                level2Palette.style.display='none';
                level3Palette.style.display='none';
                const scaleFactor = Math.min(900 / img.width, 450 / img.height);

                // Calculate the new dimensions for the resized image
                const newWidth = img.width * scaleFactor;
                const newHeight = img.height * scaleFactor;

                // Clear the canvas to plain white
                canvas.width = 900;
                canvas.height = 450;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the resized image on the canvas
                //img=adjustBrightness(img);
                ctx.drawImage(img, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight);

                // Store the original image data
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                originalImageData = adjustBrightness(originalImageData);
                ctx.putImageData(originalImageData, 0, 0);
            });
            setupTimeoutHandler(button, () => button.click());
        palette.appendChild(button);
    }
}

function switchToPenciloptoins(){
    pencilButtonsContainer.style.display = pencilButtonsContainer.style.display === 'none' ? 'block' : 'none';
    brushSizeFrame.style.display = 'none';
    transparencyOptions.style.display = 'none';
    figuresContainer.style.display ='none';
    settingsscreen.style.display ='none';
}

function matrixToCSV(matrix) {
    // Add headers
    const headers = 'Time,X Position,Y Position';
    const rows = matrix.join('\n'); // Join each row string with newline characters
    return `${headers}\n${rows}`;
}

function downloadCSV(filename, text) {
    const blob = new Blob([text], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url); // Clean up
    document.body.removeChild(a);
}

function MatrixDownload () {
    const csvString = matrixToCSV(matrix_mousePosition);
    downloadCSV('matrix_export.csv', csvString);
    toggleSetting(); // Close settings panel after clicking play
};



//music
document.addEventListener('DOMContentLoaded', function() {
  const musicPlayer = document.getElementById('musicPlayer');

  document.querySelectorAll('.songButton').forEach(button => {
    button.addEventListener('click', function() {
      musicPlayer.src = this.getAttribute('data-src');
    });
  });

  document.getElementById('playButton').addEventListener('click', function() {
    playMusic();
  });

  document.getElementById('pauseButton').addEventListener('click', function() {
    pauseMusic();
  });

  document.getElementById('stopButton').addEventListener('click', function() {
    stopMusic();
  });

  function playMusic() {
    musicPlayer.play();
  }

  function pauseMusic() {
    musicPlayer.pause();
  }

  function stopMusic() {
    musicPlayer.pause();
    musicPlayer.currentTime = 0;
  }
});




// newPage functions
function newPage(){
    const canvasContainer = document.getElementById('canvas-container');
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    // Fill the canvas with white color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    p=0;
    scale=1;
    threshold=user_threshold;
    updateTransform();
}

function resetImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.putImageData(originalImageData, 0, 0); // Restore original image
    p=0;
    scale=1;
    threshold=user_threshold;
    updateTransform();
  }

function showConfirmation(action) {
    currentAction = action;
    confirmationDialog.style.display = 'block';
  }

function confirmYes(){
    if (currentAction=='resetImage'){
    resetImage();}
    if (currentAction=='newPage'){
        newPage();}
    confirmationDialog.style.display = 'none';
  }

  function confirmNo(){
    confirmationDialog.style.display = 'none';
  }

//initialization function

document.addEventListener('DOMContentLoaded', function() {

    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    // Fill the canvas with white color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);


    figuresContainer.style.display = 'none';
    brushSizeFrame.style.display = 'none';
    transparencyOptions.style.display= 'none';
    settingsscreen.style.display= 'none';
    colorPicker.value = "#00000F";

    resetImageButton.addEventListener('click', function() {showConfirmation('resetImage');});
    newPageButton.addEventListener('click', function() {showConfirmation('newPage');});
    level1Button.addEventListener('click', function() {createPictureButtons('level1', level1Palette, 1, 10);});
    level2Button.addEventListener('click', function() {createPictureButtons('level2', level1Palette, 11, 20);});
    level3Button.addEventListener('click', function() {createPictureButtons('level3', level1Palette, 21, 30);});
    fileInputButton.addEventListener('change', handleFileSelect);
    undoButton.addEventListener('click', undoLastAction);
    saveButton.addEventListener('click', saveImage);
    PauseButton.addEventListener("click", Pause);
    zoomInButton.addEventListener("click", activateZoomInMode);
    zoomOutButton.addEventListener("click", activateZoomOutMode);
    DragButton.addEventListener("click", activateDragMode);
    switchToPenButton.addEventListener('click',function() {switchToPen();});
    switchToEraserButton.addEventListener("click", switchToEraser);
    switchToPencilButton.addEventListener("click", switchToPenciloptoins);
    switchToPencil1Button.addEventListener("click", switchToPencil_noCompass);
    switchToPencil2Button.addEventListener('click', switchToPencil);
    switchToSprayButton.addEventListener('click', switchToSpray);
    switchToSplashButton.addEventListener('click', switchToSplash);

    
    
    toggleFiguresButton.addEventListener("click", toggleFigures);
    rectangleButton.addEventListener('click', switchToRectangle);
    lineButton.addEventListener('click', switchToLine);
    circleButton.addEventListener('click', switchToCircle);
    triangleButton.addEventListener('click', switchToTriangle);
    elipsaButton.addEventListener('click', switchToElipsa);
    IsoscelesTriangleButton.addEventListener('click', switchToIsoscelesTriangle);
    selectColorButton.addEventListener('click', selectColor);
    toggleBrushSizeButton.addEventListener('click',toggleBrushSizeFrame);
    PenTransparencyButton.addEventListener('click',toggleTransparencyOptions);
    settingsbutton.addEventListener('click',toggleSetting);
    
    MatrixButton.addEventListener('click',MatrixDownload);
    redColorButton.addEventListener('click', select_immidiate_color);
    greenColorButton.addEventListener('click', select_immidiate_color);
    blueColorButton.addEventListener('click', select_immidiate_color);
    yellowColorButton.addEventListener('click', select_immidiate_color);
    cyanColorButton.addEventListener('click', select_immidiate_color);
    magentaColorButton.addEventListener('click', select_immidiate_color);
    confirmYesButton.addEventListener('click', confirmYes);
    confirmNoButton.addEventListener('click', confirmNo);


    
    [undoButton, saveButton, resetImageButton,newPageButton,PauseButton,zoomInButton,zoomOutButton,DragButton
        ,switchToPenButton,switchToEraserButton,switchToPencilButton ,toggleFiguresButton,level1Button,level2Button,level3Button,
        rectangleButton,lineButton ,circleButton,elipsaButton,triangleButton,IsoscelesTriangleButton,
        selectColorButton,redColorButton,greenColorButton,cyanColorButton,magentaColorButton,yellowColorButton,blueColorButton,toggleBrushSizeButton,PenTransparencyButton,settingsbutton, playButton,pauseButton,stopButton,MatrixButton
        ,confirmYesButton,confirmNoButton,switchToPencil1Button,switchToPencil2Button,switchToSprayButton,switchToSplashButton
    ].forEach(button => {
        let timeoutId;

        button.addEventListener('mouseenter', function() {
            timeoutId = setTimeout(function() {
                button.click(); // Trigger button click after delay
            }, timesetting); 
        });

        button.addEventListener('mouseleave', function() {
            clearTimeout(timeoutId); // Clear timeout on mouse leave
        });
    });
});



//change the background
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('backgroundColor').addEventListener('click', function() {
      const colorButtons = document.getElementById('backgroundColorButtons');
      if (colorButtons.style.display === 'none' || colorButtons.style.display === '') {
        colorButtons.style.display = 'flex';
      } else {
        colorButtons.style.display = 'none';
      }
    });
  
    var colorButtons = document.querySelectorAll('.colorButton');
    
    colorButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var color = this.getAttribute('data-color');
        document.body.style.backgroundImage = 'none'; // Remove background image
        document.body.style.backgroundColor = color; // Set background color
      });
    });
  });
