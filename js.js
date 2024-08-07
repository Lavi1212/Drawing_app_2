//Initialize
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
const zoomInButton = document.querySelector('.button-container2 > div > #ZoomIn');
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
const helpScreen = document.getElementById('helpScreen');
const figuresContainer = document.getElementById("figures-container");
const rectangleButton = document.getElementById('rectangleButton');
const lineButton = document.getElementById('lineButton');
const circleButton = document.getElementById('circleButton');
const triangleButton = document.getElementById('triangleButton');
const elipsaButton = document.getElementById('elipsaButton');
const IsoscelesTriangleButton = document.getElementById('IsoscelesTriangle');
const selectColorButton = document.getElementById('selectColor');
const selectColorButton2 = document.getElementById('selectColor2');
const toggleBrushSizeButton = document.getElementById('toggleBrushSizeButtons');
const PenTransparencyButton = document.getElementById('toggleTransparencyOptions');
const settingsbutton=document.getElementById('settingsbutton');
const MatrixButton = document.getElementById('downloadBtn');
const functionStopButton = document.getElementById('functionsStopButton');
const redColorButton = document.getElementById('redColor');
const greenColorButton = document.getElementById('greenColor');
const blueColorButton = document.getElementById('blueColor');
const yellowColorButton = document.getElementById('yellowColor');
const cyanColorButton = document.getElementById('cyanColor');
const magentaColorButton = document.getElementById('magentaColor');
const confirmYesButton = document.getElementById('confirmYes');
const confirmNoButton = document.getElementById('confirmNo');
const NoColorButton = document.getElementById('Black and White');
const YesColorButton = document.getElementById('Color');
const level1Button = document.getElementById('level1');
const level2Button = document.getElementById('level2');
const level3Button = document.getElementById('level3');
const level1Palette = document.getElementById('level1Palette');
const level2Palette = document.getElementById('level2Palette');
const level3Palette = document.getElementById('level3Palette');
const musicPlayer = document.getElementById('musicPlayer');
const play_Button = document.getElementById('playButton');
const stop_Button = document.getElementById('stopButton');
const help_Button = document.getElementById('help');
const close_help_Button = document.getElementById('closeHelp');
const closeButton = document.getElementById('close');
const gridButton = document.getElementById('toggleGridButton');
const immidiateModeButton = document.getElementById('immediateMode');



//Initialize modes
let  isSplashMode=false, isPencilMode = false, isPencil_noCompass=false, isEraserMode = false,isZoomOutMode = false,isZoomInMode = false,
     isDragMode=false, isPenMode = false,isSprayMode=false, isDrawing = false, isRectangleMode = false,
     isCircleMode = false, isIsoscelesTriangleMode=false, isTriangleMode = false, isLineMode = false, isEllipseMode=false; 

//Initialize different flags
let flag=0, t=0, num1=0, movement_check=0, first_grid=0,first_help=0,p=0,new_round=0;

//Initialize random variables
let clientXWithinThreshold, clientYWithinThreshold ,data1X, data1Y,data,currentAction = null,
    timeoutId = null, originalData, originalImageData,Chosen_img, Chosen_newHeight,Chosen_newWidth;

//Initialize default settings
let brushSize = 1, penAlpha = 1,eraserSize = brushSize , scale = 1, distance=1000,
    NoMusic=1 ,immidiate_mode=0,functionStop=0,timesetting = 2000,threshold = 40,user_threshold=40;

// start_drawingX: The place where the mouse click happened or dwell-click finished.
// startX: The place where the dwell-click started.
// currentX: The place the mouse is in the call to every event function.
// endX/Y: Only for compass use. The place with Z distance from currentX/Y, inside the compass.
let startX, startY,start_drawingX, start_drawingY ,currentX=0 ,currentY=0;

let actionsStack = [],canvasStateStack=[],matrix_mousePosition = [],mouse_movement=[];




let numberOfRows = 20000,row=0,numberOfRows_original=20000; //number of matrix_mousePosition rows

for (let i = 0; i < numberOfRows; i++) {//initalizing matrix_mousePosition
    matrix_mousePosition[i] = [];
    mouse_movement[i]=[];
    for (let j = 0; j < 3; j++) {
        matrix_mousePosition[i][j] = [];
        mouse_movement[i][j]=[];
    }
}


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", Drawing);
canvas.addEventListener("mouseleave", stopdraw);


