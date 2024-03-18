import { Socket } from "socket.io-client";

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
    this.speed = 7;
    this.vx = 5;
    this.vy = 5;
  }
}

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | any;
  user: User;
  computer: Computer;
  net: Net;
  ball: Ball;
  intervalId: NodeJS.Timeout | any;
  socket: any;
  roomId: String;

  constructor(
    canvas: HTMLCanvasElement,
    socket: Socket,
    roomId: string,
    index: number
  ) {
    this.socket = socket;
    this.roomId = roomId;
    this.user = new User(canvas);
    this.computer = new Computer(canvas);
    this.net = new Net(canvas);
    this.ball = new Ball(canvas);
    this.ball.vx *= index;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    socket.on("message", (comp) => {
      this.computer.y = comp.y;
      if(this.computer.score < comp.score)
        this.computer.score = comp.score;
      else
        socket.emit("message", { user: this.user, id: roomId });
    });

    socket.on("ball", (ball) => {
      if (ball.x > this.canvas.width / 2) {
        this.ball = ball;
        this.ball.x = this.canvas.width / 2 - (ball.x - this.canvas.width / 2);
        this.ball.vx = -ball.vx;
      }
    });

    socket.on("start", () => {
      console.log("starting");
      setTimeout(() => this.render(), 2000);
    });

    socket.on("win", () => {
      clearTimeout(this.intervalId);
      this.drawRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
        "rgba(0, 0, 0, 0.3)"
      );
      this.drawText(
        "you_win",
        this.canvas.width / 2.79,
        this.canvas.height / 2,
        "#BFFF3C"
      );
      // right click to go back to dashboard
      this.canvas.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        window.location.reload();
      });
      // left click to restart game
      this.canvas.addEventListener("click", () => {
        window.location.replace("/dashboard");
      });
    });

    socket.on("lose", () => {
      clearTimeout(this.intervalId);
      this.drawRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
        "rgba(0, 0, 0, 0.3)"
      );
      this.drawText(
        "you_lose",
        this.canvas.width / 2.79,
        this.canvas.height / 2,
        "#BFFF3C"
      );
      // right click to go back to dashboard
      this.canvas.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        window.location.reload();
      });
      // left click to restart game
      this.canvas.addEventListener("click", (evt) => {
        evt.preventDefault();
        window.location.replace("/dashboard");
      });
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      const rect = canvas.getBoundingClientRect();
      this.user.y = evt.clientY - rect.top - this.user.height / 2;
      socket.emit("message", { user: this.user, id: roomId });
      //socket.emit("ball", { ball: this.ball, id: this.roomId });
    });
  }

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
  clearCirecle(x: number, y: number, r: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawText(text: number | string, x: number, y: number, color: string) {
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
    // i want to sleep for 1 second
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    const oldx = -this.ball.vx;
    const oldy = this.ball.vy;
    this.ball.vy = 0;
    this.ball.vx = 0;

    setTimeout((vx = oldx, vy = oldy) => {
      this.ball.vx = vx;
      this.ball.vy = vy;
      this.ball.speed = 7;
    }, 2000);
  }

  update() {
    if (this.user.score === 5 || this.computer.score === 5) {
      const state = this.user.score === 5 ? "win" : "lose";
      console.log("state is:", state);
      clearInterval(this.intervalId);
      this.render();
      if (state === "lose") this.socket.emit("lose", { id: this.roomId });
    } else {
      if (this.ball.x - this.ball.r < 0) {
        this.computer.score++;
        this.resetBall();
      } else if (this.ball.x + this.ball.r > this.canvas.width) {
        this.user.score++;
        this.resetBall();
      }
      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;
      //this.socket.emit("ball", { ball: this.ball , id: this.roomId });
      if (
        this.ball.y + this.ball.r > this.canvas.height ||
        this.ball.y - this.ball.r < 0
      )
        this.ball.vy = -this.ball.vy;

      const player: User | Computer =
        this.ball.x + this.ball.r < this.canvas.width / 2
          ? this.user
          : this.computer;

      if (this.collision(this.ball, player)) {
        let collidePoint: number = this.ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        const angle = (Math.PI / 4) * collidePoint;

        const direction: 1 | -1 = this.ball.x < this.canvas.width / 2 ? 1 : -1;
        this.ball.vx = direction * this.ball.speed * Math.cos(angle);
        this.ball.vy = this.ball.speed * Math.sin(angle);

        this.ball.speed += 0.1;
        this.socket.emit("ball", { ball: this.ball, id: this.roomId });
      }
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
    this.intervalId = setInterval(game, 1000 / 60);
  }
}

export default Game;
