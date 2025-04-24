let startAngle = 180;
let decades = ["2020", "2010", "2000", "1990", "1980", "1970", "1960", "1950"];
let decadeColors;
let gradient = 0;
// let colorSpeed = 0.1; // slower = smoother
let t = 0; // perlin
let scale = 0.001; // zoom
let speed = 0.015;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // console.log(windowHeight);
  // console.log(height);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textSize(16);
  pixelDensity(1);
  
  decadeColors = [
    // 2020
     [color(245, 239, 235), // cream
     color(54, 83, 110), // denim
    color(173, 157, 134)], // tan
    // 2010
    [color(252, 199, 208), // millennial pink
     color(181, 101, 69), // polished copper
     color(242, 78, 116)], // one million likes
    // 2000
    [color(255, 85, 180), // hot pink
     color(57, 255, 20), // lime green
     color(0, 183, 235)], // cyanish blue
    // 1990
    [color(181, 56, 102), // mauve pink
     color(217, 179, 54), // dijon
     color(0, 90, 173)], // dark blue
    // 1980
    [color(91, 239, 252), // cyan blue
     color(146, 224, 112), // duller lime green
     color(209, 69, 158)], // dullish magenta
    // 1970
    [color(237, 168, 50), // orange gold
     color(115, 168, 189), // lighter denim
     color(128, 65, 28)], // red-orange brown
    // 1960
    [color(234, 237, 218), // light greenish cream
     color(220, 245, 176), // yellow-green pastel
     color(245, 149, 118)], // orange-red pastel-ish
    // 1950
    [color(149, 224, 245), // sky blue
     color(112, 153, 109), // light forest green
     color(166, 18, 35)]]; // slight purple-ish red
}

// function draw() {
//   background(255);

//   let decFloat = (startAngle % 360 + 360) % 360 / 45;
//   let decade = floor(decFloat) % decades.length;
//   let colors = decadeColors[decade];

//   gradient = (gradient + colorSpeed) % 3;

//   gradient = constrain(gradient, 0, 2.999); // ??????

//   let segment = floor(gradient);
//   let t2 = gradient % 1;

//   let c1 = colorSet[segment];
//   let c2 = colorSet[(segment + 1) % 3];

//   // noise box
//   let rectWidth = 400;
//   let rectHeight = 400;
//   let startX = (width - rectWidth) / 2;
//   let startY = (height - rectHeight) / 2;

//   t += speed;
//   loadPixels();
//   // for (let x = 0; x < width; x++)
//   //   {
//   //     for (let y = 0; y < height; y++)
//   //       {
//   //         let index = 4 * (x + y * width);
//   //         pixels[index] = 255;
//   //         pixels[index + 1] = 0;
//   //         pixels[index + 2] = 0;
//   //         pixels[index + 3] = 255;
//   //       }
//   //   }
//   for (let x = startX; x < startX + rectWidth; x++) {
//     for (let y = startY; y < startY + rectHeight; y++) {
//       let nx = (x - startX) * scale;
//       let ny = (y - startY) * scale;

//       let n = noise(nx, ny, t) * 2;

//       let index = floor(n) % 2;
//       let lerpT = n % 1;

//       let c1 = colors[index];
//       let c2 = colors[index + 1];

//       let c = lerpColor(c1, c2, lerpT);
//       let i = 4 * (int(x) + int(y) * width);
//       pixels[i] = red(c);
//       pixels[i + 1] = green(c);
//       pixels[i + 2] = blue(c);
//       pixels[i + 3] = 255;
//     }
//   }

//   updatePixels();

//   textOnWheel();
// }

function draw() {
  background(255);

  t += speed;

  let decFloat = (startAngle + 180 + 25) % 360 / 45;
  let decade = floor(decFloat) % decadeColors.length; // keeps in scope
  let colors = decadeColors[decade];

  loadPixels();

  let rectWidth = 400;
  let rectHeight = 400;
  let startX = floor((width - rectWidth) / 2);
  let startY = floor((height - rectHeight) / 2);
  
   let c0 = colors[0]; // primary color
  let c1 = colors[1]; // sec
  let c2 = colors[2]; // third
  


  for (let x = startX; x < startX + rectWidth; x++) {
    for (let y = startY; y < startY + rectHeight; y++) {
      let nx = (x - startX) * scale;
      let ny = (y - startY) * scale;
      
      let n = noise(nx, ny, t); // [0, 1]

      let col;
       if (n < 0.2) { // primary to second
        let lerpT = map(n, 0.0, 0.2, 0, 2);
        col = lerpColor(c0, c1, lerpT);
      } else if (n < 0.4) { // second to third
        let lerpT = map(n, 0.2, 0.4, 0, 1);
        col = lerpColor(c1, c2, lerpT);
      } 
      else if (n < 0.6) { // third to primary
        let lerpT = map(n, 0.4, 0.6, 0, 2);
        col = lerpColor(c2, c0, lerpT);
      }
      else { // primary extension
        let lerpT = map(n, 0.6, 1.0, 0, 1);
        col = lerpColor(c0, c0, lerpT);
      }

      let index = 4 * (x + y * width);
      pixels[index] = red(col);
      pixels[index + 1] = green(col);
      pixels[index + 2] = blue(col);
      pixels[index + 3] = 255;
    }
  } // messed around a lot with numbers
  
  

  updatePixels();
  textOnWheel();
}

function textOnWheel() {
  let rad = height * 0.375;
  let centerX = width / 2;
  let centerY = height / 2;

  for (let i = 0; i < decades.length; i++) {
    let angle = startAngle - i * 45;
    let x = centerX + rad * cos(angle) + width / 2;
    let y = centerY + rad * sin(angle);
    let centerRad = abs(y - centerY);
    let closeness = 1 - constrain(centerRad / rad, 0, 1);
    let size = map(closeness, 0, 1, 15, 50);
    textSize(size);
    fill(0);
    text(decades[i], x, y);
  }
}

function mouseWheel(event) {
  startAngle += event.delta > 0 ? 3 : -3;
}
