(function () {
    // 获取canvas元素和上下文
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');

    // 设置canvas尺寸为窗口大小
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 创建星星对象构造函数
    function Star(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.opacity = Math.random() * 0.5 + 0.1; // 随机透明度
    }

    Star.prototype.draw = function () {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    };

    Star.prototype.update = function () {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.radius * 2;
            this.x = Math.random() * canvas.width;
        }
        this.draw();
    };

    // 创建星星数组并填充星星对象
    let stars = [];
    function createStars(num) {
        for (let i = 0; i < num; i++) {
            let star = new Star(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 1 + 0.3, // 星星半径范围在0.3到1.3之间
                Math.random() * 1 + 0.3 // 星星速度范围在0.3到1.3像素每帧
            );
            stars.push(star);
        }
    }
    createStars(80); // 创建80颗星星

    // 动画循环
    function animate() {
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();