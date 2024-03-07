import { TimerSharp } from "@mui/icons-material";
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
    this.height = 100;
    this.color = 'white';
    this.score = 0;
  }

};

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
    this.height = 100;
    this.color = 'red';
    this.score = 0;
  }
};


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
    this.color = 'black';
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
    this.color = 'blue';
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


  constructor(canvas: HTMLCanvasElement, socket: Socket) {
    this.user = new User(canvas)
    this.computer = new Computer(canvas)
    this.net = new Net(canvas)
    this.ball = new Ball(canvas)
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    socket.on('catch', (comp, ball, id) => {
      this.computer.y = comp.y;
      this.computer.score = comp.score;
      if (ball.x >= this.canvas.width / 2) {
        this.ball = ball;
        this.ball.x = this.canvas.width / 2 - (ball.x - this.canvas.width / 2);
        this.ball.vx = -ball.vx;
      }

    });
    socket.on('stop', () => {
      this.ball.vx = 0;
      this.ball.vy = 0;

    });

    socket.on('start', () => {
      this.ball.vx = 5;
      this.ball.vy = 5;
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      let rect = canvas.getBoundingClientRect();
      this.user.y = evt.clientY - rect.top - this.user.height / 2;
      socket.emit('push', { user: this.user, ball: this.ball, id: socket.id })
    });
    socket.on('start', () => this.render());
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

  drawText(text: Number, x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.font = " 70px MedievalSharp"
    this.ctx.fillText(text, x, y);

  }

  drawNet() {
    for (let i: number = 0; i <= this.canvas.height; i += 15) {
      this.drawRect(this.net.x, this.net.y + i, this.net.width, this.net.height, this.net.color)
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

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
  }

  resetBall() {
    // i want to sleep for 1 second
    this.ball.x = this.canvas.width / 2
    this.ball.y = this.canvas.height / 2
    let oldx = -this.ball.vx;
    let oldy = this.ball.vy;
    this.ball.vy = 0;
    this.ball.vx = 0;

    setTimeout((vx = oldx , vy = oldy) => {
      this.ball.vx = vx;
      this.ball.vy = vy;
      this.ball.speed = 7;
    }, 2000);
  }


  update() {

    if(this.user.score === 5 || this.computer.score === 5)
    {
      if (this.user.score == 5)
        alert("you win");
      else
        alert("you lose");
      this.user.score = 0;
      this.computer.score = 0;
    }
    else
    {

      if (this.ball.x - this.ball.r < 0) {
        this.computer.score++;
        this.resetBall();

      }
      else if (this.ball.x + this.ball.r > this.canvas.width) {
        this.user.score++;
        this.resetBall();
      }

      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;

      if (this.ball.y + this.ball.r > this.canvas.height || this.ball.y - this.ball.r < 0)
        this.ball.vy = -this.ball.vy;

      let player: User | Computer = (this.ball.x + this.ball.r < this.canvas.width / 2) ? this.user : this.computer;


      if (this.collision(this.ball, player)) {
        let collidePoint: number = (this.ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angle = (Math.PI / 4) * collidePoint;

        let direction: 1 | -1 = (this.ball.x < this.canvas.width / 2) ? 1 : -1;
        this.ball.vx = direction * this.ball.speed * Math.cos(angle);
        this.ball.vy = this.ball.speed * Math.sin(angle);

        this.ball.speed += 0.1;

      }

    }
  }

  render() {
    const game = () => {
      this.update();

      this.drawRect(0, 0, this.canvas.width, this.canvas.height, "#0e9f6e")
      this.drawText(this.user.score, this.canvas.width / 4, this.canvas.height / 5, 'white')
      this.drawText(this.computer.score, 3 * this.canvas.width / 4, this.canvas.height / 5, 'white')
      this.drawNet();
      this.drawRect(this.user.x, this.user.y, this.user.width, this.user.height, this.user.color)
      this.drawRect(this.computer.x, this.computer.y, this.computer.width, this.computer.height, this.computer.color);
      this.drawCirecle(this.ball.x, this.ball.y, this.ball.r, this.ball.color);
    }
    this.intervalId =  setInterval(game, 1000 / 60);
  }
};


export default Game;
