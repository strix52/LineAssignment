// Initialize FabricJS canvas
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff'
});

// Make canvas responsive
function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    const containerWidth = container.clientWidth - 48; // Account for padding
    const containerHeight = window.innerHeight * 0.6; // 60% of viewport height
    
    const maxWidth = Math.min(containerWidth, 1200); // Max width limit
    const maxHeight = Math.min(containerHeight, 800); // Max height limit
    
    canvas.setDimensions({
        width: maxWidth,
        height: maxHeight
    });
    canvas.renderAll();
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Drawing state
let isDrawing = false;
let startX, startY;
let currentLine = null;
let lShapePoints = [];

// DOM elements
const strokeColorInput = document.getElementById('strokeColor');
const strokeWidthInput = document.getElementById('strokeWidth');
const clearCanvasBtn = document.getElementById('clearCanvas');
const deleteSelectedBtn = document.getElementById('deleteSelected');
const dashedLineInput = document.getElementById('dashedLine');
const shapeTypeInput = document.getElementById('shapeType');

function createCurvedLine(startX, startY, endX, endY) {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 30;
    
    const pathString = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
    const path = new fabric.Path(pathString, {
        stroke: strokeColorInput.value,
        strokeWidth: parseInt(strokeWidthInput.value),
        fill: '',
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
    });
    
    path.shapeType = 'curved';
    return path;
}

function createBezierCurve(startX, startY, endX, endY) {
    const cp1X = startX + (endX - startX) * 0.3;
    const cp1Y = startY - 50;
    const cp2X = endX - (endX - startX) * 0.3;
    const cp2Y = endY - 50;
    
    const pathString = `M ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`;
    const path = new fabric.Path(pathString, {
        stroke: strokeColorInput.value,
        strokeWidth: parseInt(strokeWidthInput.value),
        fill: '',
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
    });
    
    path.shapeType = 'bezier';
    return path;
}

function createStraightLine(startX, startY, endX, endY) {
    const line = new fabric.Line([startX, startY, endX, endY], {
        stroke: strokeColorInput.value,
        strokeWidth: parseInt(strokeWidthInput.value),
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        originX: 'center',
        originY: 'center',
        strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
    });
    
    line.shapeType = 'straight';
    return line;
}

canvas.on('mouse:down', function(options) {
    if (options.target === null) {
        const pointer = canvas.getPointer(options.e);

        if (shapeTypeInput.value === 'lshape') {
            lShapePoints.push({ x: pointer.x, y: pointer.y });

            if (lShapePoints.length === 3) {
                const line1 = new fabric.Line(
                    [lShapePoints[0].x, lShapePoints[0].y, lShapePoints[1].x, lShapePoints[1].y],
                    {
                        stroke: strokeColorInput.value,
                        strokeWidth: parseInt(strokeWidthInput.value),
                        selectable: false,
                        evented: false,
                        strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
                    }
                );
                const line2 = new fabric.Line(
                    [lShapePoints[1].x, lShapePoints[1].y, lShapePoints[2].x, lShapePoints[2].y],
                    {
                        stroke: strokeColorInput.value,
                        strokeWidth: parseInt(strokeWidthInput.value),
                        selectable: false,
                        evented: false,
                        strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
                    }
                );
                const lShapeGroup = new fabric.Group([line1, line2], {
                    selectable: true,
                    evented: true
                });
                
                lShapeGroup.shapeType = 'lshape';
                
                canvas.add(lShapeGroup);
                canvas.setActiveObject(lShapeGroup);
                canvas.renderAll();
                lShapePoints = [];
            }
        } else {
            isDrawing = true;
            startX = pointer.x;
            startY = pointer.y;

            const shapeType = shapeTypeInput.value;
            if (shapeType === 'straight') {
                currentLine = createStraightLine(startX, startY, startX, startY);
            } else if (shapeType === 'curved') {
                currentLine = createCurvedLine(startX, startY, startX, startY);
            } else if (shapeType === 'bezier') {
                currentLine = createBezierCurve(startX, startY, startX, startY);
            }

            canvas.add(currentLine);
            canvas.setActiveObject(currentLine);
        }
    }
});