function startDraw(event) {//Function to start draw when mouse-clicked. on dwell click there is no pass here.
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


function Drawing(event) {//main function of this code.

    const color = colorPicker.value;
    const rgbaColor = hexToRgba(color, penAlpha);
    currentX = event.offsetX;
    currentY = event.offsetY;

    if (row < numberOfRows) {//get the mouse Position for the  matrix_mousePosition data
        time=getCurrentTime();
        matrix_mousePosition[row] = `${time},${currentX},${currentY}`;
        row++;
    }
    else{//if there is no more place, make space for more rows.
    make_rows();
    Drawing(event);
}

    
   if (!(immidiate_mode&&(isPencilMode||isSprayMode||isSplashMode||isPencil_noCompass||isEraserMode))){//make sure we are not in a case when no need for dwell-click 

        if (isPenMode || isZoomInMode|| isZoomOutMode||isDragMode){// Drawing black circle for help 
            DeleteMarkings();
            p++;
            saveCanvasState(1);
            drawBlackCircle(currentX,currentY,threshold);
        }

        distance = getDistance(startX, startY, currentX, currentY);//dwell click calculations
        if (isPencilMode && isDrawing){//for pencil mode the center of the circle is start_drawingX,  start_drawingY
                distance = getDistance(start_drawingX, start_drawingY, currentX, currentY);
            }

        if (distance <= threshold) {
            if (!timeoutId){//Starting the timecount
                startX = currentX;
                startY = currentY;
                timeoutId = setTimeout(() => {
                    click_happened();
                    }, timesetting); }
                    }
        else{   //distance > threshold
            restart_timeout();
        }
    
        if (movement_check==1){// Click has been made

            restart_timeout();
            if (isDrawing){
                DeleteMarkings();
                saveCanvasState(3);// Save the current canvas state before drawing
                ctx.beginPath(); // creating new path to draw
                originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                start_drawingX = event.offsetX;
                start_drawingY = event.offsetY;   
            }
        }
    }
    else{// immidiate_mode && (isPencilMode||isSprayMode||isSplashMode||isPencil_noCompass||isEraserMode)
        movement_check=0;
        isDrawing=1;
        originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (num1==0){//first time to start this current draw
            ctx.beginPath();
            {musicPlayer.pause();
            musicPlayer.src= ('songs/song1.mp3');
            musicPlayer.play();}
            num1++;
         } 
    }
    
    if (movement_check==0){
        ctx.strokeStyle = rgbaColor;
        ctx.fillStyle = rgbaColor; 
        ctx.lineWidth = brushSize;

        if (isDrawing){
           if (!isSprayMode && !isSplashMode && !isPencilMode ){
                ctx.putImageData(originalData, 0, 0);} //this is for the shapes to not duplicate themselves.

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
            
            else if (isPencilMode && immidiate_mode==0){
                if (row%3==1){
                data1X = currentX;//data1X saves the median of three consecutive gaze points.
                data1Y = currentY;
                }
                if (row%3 == 2 &&  data1X != 0 ){ //we Make sure in the start we go in the order: row%3==1,row%3 == 2,row%3 == 0. data1X will be zero unless we start from row%3 == 1
                data1X = currentX+data1X;
                data1Y = currentY+data1Y;
                }
                if (row%3 == 0  &&  data1X != 0 ){
                    data1X=(currentX+data1X)/3;
                    data1Y=(currentY+data1Y)/3;
                    mouse_movement[row/3][1]=data1Y;
                    mouse_movement[row/3][0]=data1X;
                    if(new_round>1){// use another median, only if there allready two drawing points in this drawing
                    pencilmode((mouse_movement[row/3][0]+mouse_movement[(row/3)-1][0]+mouse_movement[(row/3)-2][0])/3,(mouse_movement[row/3][1]+mouse_movement[(row/3)-1][1]+mouse_movement[(row/3)-2][1])/3);
                    }
                    else{ pencilmode(data1X,data1Y);}

                    data1X=0;
                    data1Y=0;
                    new_round++;
                }
            }

            else if (isPencil_noCompass || isEraserMode||(isPencilMode&& immidiate_mode)){
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
    if (isDrawing){
        isDrawing=false; 
    }
    DeleteMarkings();
    musicPlayer.pause();
    clearTimeout(timeoutId);
    timeoutId = null;
    num1=0;
    p=0;
}

function click_happened(){
    movement_check=1; 
    data1X=0;
    data1Y=0;
    new_round=0;
    
    musicPlayer.pause();
   if(!(isPencilMode||isPencil_noCompass||isSprayMode||isSplashMode)){
        musicPlayer.src= ('songs/song3.mp3');
        if (!NoMusic)
            {musicPlayer.play();}
    }

    if(!(isPenMode || isZoomInMode|| isZoomOutMode||isDragMode||isPencilMode)){
        saveCanvasState(2);
        drawRedDot(currentX, currentY);
    }
    
    if (isPenMode) { 
        DeleteMarkings();
        saveCanvasState(3);
        handleMouseDownPen();
        p=0;
     }
    else if (isZoomInMode) {
        if (scale<5){
            scale = scale * 2;
            threshold = threshold/2;
        }
        updateTransform(); 
    }
    else if (isZoomOutMode){
        scale = scale/2;
        if (threshold<user_threshold)// Prevent threshold over the original threshold
            {threshold = threshold*2;}
        if (scale < 1) 
            {scale = 1;}// Prevent scaling below the original size
        updateTransform();
        }
    else if (isDragMode){
          updateTransform();
        }
    else if (isDrawing){
        isDrawing=false;
        DeleteMarkings(); //command to delete the circle/dot
    }
    else if (!isDrawing){//need to start draw now
        isDrawing=true;
        if (!NoMusic && ( isPencil_noCompass|| isSprayMode|| isSplashMode|| isIsoscelesTriangleMode|| isEllipseMode || isPenMode ||isPencilMode || isEraserMode || isRectangleMode || isCircleMode ||isTriangleMode ||isLineMode))
            {musicPlayer.pause();
            musicPlayer.src= ('songs/song1.mp3');
            musicPlayer.play();}
        if (isPencilMode){
            start_drawingX=currentX;
            start_drawingY=currentY;
            t=0;
            saveCanvasState(1);
            drawBlackCircle(currentX,currentY,threshold);
        }
    }
}

function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function restart_timeout(){
    clearTimeout(timeoutId);
    timeoutId = null;
    startX = currentX; //startX goes back to current X
    startY = currentY;
    movement_check=0;
}

function DeleteMarkings(){
    if (canvasStateStack.length>0){
        while (actionsStack[actionsStack.length - 1]<3){//delete only markings of type 1 and 2
            undoLastAction();
        }
    }
}

function pencilmode(mediumX , mediumY) {//The drawing function for compass mode
    distance = getDistance(start_drawingX, start_drawingY, mediumX, mediumY);
    DeleteMarkings();

    if (distance >= threshold && distance <= threshold*5) {

        const angle = Math.atan2(start_drawingY - mediumY, start_drawingX - mediumX);// Calculate angle from current point to last mouse position
        const endX = mediumX + threshold * Math.cos(angle);// Calculate endpoint at distance Z from currentX, currentY in the angle direction
        const endY = mediumY + threshold * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(start_drawingX, start_drawingY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        [start_drawingX, start_drawingY] = [endX, endY];// Update start_drawingX, start_drawingY to the endpoint of the drawn line
    } 
  
    saveCanvasState(1);
    drawBlackCircle(start_drawingX,start_drawingY,threshold+2);
    //drawNeedleArray();
    drawNeedle();
}   

function handleMouseDownPen() {//Function to fill the color in pen mode.
    isDrawing= false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data; // Get the pixel data of the canvas
    const color = hexToRgb(colorPicker.value);
    const mouseX = currentX;
    const mouseY = currentY;
    const rectWidth =1800; 
    const rectHeight = 1800; 
    
    
    let xStart = Math.max(0, mouseX - Math.floor(rectWidth / 2));
    let xEnd = Math.min(canvas.width, mouseX + Math.ceil(rectWidth / 2));
    let yStart = Math.max(0, mouseY - Math.floor(rectHeight / 2));
    let yEnd = Math.min(canvas.height, mouseY + Math.ceil(rectHeight / 2));
    let rows_up_zero = Math.max(0,Math.floor(rectHeight / 2) - mouseY);
    let columns_left_zero = Math.max(0,  Math.floor(rectWidth / 2) - mouseX );
    

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
    
function updateImagePixels(ctx, imageData, grayscaleValues, xStart, yStart, rectWidth, rectHeight, color,rows_up_zero,columns_left_zero) {//For the handleMouseDownPen function only
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
                }
            }
        }
    
    ctx.putImageData(imageData, 0, 0);
}

/*

function drawNeedleArray() {
    ctx.strokeStyle = 'lightblue';
    ctx.lineWidth = 3; // Set the line width for the needle
    const numNeedles=7;
    const distanceBetweenNeedles=threshold/3.5;
    const angle = Math.atan2(currentY - start_drawingY, currentX - start_drawingX);//Fliped the angle calculation but not too bad
    let needleY,needleX;

    // Loop to draw multiple needles
    for (let i = 0; i < numNeedles; i++) {
        // Calculate the position of each needle
        if (i%2 ==0){
        needleY = start_drawingY - (i/2) * distanceBetweenNeedles* Math.cos(angle);
        needleX = start_drawingX + (i/2) * distanceBetweenNeedles* Math.sin(angle);
        }
        else{
        needleY = start_drawingY + ((i/2)+0.5) * distanceBetweenNeedles* Math.cos(angle);
        needleX = start_drawingX - ((i/2)+0.5) * distanceBetweenNeedles* Math.sin(angle);
        }
        // Extend the needle line
        const extendedLength = threshold + 20; // Length to extend the line
        const extendedX = needleX + extendedLength * Math.cos(angle);
        const extendedY = needleY + extendedLength * Math.sin(angle);

        // Draw the needle line
        ctx.beginPath();
        ctx.moveTo(needleX, needleY);
        ctx.lineTo(extendedX, extendedY);
        ctx.stroke();

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

        // Draw the red dot at the end of the line
        if (i==0){
            drawRedDot(currentX, currentY);}
    }

}
*/

function drawRedDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI); // Draw a small circle (radius 3)
    ctx.fillStyle = 'red'; // Set the fill color to red
    ctx.fill(); // Fill the circle with the red color
}

function drawNeedle() {//needle for the compass mode
 
    ctx.strokeStyle = 'lightblue';
    ctx.lineWidth = 3; 

    // Calculate the angle of the needle
    const angle = Math.atan2(currentY - start_drawingY, currentX - start_drawingX);

    // Extend the needle line
    const extendedLength = threshold+20; // Length to extend the line
    const extendedX = start_drawingX + extendedLength * Math.cos(angle);
    const extendedY = start_drawingY + extendedLength * Math.sin(angle);

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

   
}

function drawCircle(ctx, startX, startY, endX, endY) {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    }
    
function getCurrentTime() {//function for matrix_mouseposition
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // Ensure milliseconds have three digits
    return `${hours}:${minutes}:${seconds}.${milliseconds}`; // Return the time as a string without quotes
}
    
function updateTransform()//function for zoom in and out
 {
    canvas.style.transformOrigin = `${startX}px ${startY}px`;
    canvas.style.transform = `scale(${scale})`;
} 

function drawBlackCircle(X,Y,Radius){
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(X, Y, Radius, 0, 2 * Math.PI); // Draw circle around start_drawingX, start_drawingY with radius Z
    ctx.stroke();
}


//End of drawing functions

//general functions
function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }
  
