"use strict";
/*
const {  } = require("browser-sync");
*/
const canvas = document.querySelector("canvas");
canvas.width = (window.innerWidth-24);
canvas.height = window.innerHeight-15;
const c = canvas.getContext("2d");



//Sintaxis: c.fillRect(x,y,width,height) //Cuadrados
/*c.fillStyle="rgba(255,0,0,0.5)";//Le puedo cambiar el color ( si no pongo nada, heredará el anterior, por defecto es negro)
c.fillRect(100,100,100,100);
c.fillStyle="rgba(0,0,255,0.5)";
c.fillRect(400,100,100,100);
c.fillStyle="rgba(0,255,0,0.5)";
c.fillRect(300,300,100,100);
*/
//line
/*c.beginPath();
c.moveTo(x,y);
...;
c.stroke()
*/
/*c.beginPath();
c.moveTo(50,300);
c.lineTo(300,100);
c.lineTo(400,300);
c.stroke();*/

/*c.beginPath();
c.moveTo(50,300);
c.lineTo(300,100);
c.lineTo(400,300);
c.strokeStyle="#fa34a3"; //Así le cambio el color a la linea
c.stroke();*/

//Arc/circle
//Sintaxis
//c.arc(x,y,r,start_angle,end_Angle,direcciónagujasreloj->true,false)
/*c.beginPath();
c.arc(300,300,30,0,Math.PI*2,false);
c.strokeStyle="blue";
c.stroke();*/

//Circulo usando un for 
/*c.strokeStyle="blue"
for(let i=0;i<50;i++){
    let x=Math.random()*window.innerWidth;
    let y=Math.random()*window.innerHeight;
    c.beginPath();
    c.arc(x,y,30,0,Math.PI*2,false);
    c.stroke();
}*/

//primera animación (barra)
/*
let x=100;
let y=100;
function animate() {
    requestAnimationFrame(animate);
    c.beginPath();
    c.arc(x,y,10,0,Math.PI*2,false);
    c.strokeStyle="blue";
    c.stroke();
x+=0.5
if (x===450){x=100;y+=50;}
}
animate()*/

//segunda animación (circulo moviendose)
/*let x=100;
let y=100;
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight)
    c.beginPath();
    c.arc(x,y,10,0,Math.PI*2,false);
    c.strokeStyle="blue";
    c.stroke();
x+=1
if (x===450){x=100;y+=50;}
}
animate()
*/
//tercera animación (circulo botando)
/*let x = 100;
let y = 100;
let radius = 30;
let dx = 1;
let dy = 1;

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight) //Si quitamos esto queda un bonito dibujo
    c.beginPath();
    c.strokeStyle = `rgb(${x*Math.random()},${y*Math.random()},255);` //${(x+y)*Math.random()})`;
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.stroke();
    x += dx;
    y += dy;
    if (x + radius > innerWidth || x - radius < 0) {
        dx = -dx;
    }

    if (y + radius > innerHeight || y - radius < 0) {
        dy = -dy;
    }
}
animate()*/

//Cuarta animación
/*
let x = 100;
let y = 100;
let radius = 30;
c.strokeStyle = "blue";
c.fillStyle="#00ffff";

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.draw = function () {
        c.beginPath();
        //c.strokeStyle = `rgb(${this.x*Math.random()},${this.y*Math.random()},255);` //${(x+y)*Math.random()})`;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fill();

    }
    this.update = function () {


        if (this.x + this.radius > innerWidth-24 || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > innerHeight-15 || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

};

//Creamos 100 circulos diferentes
const circleArray = [];
for (let i = 0; i < 10; i++) {
    let radius = 30;
    let x = Math.random() * (innerWidth-24-radius*2)+radius;
    let y = Math.random() * (innerHeight-15-radius*2)+radius;
    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;
    circleArray.push(new Circle(x, y, dx, dy, radius))
}
//Creamos la animación, con un bucle for para activarla en cada circulo almacenado en el arrayCirculo
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight) //Si quitamos esto queda un bonito dibujo
    for (let i = 0; i < circleArray.length; i++) {
       circleArray[i].update();
        
    }
}
animate()
*/
// interacción con el ratón
let x = 100;
let y = 100;
let radius = 5;
let maxRadius=40;
/*c.strokeStyle = "blue";
c.fillStyle="#00ffff";*/
let mouse={
    x:undefined,
    y:undefined,
}
/*const colorArray=[
    "blue",
    "green",
    "#00f000",
    "rebecapurple",
    "#ff1100",
];*/
const colorArray=[
    "#C2D2F2",
    "#0E5673",
    "##071D26",
    "#A67360",
    "##73463C",
];

window.addEventListener("mousemove",function(event){//aqui almaceno donde está el ratón
    mouse.x=event.x;
    mouse.y=event.y;
})

window.addEventListener("resize",function(){
    canvas.width = (window.innerWidth-24);
    canvas.height = window.innerHeight-15;
    init();
})

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color=colorArray[Math.floor(Math.random()*colorArray.length)];
    this.draw = function () {
        c.beginPath();
        //c.strokeStyle = `rgb(${this.x*Math.random()},${this.y*Math.random()},255);` //${(x+y)*Math.random()})`;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fillStyle=this.color;//colorArray[Math.floor(Math.random()*colorArray.length)];//Colores epilepticos
        c.fill();

    }
    this.update = function () {


        if (this.x + this.radius > innerWidth-24 || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > innerHeight-15 || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
//interacción con el ratón

        if (mouse.x-this.x<=50&&mouse.x-this.x>-50&&
            mouse.y-this.y<=50&&mouse.y-this.y>-50
            ){
                if (this.radius<maxRadius){
            this.radius+=4;}
        }else if  (this.radius>2){
            this.radius-=1;
        }

        this.draw();
    }

};

//Creamos 100 circulos diferentes
let circleArray = [];
//Esta función ocurrirá cada vez que redimensionemos 
function init(){
    circleArray = [];
    for (let i = 0; i < 700; i++) {
        let radius =2;
        let x = Math.random() * (innerWidth-24-radius*2)+radius;
        let y = Math.random() * (innerHeight-15-radius*2)+radius;
        let dx = (Math.random() - 0.5) * 2;
        let dy = (Math.random() - 0.5) * 2;
        circleArray.push(new Circle(x, y, dx, dy, radius))
    }
    
}
init();
//Creamos la animación, con un bucle for para activarla en cada circulo almacenado en el arrayCirculo
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight) //Si quitamos esto queda un bonito dibujo
    for (let i = 0; i < circleArray.length; i++) {
       circleArray[i].update();
        
    }
}
animate()