canvas.on('mouse:move', function(options) {
    if (isDrawing && currentLine) {
        const pointer = canvas.getPointer(options.e);
        const shapeType = shapeTypeInput.value;
        
        if (shapeType === 'straight') {
            currentLine.set({
                x2: pointer.x,
                y2: pointer.y
            });
        } else if (shapeType === 'curved' || shapeType === 'bezier') {
            canvas.remove(currentLine);
            
            if (shapeType === 'curved') {
                currentLine = createCurvedLine(startX, startY, pointer.x, pointer.y);
            } else if (shapeType === 'bezier') {
                currentLine = createBezierCurve(startX, startY, pointer.x, pointer.y);
            }
            
            canvas.add(currentLine);
            canvas.setActiveObject(currentLine);
        }
        
        canvas.renderAll();
    }
});

canvas.on('mouse:up', function(options) {
    if (isDrawing && currentLine) {
        isDrawing = false;
        currentLine = null;
        
        canvas.discardActiveObject();
        canvas.renderAll();
    }
});

strokeColorInput.addEventListener('change', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && (activeObject.type === 'line' || activeObject.type === 'path')) {
        activeObject.set('stroke', this.value);
        canvas.renderAll();
    }
});

strokeWidthInput.addEventListener('change', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && (activeObject.type === 'line' || activeObject.type === 'path')) {
        activeObject.set('strokeWidth', parseInt(this.value));
        canvas.renderAll();
    }
});

clearCanvasBtn.addEventListener('click', function() {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    lShapePoints = [];
    canvas.renderAll();
});

deleteSelectedBtn.addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
    }
});

dashedLineInput.addEventListener('change', function() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if (activeObject.type === 'line' || activeObject.type === 'path') {
        activeObject.set('strokeDashArray', dashedLineInput.checked ? [10, 5] : null);
    } else if (activeObject.type === 'group') {
        activeObject.getObjects().forEach(obj => {
            if (obj.type === 'line' || obj.type === 'path') {
                obj.set('strokeDashArray', dashedLineInput.checked ? [10, 5] : null);
            }
        });
    }
    canvas.renderAll();
});

const convertToDropdown = document.getElementById('convertTo');

function getObjectBounds(obj) {
    if (obj.type === 'line') {
        return {
            startX: obj.x1, startY: obj.y1,
            endX: obj.x2, endY: obj.y2
        };
    } else if (obj.type === 'path') {
        const pathArray = obj.path;
        const startPoint = pathArray[0];
        const endPoint = pathArray[pathArray.length - 1];
        return {
            startX: startPoint[1], startY: startPoint[2],
            endX: endPoint[endPoint.length-2], endY: endPoint[endPoint.length-1]
        };
    } else if (obj.type === 'group') {
        const firstLine = obj.getObjects()[0];
        const secondLine = obj.getObjects()[1];
        return {
            startX: firstLine.x1, startY: firstLine.y1,
            endX: secondLine.x2, endY: secondLine.y2
        };
    }
    return null;
}

function preserveProperties(oldObj, newObj) {
    if (oldObj.type === 'group') {
        const firstObj = oldObj.getObjects()[0];
        newObj.set({
            stroke: firstObj.stroke,
            strokeWidth: firstObj.strokeWidth,
            strokeDashArray: firstObj.strokeDashArray
        });
    } else {
        newObj.set({
            stroke: oldObj.stroke,
            strokeWidth: oldObj.strokeWidth,
            strokeDashArray: oldObj.strokeDashArray
        });
    }
}

function convertSelectedObject(targetType) {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
        alert('Please select an object to convert');
        return;
    }
    
    if (activeObject.shapeType === targetType) {
        return;
    }
    
    const bounds = getObjectBounds(activeObject);
    if (!bounds) return;
    
    let newObject;
    
    switch(targetType) {
        case 'straight':
            newObject = createStraightLine(bounds.startX, bounds.startY, bounds.endX, bounds.endY);
            break;
        case 'curved':
            newObject = createCurvedLine(bounds.startX, bounds.startY, bounds.endX, bounds.endY);
            break;
        case 'bezier':
            newObject = createBezierCurve(bounds.startX, bounds.startY, bounds.endX, bounds.endY);
            break;
    }
    
    if (newObject) {
        preserveProperties(activeObject, newObject);
        
        canvas.remove(activeObject);
        canvas.add(newObject);
        canvas.setActiveObject(newObject);
        canvas.renderAll();
    }
}

convertToDropdown.addEventListener('change', function() {
    const targetType = this.value;
    if (targetType) {
        convertSelectedObject(targetType);
        this.value = '';
    }
});

// Note: This event handler is now handled by the coordinate controls section below