function hexToRgba(hex, alpha) {//with transparency (alpha)
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
 
function make_rows(){
    for (let i = 0; i < numberOfRows; i++) {
        matrix_mousePosition[row+i] = [];
        mouse_movement[row+i]=[];
        for (let j = 0; j < 3; j++) {
            matrix_mousePosition[row+i][j] = [];
            mouse_movement[row+i][j]=[];
        }
    }
    numberOfRows+=numberOfRows_original;
}
function toggleAllFigures() {
    figuresContainer.style.display =  'none';
    transparencyOptions.style.display = 'none';
    settingsscreen.style.display = 'none';
    brushSizeFrame.style.display ='none';
    pencilButtonsContainer.style.display ='none';
}

//functions for file selects
function handleFileSelect(event) {
    saveCanvasState();
    originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            Chosen_img = new Image();
            Chosen_img.onload = function() {
                const canvas = document.getElementById('imageCanvas');
                const ctx = canvas.getContext('2d');

                // Calculate the scaling factor for resizing the image
                const scaleFactor = Math.min(900 / Chosen_img.width, 450 / Chosen_img.height);

                // Calculate the new dimensions for the resized image
                Chosen_newWidth = Chosen_img.width * scaleFactor;
                 Chosen_newHeight = Chosen_img.height * scaleFactor;

                // Clear the canvas to plain white
                canvas.width = 900;
                canvas.height = 450;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            };
            Chosen_img.src = event.target.result; // Set the source of the image to the result of FileReader
        };

        reader.readAsDataURL(file);
    } else {
        ctx.putImageData(originalData, 0, 0); 
    }
    p=0;
    scale=1;
    threshold=user_threshold;
    updateTransform();
    toggleAllFigures();
    showBlackAndWhite();
}

