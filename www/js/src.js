"use strict";

const canvas = document.querySelector("canvas");
canvas.width = (window.innerWidth - 24);
canvas.height = window.innerHeight - 15;
const c = canvas.getContext("2d");

// interacción con el ratón
let x = 100;
let y = 100;
let radius = 5;
let maxRadius = 40;
let mouse = {
    x: undefined,
    y: undefined,
}
const colorArray = [
    "#C2D2F2",
    "#0E5673",
    "##071D26",
    "#A67360",
    "##73463C",
];

window.addEventListener("mousemove", function (event) { //aqui almaceno donde está el ratón
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener("resize", function () {
    canvas.width = (window.innerWidth - 24);
    canvas.height = window.innerHeight - 15;
    init();
})

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fillStyle = this.color;
        c.fill();

    }
    this.update = function () {


        if (this.x + this.radius > innerWidth - 24 || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > innerHeight - 15 || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        //interacción con el ratón

        if (mouse.x - this.x <= 50 && mouse.x - this.x > -50 &&
            mouse.y - this.y <= 50 && mouse.y - this.y > -50
        ) {
            if (this.radius < maxRadius) {
                this.radius += 4;
            }
        } else if (this.radius > 2) {
            this.radius -= 1;
        }

        this.draw();
    }

};

//Creamos 100 circulos diferentes
let circleArray = [];
//Esta función ocurrirá cada vez que redimensionemos 
function init() {
    circleArray = [];
    for (let i = 0; i < 200; i++) {
        let radius = 2;
        let x = Math.random() * (innerWidth - 24 - radius * 2) + radius;
        let y = Math.random() * (innerHeight - 15 - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 20;
        let dy = (Math.random() - 0.5) * 20;
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

/*Nº INCIDENCIA: 252873
correo incidencias: fibra@finetwork.es*/