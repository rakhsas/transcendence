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
    this.speed = 4;
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
  socket: Socket;
  roomId: string;
  index: number;

  constructor(
    canvas: HTMLCanvasElement,
    socket: Socket,
    roomId: string,
    index: number
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.index = index;
    this.roomId = roomId;
    this.socket = socket;
    this.net = new Net(canvas);
    this.user = new User(canvas);
    this.computer = new Computer(canvas);
    this.ball = new Ball(canvas);

    socket.on("message", (user, comp, ball) => {
      this.user = user;
      this.computer = comp;
      this.ball = ball;
      this.render();
      if (
        (this.user.score == 5 && this.index === 1) ||
        (this.computer.score == 5 && this.index === 2)
      )
        this.final("win");
      else if (this.user.score == 5 || this.computer.score == 5)
        this.final("lose");
    });

    socket.on("win", () => {
      console.log('win event ')
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
      // left click to restart game
      this.canvas.addEventListener("click", () => {
        window.location.replace("/dashboard");
      });
    });

    socket.on("lose", () => {
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
      // left click to restart game
      this.canvas.addEventListener("click", (evt) => {
        evt.preventDefault();
        window.location.replace("/dashboard");
      });
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      const rect = canvas.getBoundingClientRect();
      if (this.index === 1) {
        this.user.y = evt.clientY - rect.top - this.user.height / 2;
      } else {
        this.computer.y = evt.clientY - rect.top - this.computer.height / 2;
      }
      socket.emit("message", {
        uy: this.user.y,
        cy: this.computer.y,
        id: this.roomId,
      });
    });
  }

  final(s: string): void {
    this.drawRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      "rgba(0, 0, 0, 0.5)"
    );
    this.drawText(
      "you_" + s,
      this.canvas.width / 2.79,
      this.canvas.height / 2,
      "#BFFF3C"
    );
    // left click to restart game
    this.canvas.addEventListener("click", () => {
      window.location.replace("/dashboard");
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

  render() {
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
  }
}

export default Game;
