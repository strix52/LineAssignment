# FabricJS Canvas Line Drawing

A simple and beginner-friendly canvas application using FabricJS that allows you to draw, move, and customize lines.

## Features

- **Draw Lines**: Click and drag on the canvas to draw lines
- **Move Lines**: Click and drag existing lines to move them around
- **Stretch Lines**: Click on line endpoints to resize/stretch the line
- **Customize Lines**: Change line color and width using the controls
- **Delete Lines**: Select a line and click "Delete Selected" to remove it
- **Clear Canvas**: Remove all lines from the canvas

## How to Use

1. **Open the application**: Open `index.html` in your web browser
2. **Draw a line**: Click and drag on the empty canvas area to draw a line
3. **Move a line**: Click on an existing line and drag to move it
4. **Stretch a line**: Click on the control points (small squares) at the ends of a line to resize it
5. **Customize lines**: 
   - Select a line by clicking on it
   - Use the color picker to change the line color
   - Use the number input to change the line width
6. **Delete lines**: Select a line and click the "Delete Selected" button
7. **Clear all**: Click "Clear Canvas" to remove all lines

## File Structure

- `index.html` - Main HTML file with the user interface
- `script.js` - JavaScript code with FabricJS functionality
- `README.md` - This documentation file

## Technical Details

### Line Coordinates
Lines are defined by their start and end coordinates:
- `x1, y1` - Starting point coordinates
- `x2, y2` - Ending point coordinates

### FabricJS Line Properties
Each line has these properties:
- `stroke` - Line color
- `strokeWidth` - Line thickness
- `selectable` - Can be selected and modified
- `evented` - Responds to mouse events
- `hasControls` - Shows resize handles
- `hasBorders` - Shows selection border
- `lockRotation` - Prevents rotation (keeps it simple)

### Browser Console
The application logs line coordinates to the browser console when you:
- Select a line (shows current coordinates)
- Modify a line (shows new coordinates)

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection (for FabricJS CDN)

## Getting Started

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start drawing lines!

## Example Lines

The application comes with three example lines in different colors to demonstrate the functionality:
- Red line (width: 3)
- Blue line (width: 5) 
- Green line (width: 4)

## Customization

You can easily modify the application by:
- Changing the canvas size in the HTML
- Adding more line properties in the JavaScript
- Modifying the styling in the CSS section
- Adding new controls for additional features

This is a great starting point for learning FabricJS and canvas manipulation! 