# FabricJS Canvas Drawing Application

A modern, responsive drawing application built with FabricJS that lets you create and manipulate various types of lines and shapes on an interactive canvas.

## ✨ Features

### 🎨 Drawing Tools
- **Straight Lines** - Classic point-to-point lines
- **Curved Lines** - Smooth quadratic curves  
- **Bezier Curves** - Advanced cubic curves for complex shapes
- **L-Shapes** - Connected two-segment lines (click 3 points)
- **Dashed Lines** - Any shape can be made dashed

### 🔄 Shape Conversion
- Convert any shape to any other type while preserving properties
- Smart conversion system that maintains line color, width, and style
- Easy dropdown interface for quick transformations

### 🎛️ Interactive Controls
- **Color Picker** - Choose any line color
- **Width Slider** - Adjust line thickness (1-20px)
- **Shape Selection** - Switch between different drawing modes
- **Dashed Toggle** - Make any line dashed or solid
- **Coordinate Editor** - Precise numerical control over line positioning

### 📱 Responsive Design  
- **Adaptive Canvas** - Automatically resizes to fit your screen
- **Mobile-Friendly** - Works great on tablets and phones
- **Modern UI** - Clean, professional interface with smooth animations

## 🚀 How to Use

### Basic Drawing
1. **Choose your shape type** from the dropdown (Straight, Curved, Bezier, L-Shape)
2. **Set your preferences** - color, width, dashed style
3. **Click and drag** on the canvas to draw
   - For L-shapes: Click 3 points to create the shape
   - For other shapes: Click and drag from start to end point

### Editing Shapes
1. **Select any shape** by clicking on it
2. **Move it** by dragging
3. **Resize it** using the corner handles
4. **Change properties** using the controls (color, width, dashed)

### Precise Coordinate Editing
1. **Select a drawn line** to open the coordinate popup
2. **Edit coordinates** directly using numerical inputs:
   - **X1, Y1** - Starting point coordinates
   - **X2, Y2** - Ending point coordinates
   - **Control Points** - Additional curve controls for curved/Bezier lines
3. **Click Update** to apply changes (popup stays open for multiple adjustments)
4. **Click Close** or deselect the line to hide the popup

### Converting Shapes
1. **Select a shape** you want to convert
2. **Choose target type** from the "Convert Selected Shape" dropdown
3. **Watch it transform** while keeping all your styling

### Managing Your Canvas
- **Clear Canvas** - Remove everything and start fresh
- **Delete Selected** - Remove just the currently selected shape

## 🛠️ Technical Details

### Supported Shape Types
- **Straight Lines** (`fabric.Line`) - Basic line objects
- **Curved Lines** (`fabric.Path`) - Quadratic curves using SVG paths
- **Bezier Curves** (`fabric.Path`) - Cubic curves with control points  
- **L-Shapes** (`fabric.Group`) - Grouped line objects

### Responsive System
The canvas automatically adapts its size based on:
- Available screen width (up to 95% of viewport)
- Screen height (60% of viewport height)  
- Maximum limits: 1200px × 800px

### Properties Preserved During Conversion
- `stroke` - Line color
- `strokeWidth` - Line thickness
- `strokeDashArray` - Dashed line pattern

## 📁 File Structure

```
├── index.html      # Main application with embedded CSS
├── script.js       # Core functionality and FabricJS integration  
└── README.md       # This documentation
```

## 🌐 Browser Requirements

- **Modern Browser** - Chrome, Firefox, Safari, Edge (recent versions)
- **JavaScript Enabled** - Required for all functionality
- **Internet Connection** - Needed to load FabricJS from CDN

## 🎯 Getting Started

1. **Download** all files to a folder
2. **Open** `index.html` in your web browser  
3. **Start creating!** Try different shape types and conversions

## 💡 Tips & Tricks

- **Try shape conversion** - Draw a straight line, then convert it to curved or bezier
- **Use coordinate editing** - Select any line for precise numerical positioning
- **Use L-shapes** for technical drawings or architectural sketches
- **Make dashed lines** for guidelines or construction marks
- **Fine-tune curves** - Use coordinate editing to adjust control points on curved lines
- **Resize your browser** to see the responsive canvas in action
- **Mobile drawing** works great - try it on your tablet!

## 🎨 Perfect For

- **Technical drawings** and diagrams
- **UI/UX wireframing** and mockups
- **Learning FabricJS** and canvas manipulation
- **Quick sketches** and brainstorming
- **Responsive web graphics** that adapt to any screen

---

Built using [FabricJS](http://fabricjs.com/) - A powerful HTML5 canvas library 