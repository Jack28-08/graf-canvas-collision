const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let circles = [];
let deletedCount = 0;
const counterDiv = document.getElementById('counter');

// Clase para los círculos
class Circle {
  constructor(x, y, radius, color, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
  }

  // Método para dibujar el círculo en el canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  // Método para actualizar la posición del círculo (cae hacia abajo)
  update() {
    this.y += this.speed;

    if (this.y - this.radius > canvas.height) {
      this.y = -this.radius; // Hace que caiga desde la parte superior
      this.x = Math.random() * canvas.width; // Posición aleatoria en X
      this.speed = Math.random() * 3 + 1; // Velocidad aleatoria
      this.color = getRandomColor(); // Color aleatorio
    }
  }

  // Verificar si el clic del mouse está dentro del círculo
  isClicked(mouseX, mouseY) {
    const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
    return distance < this.radius;
  }
}

// Genera un color aleatorio
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

// Función para iniciar los círculos
function createCircles(num) {
  for (let i = 0; i < num; i++) {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * canvas.width;
    const y = -radius; // Comienza justo encima del margen superior
    const color = getRandomColor();
    const speed = Math.random() * 3 + 1; // Velocidad aleatoria
    circles.push(new Circle(x, y, radius, color, speed));
  }
}

// Detectar el clic en el canvas
canvas.addEventListener('click', (event) => {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i].isClicked(mouseX, mouseY)) {
      circles.splice(i, 1); // Elimina el círculo del arreglo
      deletedCount++;
      counterDiv.textContent = `Círculos eliminados: ${deletedCount}`; // Actualiza el contador
      break;
    }
  }
});

// Función para actualizar y dibujar los círculos en cada fotograma
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas

  circles.forEach(circle => {
    circle.update(); // Actualiza la posición del círculo
    circle.draw(); // Dibuja el círculo
  });

  requestAnimationFrame(animate); // Llama a la siguiente actualización
}

// Iniciar los círculos y la animación
createCircles(10); // Crear 10 círculos inicialmente
animate();
