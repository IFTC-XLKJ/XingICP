const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

class Star {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = Math.random() * 2 + 1;
    }

    update() {
        this.y += this.speed;
        if (this.y > height) {
            this.y = -this.size;
            this.x = Math.random() * width;
            this.speed = Math.random() * 2 + 1;
        }
    }

    draw() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

const stars = [];
const numStars = 100;

for (let i = 0; i < numStars; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 3 + 1;
    stars.push(new Star(x, y, size));
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

animate();