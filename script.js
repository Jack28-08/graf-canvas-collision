const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Configuración del canvas
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

// Clase Circle
class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();

        // Dibujar texto en el centro
        context.fillStyle = "#000"; // Color negro para el texto
        context.font = "20px Arial"; // Fuente más legible
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, this.posX, this.posY);
    }

    update(context, circles) {
        this.posX += this.dx;
        this.posY += this.dy;

        // Rebote en los bordes
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Detección de colisiones con otros círculos
        this.checkCollisions(circles);

        // Dibujar el círculo con el texto
        this.draw(context);
    }

    checkCollisions(circles) {
        circles.forEach(circle => {
            if (this !== circle) {
                let dx = this.posX - circle.posX;
                let dy = this.posY - circle.posY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.radius + circle.radius) {
                    // Cambiar temporalmente de color a azul
                    this.color = "#0000FF";
                    circle.color = "#0000FF";

                    // Invertir dirección
                    this.dx = -this.dx;
                    this.dy = -this.dy;
                    circle.dx = -circle.dx;
                    circle.dy = -circle.dy;

                    // Restaurar el color original después de un tiempo corto
                    setTimeout(() => {
                        this.color = this.originalColor;
                        circle.color = circle.originalColor;
                    }, 100);
                }
            }
        });
    }
}

// Crear círculos
let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 2 + 0.5; // Velocidad entre 0.5 y 2.5 (más lento)
        let text = `C${i + 1}`;

        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Animación
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

// Generar círculos y comenzar animación
generateCircles(10);
animate();