function showBlackAndWhite() {//function to display dialog before uploading image
    BlackAndWhiteDialog.style.display = 'block';
  }

function NoColor(){
    ctx.drawImage(Chosen_img, (canvas.width - Chosen_newWidth) / 2, (canvas.height - Chosen_newHeight) / 2, Chosen_newWidth, Chosen_newHeight);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    originalImageData = adjustBrightness(originalImageData);
    ctx.putImageData(originalImageData, 0, 0);
    BlackAndWhiteDialog.style.display = 'none';
}

function YesColor(){
     ctx.drawImage(Chosen_img, (canvas.width - Chosen_newWidth) / 2, (canvas.height - Chosen_newHeight) / 2, Chosen_newWidth, Chosen_newHeight);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(originalImageData, 0, 0);
    BlackAndWhiteDialog.style.display = 'none';
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

//function to Save and download image 
function saveImage() {
    const canvas = document.getElementById('imageCanvas');
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  };
 
//undo last action functions
function undoLastAction() {
    if (canvasStateStack.length > 0) {
      const lastImageData = canvasStateStack.pop();
      const last_action = actionsStack.pop();
      ctx.putImageData(lastImageData, 0, 0);
      //console.log("Undo action. last action:",last_action);
    } else {
      //console.log("No actions to undo");
    }
  }

function saveCanvasState(actionType) {//Three types of drawing: 1-BlackCircle. 2-redDot. 3-regularDrawing
    canvasStateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    actionsStack.push(actionType);
}

//zoom-in and out functions
function resetScaleTransform() {
    switchToEraserButton.style.transform = '';
    switchToPenButton.style.transform = '';
    switchToPencilButton.style.transform = '';
    zoomInButton.style.transform = '';
    zoomOutButton.style.transform = '';
    DragButton.style.transform = '';
    toggleFiguresButton.style.transform = '';
    PauseButton.style.transform = '';
    switchToEraserButton.style.border = ''; // Clear background color
    switchToPenButton.style.border = '';
    switchToPencilButton.style.border = '';
    zoomInButton.style.border = '';
    zoomOutButton.style.border = '';
    DragButton.style.border = '';
    toggleFiguresButton.style.border = '';
    PauseButton.style.border = '';
 
}

function scaleTransform() {
    resetScaleTransform(); // Reset all buttons before applying scale

    if (isEraserMode) {
        switchToEraserButton.style.transform = 'scale(1.1)';
        switchToEraserButton.style.border = '5px solid red';
    }
    else if (isPenMode) {
        switchToPenButton.style.transform = 'scale(1.1)';
        switchToPenButton.style.border = '5px solid red';
    }
    else if (isPencilMode||isSprayMode||isSplashMode||isPencil_noCompass) {
        switchToPencilButton.style.transform = 'scale(1.1)';
        switchToPencilButton.style.border = '5px solid red';
    }
    else if (isZoomInMode) {
        zoomInButton.style.transform = 'scale(1.1)';
        zoomInButton.style.border = '5px solid red';
    }
    else if (isZoomOutMode) {
        zoomOutButton.style.transform = 'scale(1.1)';
        zoomOutButton.style.border = '5px solid red';
    }
    else if (isDragMode) {
        DragButton.style.transform = 'scale(1.1)';
        DragButton.style.border = '5px solid red';
    }
    else if (isRectangleMode || isCircleMode || isTriangleMode || isLineMode || isIsoscelesTriangleMode || isEllipseMode) {
        toggleFiguresButton.style.transform = 'scale(1.1)';
        toggleFiguresButton.style.border = '5px solid red';
    }
    else  {
        PauseButton.style.transform = 'scale(1.1)';
        PauseButton.style.border = '5px solid red';
    }
   

}


//function for dwell-click on buttons
function setupTimeoutHandler(button, clickFunction) {
    let timeoutId;

    button.addEventListener('mouseenter', function() {
        timeoutId = setTimeout(function() {
            musicPlayer.src= ('songs/song4.mp3');
            if (!NoMusic)
                {musicPlayer.play();}
            clickFunction(); // Trigger the click function after delay
        }, timesetting); 
    });

    button.addEventListener('mouseleave', function() {
        clearTimeout(timeoutId); // Clear timeout on mouse leave
    });
}

//Selecting color functions
const matrix_color = [
    ['#FF0000', '#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#CCCCCC','#FFFFFF'],
    ['#FF3300', '#FF4000', '#FF6600', '#FF8000', '#FF9900', '#FFBF00', '#FFCC00', '#FFFF0F'],
    ['#CC0000', '#990000', '#660000', '#666666', '#999999', '#330000', '#333333','#00000F'],
    ['#FFFF00', '#CCFF00', '#BFFF00', '#99FF00', '#80FF00', '#66FF00', '#40FF00', '#33FF00']
  ];
  const matrix_color2 =  [
    ['#00FF00', '#00FF00', '#00FF33', '#00FF40', '#00FF66', '#00FF80', '#00FF99', '#00FFBF'],
    ['#00FFCC', '#00FFFF', '#00FFFF', '#00CCFF', '#00BFFF', '#0099FF', '#0080FF', '#0066FF'],
    ['#0040FF', '#0033FF', '#0000FF', '#0000FF', '#3300FF', '#4000FF', '#6600FF', '#8000FF'],
    ['#9900FF', '#BF00FF', '#CC00FF', '#FF00FF', '#FF00FF', '#FF00BF', '#FF0080', '#FF0040']
  ];
function selectColor(color='#000000') {
    p=0;
    isDrawing = false;
    document.getElementById("secondaryColorPalette").style.display = "block";
    document.body.classList.add('secondary-palette-visible'); // Add class to hide brush-size-container and settings
    populateSecondaryPalette(color);
}
function selectColor2(color='#000000') {
    p=0;
    isDrawing = false;
    document.getElementById("thirdColorPalette").style.display = "block";
    document.body.classList.add('secondary-palette-visible'); // Add class to hide brush-size-container and settings
    populatethirdPalette(color);
}
function populatethirdPalette(primaryColor) {
    // Clear the existing secondary color palette
    const secondaryPalette = document.getElementById("thirdColorPalette");
    secondaryPalette.innerHTML = "";


    for (let j = 0; j <= 7; j++) {
        let column = document.createElement("div");
        column.classList.add("color-column");
        
        for (let i = 0; i <= 3; i++) {
            let shade = matrix_color2[i][j]; 
            addColorOption(shade, column);
        }
        // Append the column to the secondary color palette
        secondaryPalette.appendChild(column);
    }
}

function populateSecondaryPalette(primaryColor) {
    // Clear the existing secondary color palette
    const secondaryPalette = document.getElementById("secondaryColorPalette");
    secondaryPalette.innerHTML = "";


    for (let j = 0; j <= 7; j++) {
        let column = document.createElement("div");
        column.classList.add("color-column");
        
        for (let i = 0; i <= 3; i++) {
            let shade = matrix_color[i][j]; 
            addColorOption(shade, column);
        }
        // Append the column to the secondary color palette
        secondaryPalette.appendChild(column);
    }
}

function addColorOption(color, column) {
    musicPlayer.src= ('songs/song2.mp3');
    if (!NoMusic)
        {musicPlayer.play();}
    let colorOption = document.createElement("div");
    colorOption.classList.add("color-option");
    colorOption.style.backgroundColor = color;

    function selectColor() {
        // Set the colorPicker value to the selected color
        colorPicker.value = color;
        document.getElementById("secondaryColorPalette").style.display = "none";
        document.getElementById("thirdColorPalette").style.display = "none";
        document.body.classList.remove('secondary-palette-visible'); // Remove class to show brush-size-container and settings
        chosenColorButton.style.backgroundColor = color;
        musicPlayer.pause();
        musicPlayer.src= ('songs/song3.mp3');
        if (!NoMusic)
            {musicPlayer.play();}
        
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

//Shape options toggle
function toggleFigures() {
    figuresContainer.style.display =  figuresContainer.style.display === 'none' ? 'block' : 'none';
    transparencyOptions.style.display = 'none';
    settingsscreen.style.display = 'none';
    brushSizeFrame.style.display ='none';
    pencilButtonsContainer.style.display ='none';
}

//pencil options toggle
function switchToPenciloptoins(){
    pencilButtonsContainer.style.display = pencilButtonsContainer.style.display === 'none' ? 'block' : 'none';
    brushSizeFrame.style.display = 'none';
    transparencyOptions.style.display = 'none';
    figuresContainer.style.display ='none';
    settingsscreen.style.display ='none';
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

// Settings functions until row 1205

function toggleSetting() {
    settingsscreen.style.display = settingsscreen.style.display === 'none' ? 'block' : 'none';
    brushSizeFrame.style.display = 'none';
    transparencyOptions.style.display = 'none';
    figuresContainer.style.display ='none';
    pencilButtonsContainer.style.display ='none';
}

//background image options
document.querySelectorAll('.colorButton').forEach(button=> { 
    button.addEventListener('click', function() {
        document.body.style.backgroundImage = 'none'; // Remove background image

        if (this.getAttribute('data-color') != '0') {
          document.body.style.backgroundColor = this.getAttribute('data-color');
        } else {
          document.body.style.backgroundImage = `url('${this.getAttribute('data-image')}')`;
        } 
       // toggleSetting();
    });
    setupTimeoutHandler(button, () => button.click());
  });

//level options
function createPictureButtons(level, palette, start, end) {
    toggleSetting();
    palette.style.display = 'block';
    palette.innerHTML = '';
    let realtimesetting = timesetting;
    let timesettingchange = false;
  
    // Adjust timesetting so the picture sellect will take 1000 miliseconds
    if (timesetting < 1000) {
        realtimesetting = timesetting;
        timesetting = 1000;
        timesettingchange = true;
    }
  
    for (let i = start; i <= end; i++) {
        const button = document.createElement('button');
        button.classList.add('picture-button');
        button.dataset.pictureNumber = i;
  
        const buttonText = document.createTextNode(`Picture ${i}`);
        button.appendChild(buttonText);
  
        const imgSrc = `picture/picture${i}.jpg`;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.classList.add('button-image');
        button.appendChild(img);
  
        button.addEventListener('click', function() {
            level1Palette.style.display = 'none';
            level2Palette.style.display = 'none';
            level3Palette.style.display = 'none';
            if (timesettingchange) {
                timesetting = realtimesetting;
            }
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
            // img = adjustBrightness(img);
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

//download matrix_mousePosition
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
    //toggleSetting(); // Close settings panel after clicking play
};

//help function
function toggle_help() {
  
    if (helpScreen.style.display === 'none'||first_help==0 ) {
        helpScreen.style.display = 'block';
        first_help++;
    }
     else {
        helpScreen.style.display = 'none';
     }
}

function openPPT(fileName) {
    window.open(fileName, '_blank');
}

//grid functions
function drawGrid(ctx, canvas) {
        const gridSize = 35; // Size of the grid squares
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous grid
        ctx.strokeStyle = '#000000'; // Grid line color
        ctx.lineWidth = 0.5; // Grid line width

        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

function toggleGrid() {
        const gridCanvas = document.getElementById('gridCanvas');
        const gridCtx = gridCanvas.getContext('2d');
        const gridVisible = gridCanvas.style.display !== 'none';

        if (gridVisible && (!first_grid==0)) {
            gridCanvas.style.display = 'none';
            gridButton.textContent= 'Grid Is Off'
            
        } else {
            drawGrid(gridCtx, gridCanvas);
            gridCanvas.style.display = 'block';
            gridButton.textContent= 'Grid Is On'
            first_grid++;
        }
        //toggleSetting();
    }

//music functions
function playMusic (){
    NoMusic=0;
    play_Button.style.background='#ddd';
    stop_Button.style.background='#fff';
  };

function stopMusic()  {
    NoMusic=1;
    stop_Button.style.background='#ddd';
    play_Button.style.background='#fff';
  };

//immidiate mode functions
  function immidiateModeChange(){
    if (immidiate_mode)
       { immidiate_mode=0;
        immidiateModeButton.textContent= 'Immediate Mode Is Off';}
    else{
        immidiate_mode=1;
        immidiateModeButton.textContent= 'Immediate Mode Is On';
    }
    //toggleSetting();
}

document.getElementById('functionsStopButton').addEventListener('click', function() {
    if (functionStop){
        functionStop =0;
        this.textContent = `No Functions Mode Is Off`;}
    else { 
         functionStop =1;
        this.textContent = `No Functions Mode Is On`;}
   // toggleSetting();
});


// newPage function
function newPage(){
    saveCanvasState();
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
    toggleAllFigures();
}
// reset image functions
function resetImage() {
    
    saveCanvasState();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.putImageData(originalImageData, 0, 0); // Restore original image
    p=0;
    scale=1;
    threshold=user_threshold;
    updateTransform();
    toggleAllFigures();
  }

function showConfirmation(action) {
    if (functionStop){return;}
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


//initialization functions
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

    help_Button.addEventListener('click',toggle_help);
    close_help_Button.addEventListener('click',toggle_help);
    closeButton.addEventListener('click', toggleSetting);
    toggleFiguresButton.addEventListener("click", toggleFigures);
    rectangleButton.addEventListener('click', switchToRectangle);
    lineButton.addEventListener('click', switchToLine);
    circleButton.addEventListener('click', switchToCircle);
    triangleButton.addEventListener('click', switchToTriangle);
    elipsaButton.addEventListener('click', switchToElipsa);
    IsoscelesTriangleButton.addEventListener('click', switchToIsoscelesTriangle);
    selectColorButton.addEventListener('click', selectColor);
    selectColorButton2.addEventListener('click', selectColor2);
    toggleBrushSizeButton.addEventListener('click',toggleBrushSizeFrame);
    PenTransparencyButton.addEventListener('click',toggleTransparencyOptions);
    settingsbutton.addEventListener('click',toggleSetting);
    MatrixButton.addEventListener('click',MatrixDownload);
    //functionStopButton.addEventListener('click',FunctionStop);
    redColorButton.addEventListener('click', select_immidiate_color);
    greenColorButton.addEventListener('click', select_immidiate_color);
    blueColorButton.addEventListener('click', select_immidiate_color);
    yellowColorButton.addEventListener('click', select_immidiate_color);
    cyanColorButton.addEventListener('click', select_immidiate_color);
    magentaColorButton.addEventListener('click', select_immidiate_color);
    confirmYesButton.addEventListener('click', confirmYes);
    confirmNoButton.addEventListener('click', confirmNo);
    NoColorButton.addEventListener('click',NoColor);
    YesColorButton.addEventListener('click',YesColor);
    play_Button.addEventListener('click', function() {playMusic();});
    stop_Button.addEventListener('click', function() {stopMusic();});
    gridButton.addEventListener('click', toggleGrid);
    immidiateModeButton.addEventListener('click', immidiateModeChange);

    
    [undoButton, saveButton, resetImageButton,newPageButton,PauseButton,zoomInButton,zoomOutButton,DragButton
        ,switchToPenButton,switchToEraserButton,switchToPencilButton ,toggleFiguresButton,level1Button,level2Button,level3Button,
        rectangleButton,lineButton ,circleButton,elipsaButton,triangleButton,IsoscelesTriangleButton,
        selectColorButton,selectColorButton,redColorButton,greenColorButton,cyanColorButton,magentaColorButton,yellowColorButton,blueColorButton,toggleBrushSizeButton,PenTransparencyButton,settingsbutton,MatrixButton
        ,confirmYesButton,confirmNoButton,switchToPencil1Button,switchToPencil2Button,switchToSprayButton,switchToSplashButton
        ,play_Button,stop_Button,gridButton,immidiateModeButton,closeButton,close_help_Button,help_Button
    ].forEach(button => {
        let timeoutId;

        button.addEventListener('mouseenter', function() {
            timeoutId = setTimeout(function() {
                musicPlayer.src= ('songs/song4.mp3');
                if (!NoMusic)
                {musicPlayer.play();}
                button.click(); // Trigger button click after delay
            
            }, timesetting); 
        });

        button.addEventListener('mouseleave', function() {
            clearTimeout(timeoutId); // Clear timeout on mouse leave
        });
    });
    

      document.querySelectorAll('.timesetting-button').forEach(button => {
        if (button.getAttribute('data-value') === '2000') {button.style.backgroundColor = '#ddd';}

            button.addEventListener('click', function() {
            timesetting = parseInt(this.dataset.value); 
            document.querySelectorAll('.timesetting-button').forEach(btn => {
                btn.style.backgroundColor = '#fff'; // Default background color
              });
            this.style.background ='#ddd';
           // toggleSetting(); // Close the settings panel after selecting the option
        });
        setupTimeoutHandler(button, () => button.click());
    });

            
        document.querySelectorAll('.thresholdsetting-button').forEach(button => {
            if (button.getAttribute('data-value') === '40') {button.style.backgroundColor = '#ddd';}
            button.addEventListener('click', function() {
                user_threshold = parseInt(this.dataset.value); // Update threshold with button's data-value
                threshold = user_threshold;
                document.querySelectorAll('.thresholdsetting-button').forEach(btn => {
                    btn.style.backgroundColor = '#fff'; // Default background color
                  });
                this.style.background ='#ddd';
                //toggleSetting(); // Close the settings panel after selecting the option
            });
            setupTimeoutHandler(button, () => button.click());
        });;

    
        stop_Button.style.background ='#ddd';


});

function switchToIsoscelesTriangle ()  { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=true; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToRectangle  () { isPencil_noCompass=false;  isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = true; isCircleMode = false; isTriangleMode = false; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToCircle ()  { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = true; isTriangleMode = false; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToTriangle  () { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = true; isLineMode = false;  scaleTransform();toggleFigures();}
function switchToLine  () { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = true;  scaleTransform();toggleFigures();}
function switchToElipsa ()  { isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= true; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false; scaleTransform();toggleFigures(); }
function switchToPen () {p=0;  isPencil_noCompass=false;isSprayMode = false; isSplashMode = false;  isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = true; isZoomInMode= false ;isZoomOutMode= false; isPencilMode= false; isEraserMode= false; isRectangleMode= false; isCircleMode= false; isTriangleMode= false; isLineMode= false; isDrawing= false; scaleTransform(); toggleAllFigures();}
function switchToEraser() {t=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isZoomInMode = false ;isZoomOutMode = false; isPenMode = false; isPencilMode = false; isEraserMode = true; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false; scaleTransform();toggleAllFigures();}
function activateZoomInMode() {if (functionStop){return;}p=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false;  isIsoscelesTriangleMode=false;  isEllipseMode= false;  isDragMode = false; isZoomInMode = true; isZoomOutMode = false; isDrawing=false;  isPenMode = false; isPencilMode = false; isEraserMode = false;isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode =false;    scaleTransform();  toggleAllFigures(); }
function activateZoomOutMode() {if (functionStop){return;}p=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false;  isEllipseMode= false;  isDragMode = false; isZoomInMode = false; isZoomOutMode = true; isDrawing=false;  isPenMode = false; isPencilMode = false; isEraserMode = false;isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode =false;scaleTransform();toggleAllFigures();}
function activateDragMode() {if (functionStop){return;}p=0;  isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false;  isDragMode = true; isZoomInMode = false; isZoomOutMode = false; isDrawing=false;  isPenMode = false; isPencilMode = false; isEraserMode = false;isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode =false;scaleTransform();toggleAllFigures();}
function switchToSpray () {  isPencil_noCompass=false;  isSprayMode = true; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();   switchToPenciloptoins();}
function switchToSplash () { isPencil_noCompass=false;   isSprayMode = false; isSplashMode = true; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();  switchToPenciloptoins(); }
function switchToPencil () {t=0; isPencil_noCompass=false; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = true; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();  switchToPenciloptoins();}
function switchToPencil_noCompass () {isPencil_noCompass=true; isSprayMode = false; isSplashMode = false; isIsoscelesTriangleMode=false; isEllipseMode= false; isDragMode = false; isPenMode = false; isZoomInMode = false ;isZoomOutMode = false; isPencilMode = false; isEraserMode = false; isDrawing = false; isRectangleMode = false; isCircleMode = false; isTriangleMode = false; isLineMode = false;scaleTransform();  switchToPenciloptoins();}
function Pause() { isDragMode = false; isPenMode = false;  isZoomInMode = false;isZoomOutMode = false; isPencilMode = false; isDrawing = false;scaleTransform();toggleAllFigures(); }