canvas.on('object:modified', function(e) {
    const modifiedObject = e.target;
    if (modifiedObject && modifiedObject.type === 'line') {
        // console.log('Line modified - New coordinates:');
        // console.log('Start: (' + modifiedObject.x1 + ', ' + modifiedObject.y1 + ')');
        // console.log('End: (' + modifiedObject.x2 + ', ' + modifiedObject.y2 + ')');
    }
});

// Simple coordinate popup
let selectedLineForPopup = null;
let isUpdatingLine = false;

// Show popup on line selection
canvas.on('selection:created', function(e) {
    if (isUpdatingLine) return; // Don't interfere during updates
    const selectedObject = e.selected[0];
    if (selectedObject && (selectedObject.type === 'line' || selectedObject.type === 'path' || selectedObject.type === 'group')) {
        selectedLineForPopup = selectedObject;
        // Position popup at center of canvas since we don't have mouse position here
        const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();
        showCoordinatePopup(canvasRect.left + 50, canvasRect.top + 50, selectedLineForPopup);
    }
});

canvas.on('selection:cleared', function(e) {
    if (isUpdatingLine) return; // Don't close popup during updates
    closePopup();
});

canvas.on('selection:updated', function(e) {
    if (isUpdatingLine) return; // Don't interfere during updates
    const selectedObject = e.selected[0];
    if (selectedObject && (selectedObject.type === 'line' || selectedObject.type === 'path' || selectedObject.type === 'group')) {
        selectedLineForPopup = selectedObject;
        const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();
        showCoordinatePopup(canvasRect.left + 50, canvasRect.top + 50, selectedLineForPopup);
    } else {
        closePopup();
    }
});

function showCoordinatePopup(x, y, lineObj) {
    const popup = document.getElementById('coordinatePopup');
    const curveInputs = document.getElementById('curveInputs');
    const bezierInputs = document.getElementById('bezierInputs');
    
    // Position popup near click
    popup.style.left = (x + 10) + 'px';
    popup.style.top = (y + 10) + 'px';
    popup.style.display = 'block';
    
    // Hide curve controls initially
    curveInputs.style.display = 'none';
    bezierInputs.style.display = 'none';
    
    // Populate based on line type
    if (lineObj.shapeType === 'straight') {
        document.getElementById('popupX1').value = lineObj.x1.toFixed(1);
        document.getElementById('popupY1').value = lineObj.y1.toFixed(1);
        document.getElementById('popupX2').value = lineObj.x2.toFixed(1);
        document.getElementById('popupY2').value = lineObj.y2.toFixed(1);
    } else if (lineObj.shapeType === 'curved') {
        const coords = getPathCoordinates(lineObj);
        document.getElementById('popupX1').value = coords.startX.toFixed(1);
        document.getElementById('popupY1').value = coords.startY.toFixed(1);
        document.getElementById('popupX2').value = coords.endX.toFixed(1);
        document.getElementById('popupY2').value = coords.endY.toFixed(1);
        document.getElementById('popupCP1X').value = coords.cp1X.toFixed(1);
        document.getElementById('popupCP1Y').value = coords.cp1Y.toFixed(1);
        curveInputs.style.display = 'block';
    } else if (lineObj.shapeType === 'bezier') {
        const coords = getPathCoordinates(lineObj);
        document.getElementById('popupX1').value = coords.startX.toFixed(1);
        document.getElementById('popupY1').value = coords.startY.toFixed(1);
        document.getElementById('popupX2').value = coords.endX.toFixed(1);
        document.getElementById('popupY2').value = coords.endY.toFixed(1);
        document.getElementById('popupCP1X').value = coords.cp1X.toFixed(1);
        document.getElementById('popupCP1Y').value = coords.cp1Y.toFixed(1);
        document.getElementById('popupCP2X').value = coords.cp2X.toFixed(1);
        document.getElementById('popupCP2Y').value = coords.cp2Y.toFixed(1);
        curveInputs.style.display = 'block';
        bezierInputs.style.display = 'block';
    } else if (lineObj.shapeType === 'lshape') {
        const lines = lineObj.getObjects();
        if (lines.length >= 2) {
            document.getElementById('popupX1').value = lines[0].x1.toFixed(1);
            document.getElementById('popupY1').value = lines[0].y1.toFixed(1);
            document.getElementById('popupX2').value = lines[1].x2.toFixed(1);
            document.getElementById('popupY2').value = lines[1].y2.toFixed(1);
        }
    }
}

