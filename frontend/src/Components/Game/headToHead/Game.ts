import { Socket } from "socket.io-client";
import IMG from "../images/table-tennis-ping-pong.jpg";

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
  img: HTMLImageElement;
  rotation: number; // New property to store rotation angle
  isDragging: boolean;
  dragStartY = 0;

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
    this.img = new Image();
    this.img.src = IMG;
    this.rotation = 0; // Initialize rotation angle to 0
    this.isDragging = false;
    // Mouse position when the drag starts
    this.dragStartY = 0;

    // this.rotateCanvas(-90);
    socket.on("render", (userScore, compScore, ball) => {
      this.ball = ball;
      if (index === 1) {
        this.user.score = userScore;
        this.computer.score = compScore;
      } else {
        this.user.score = compScore;
        this.computer.score = userScore;
        this.ball.x = this.canvas.width - ball.x;
      }
      this.render();
    });

    socket.on("move", (y) => {
      this.computer.y = y;
      this.render();
    });

    //    this.canvas.addEventListener("mousemove", this.handleMouseMove);
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

      // Emit move event
      this.socket.emit("moves", {
        y: this.user.y,
        id: this.roomId,
        index: this.index,
      });
    }
  };

  // Event listener for mouseup event
  handleMouseUp = () => {
    this.isDragging = false;
  };

  rotateCanvas(angle: number) {
    this.rotation += angle; // Update rotation angle
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2); // Translate origin to canvas center
    this.ctx.rotate((angle * Math.PI) / 180); // Rotate canvas
    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2); // Translate origin back to top-left corner
    this.render(); // Re-render game elements
  }
  drawImage() {
    console.log("draw image");
    const img = new Image();
    img.src = IMG;
    img.onload = () => {
      this.img = img;
    };
    this.img = img;
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
    //this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

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
