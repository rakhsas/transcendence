class User {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = canvas.height / 2 - 50;
    this.width = 15;
    this.height = 100 - 15;
    this.color = "#FD0363";
    this.score = 0;
  }
}

class Computer {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = canvas.width - 15;
    this.y = canvas.height / 2 - 50;
    this.width = 15;
    this.height = 100 - 15;
    this.color = "#FD0363";
    this.score = 0;
  }
}

class Net {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2 - 1;
    this.y = 0;
    this.width = 2;
    this.height = 10;
    this.color = "white";
  }
}

class Ball {
  x: number;
  y: number;
  r: number;
  color: string;
  speed: number;
  vx: number;
  vy: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.r = 10;
    this.color = "#FDA403";
    this.speed = 5;
    this.vx = 5;
    this.vy = 5;
  }
}

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | any;
  rectX: number;
  user: User;
  computer: Computer;
  net: Net;
  ball: Ball;
  rotation: number; // New property to store rotation angle
  isDragging: boolean;
  dragStartY = 0;
  constructor(canvas: HTMLCanvasElement) {
    this.user = new User(canvas);
    this.computer = new Computer(canvas);
    this.net = new Net(canvas);
    this.ball = new Ball(canvas);
    this.rectX = 0;
       this.rotation = 0; // Initialize rotation angle to 0
    this.isDragging = false;
    // Mouse position when the drag starts
    this.dragStartY = 0;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
  }

  adjustMouseCoordinates(evt) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    const centerY = rect.height / 2;
    // Adjust mouse coordinates based on canvas rotation
    const rotatedMouseY =
      Math.cos(-this.rotation) * (mouseY - centerY) + centerY;

    return {
      y: rotatedMouseY,
    };
  }

  // Event listener for mousedown event
  handleMouseDown = (evt) => {
    const { y } = this.adjustMouseCoordinates(evt);
    this.isDragging = true;
    this.dragStartY = y;
  };

  // Event listener for mousemove event
  handleMouseMove = (evt) => {
    if (this.isDragging) {
      const { y } = this.adjustMouseCoordinates(evt);

      // Calculate the movement distance
      const deltaY = y - this.dragStartY;

      // Update user position based on the movement distance
      this.user.y += deltaY;
      this.dragStartY = y;
    }
  };

  // Event listener for mouseup event
  handleMouseUp = () => {
    this.isDragging = false;
  };

  drawRect(x: number, y: number, w: number, h: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawCirecle(x: number, y: number, r: number, color: string) {
    this.ctx.fillStyle = color;

    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawText(text: Number, x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.font = "50px kenia";
    this.ctx.fillText(text, x, y);
  }

  drawNet() {
    for (let i: number = 0; i <= this.canvas.height; i += 15) {
      this.drawRect(
        this.net.x,
        this.net.y + i,
        this.net.width,
        this.net.height,
        this.net.color
      );
    }
  }

  // collision detection
  collision(b: any, p: any) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;

    return (
      p.left < b.right &&
      p.top < b.bottom &&
      p.right > b.left &&
      p.bottom > b.top
    );
  }

  resetBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    this.ball.vx = -this.ball.vx;
    this.ball.speed = 7;
  }

  update() {
    if (this.ball.x - this.ball.r < 0) {
      this.computer.score++;
      this.resetBall();
    } else if (this.ball.x + this.ball.r > this.canvas.width) {
      this.user.score++;
      this.resetBall();
    }

    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    let computerLevel = 0.1;
    this.computer.y +=
      (this.ball.y - (this.computer.y + this.computer.height / 2)) *
      computerLevel;

    if (
      this.ball.y + this.ball.r > this.canvas.height ||
      this.ball.y - this.ball.r < 0
    )
      this.ball.vy = -this.ball.vy;

    let player: User | Computer =
      this.ball.x + this.ball.r < this.canvas.width / 2
        ? this.user
        : this.computer;

    if (this.collision(this.ball, player)) {
      let collidePoint: number = this.ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);
      let angle = (Math.PI / 4) * collidePoint;

      let direction: 1 | -1 = this.ball.x < this.canvas.width / 2 ? 1 : -1;
      this.ball.vx = direction * this.ball.speed * Math.cos(angle);
      this.ball.vy = this.ball.speed * Math.sin(angle);

      this.ball.speed += 0.1;
    }
  }

  render() {
    const game = () => {
      this.update();

      this.drawRect(0, 0, this.canvas.width, this.canvas.height, "black");
      this.drawText(
        this.user.score,
        this.canvas.width / 4,
        this.canvas.height / 5,
        "#BFFF3C"
      );
      this.drawText(
        this.computer.score,
        (3 * this.canvas.width) / 4,
        this.canvas.height / 5,
        "#BFFF3C"
      );
      this.drawNet();
      this.drawRect(
        this.user.x,
        this.user.y,
        this.user.width,
        this.user.height,
        this.user.color
      );
      this.drawCirecle(
        this.user.x + this.user.width / 2,
        this.user.y,
        this.user.width / 2,
        this.user.color
      );
      this.drawCirecle(
        this.user.x + this.user.width / 2,
        this.user.y + this.user.height,
        this.user.width / 2,
        this.user.color
      );
      this.drawRect(
        this.computer.x,
        this.computer.y,
        this.computer.width,
        this.computer.height,
        this.computer.color
      );
      this.drawCirecle(
        this.computer.x + this.computer.width / 2,
        this.computer.y,
        this.computer.width / 2,
        this.computer.color
      );
      this.drawCirecle(
        this.computer.x + this.computer.width / 2,
        this.computer.y + this.computer.height,
        this.computer.width / 2,
        this.computer.color
      );
      this.drawCirecle(this.ball.x, this.ball.y, this.ball.r, this.ball.color);
    };
    setInterval(game, 1000 / 60);
  }
}

export default Game;