function closePopup() {
    document.getElementById('coordinatePopup').style.display = 'none';
    selectedLineForPopup = null;
}

function updateSelectedLine() {
    if (!selectedLineForPopup) return;
    
    const x1 = parseFloat(document.getElementById('popupX1').value);
    const y1 = parseFloat(document.getElementById('popupY1').value);
    const x2 = parseFloat(document.getElementById('popupX2').value);
    const y2 = parseFloat(document.getElementById('popupY2').value);
    
    if (selectedLineForPopup.shapeType === 'straight') {
        selectedLineForPopup.set({ x1: x1, y1: y1, x2: x2, y2: y2 });
        selectedLineForPopup.setCoords();
    } else if (selectedLineForPopup.shapeType === 'curved') {
        const cp1X = parseFloat(document.getElementById('popupCP1X').value);
        const cp1Y = parseFloat(document.getElementById('popupCP1Y').value);
        updateCurvedLine(x1, y1, x2, y2, cp1X, cp1Y);
    } else if (selectedLineForPopup.shapeType === 'bezier') {
        const cp1X = parseFloat(document.getElementById('popupCP1X').value);
        const cp1Y = parseFloat(document.getElementById('popupCP1Y').value);
        const cp2X = parseFloat(document.getElementById('popupCP2X').value);
        const cp2Y = parseFloat(document.getElementById('popupCP2Y').value);
        updateBezierLine(x1, y1, x2, y2, cp1X, cp1Y, cp2X, cp2Y);
    } else if (selectedLineForPopup.shapeType === 'lshape') {
        const lines = selectedLineForPopup.getObjects();
        if (lines.length >= 2) {
            const midX = lines[0].x2;
            const midY = lines[0].y2;
            lines[0].set({ x1: x1, y1: y1, x2: midX, y2: midY });
            lines[1].set({ x1: midX, y1: midY, x2: x2, y2: y2 });
            selectedLineForPopup.addWithUpdate();
        }
    }
    
    canvas.renderAll();
    // Keep popup open for multiple edits - don't call closePopup()
}

function updateCurvedLine(startX, startY, endX, endY, cpX, cpY) {
    isUpdatingLine = true; // Prevent selection events from interfering
    
    const pathString = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
    const newPath = new fabric.Path(pathString, {
        stroke: selectedLineForPopup.stroke,
        strokeWidth: selectedLineForPopup.strokeWidth,
        fill: '',
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        strokeDashArray: selectedLineForPopup.strokeDashArray
    });
    
    newPath.shapeType = 'curved';
    canvas.remove(selectedLineForPopup);
    canvas.add(newPath);
    canvas.setActiveObject(newPath);  // Keep the new object selected
    selectedLineForPopup = newPath;
    
    isUpdatingLine = false; // Re-enable selection events
}

function updateBezierLine(startX, startY, endX, endY, cp1X, cp1Y, cp2X, cp2Y) {
    isUpdatingLine = true; // Prevent selection events from interfering
    
    const pathString = `M ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`;
    const newPath = new fabric.Path(pathString, {
        stroke: selectedLineForPopup.stroke,
        strokeWidth: selectedLineForPopup.strokeWidth,
        fill: '',
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        strokeDashArray: selectedLineForPopup.strokeDashArray
    });
    
    newPath.shapeType = 'bezier';
    canvas.remove(selectedLineForPopup);
    canvas.add(newPath);
    canvas.setActiveObject(newPath);  // Keep the new object selected
    selectedLineForPopup = newPath;
    
    isUpdatingLine = false; // Re-enable selection events
}

function getPathCoordinates(path) {
    const pathArray = path.path;
    const coords = {};
    
    if (pathArray[0][0] === 'M') {
        coords.startX = pathArray[0][1];
        coords.startY = pathArray[0][2];
    }
    
    if (pathArray[1][0] === 'Q') {
        coords.cp1X = pathArray[1][1];
        coords.cp1Y = pathArray[1][2];
        coords.endX = pathArray[1][3];
        coords.endY = pathArray[1][4];
    } else if (pathArray[1][0] === 'C') {
        coords.cp1X = pathArray[1][1];
        coords.cp1Y = pathArray[1][2];
        coords.cp2X = pathArray[1][3];
        coords.cp2Y = pathArray[1][4];
        coords.endX = pathArray[1][5];
        coords.endY = pathArray[1][6];
    }
    
    return coords;
} 