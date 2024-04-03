import { Server } from 'socket.io';

class User {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(width, height) {
    this.y = height / 2 - 50;
    this.x = width * 0;
    this.width = 15;
    this.height = 100 - 15;
    this.color = '#FD0363';
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

  constructor(width, height) {
    this.x = width - 15;
    this.y = height / 2 - 50;
    this.width = 15;
    this.height = 100 - 15;
    this.color = '#FD0363';
    this.score = 0;
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

  constructor(width, height) {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 10;
    this.color = '#FDA403';
    this.speed = 4;
    this.vx = 5;
    this.vy = 5;
  }
}

export class Game {
  user: User;
  computer: Computer;
  server: Server;
  ball: Ball;
  roomId: string;
  width: number;
  height: number;

  constructor(server: Server, roomId: string) {
    this.width = 600;
    this.height = 400;
    this.server = server;
    this.roomId = roomId;
    this.user = new User(this.width, this.height);
    this.computer = new Computer(this.width, this.height);
    this.ball = new Ball(this.width, this.height);
    this.server.on('message', (comp) => {
      this.computer.y = comp.y;
    });
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
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    const oldx = -this.ball.vx;
    const oldy = this.ball.vy;
    this.ball.vy = 0;
    this.ball.vx = 0;

    setTimeout((vx = oldx, vy = oldy) => {
      this.ball.vx = vx;
      this.ball.vy = vy;
      this.ball.speed = 5;
    }, 2000);
  }

  update() {
    // if (this.user.score === 5 || this.computer.score === 5) {
    //   this.server
    //     .to(this.roomId)
    //     .emit('message', this.user, this.computer, this.ball);
    // } else
    {
      if (this.ball.x - this.ball.r < 0) {
        this.computer.score++;
        this.resetBall();
      } else if (this.ball.x + this.ball.r > this.width) {
        this.user.score++;
        this.resetBall();
      }

      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;
      if (
        this.ball.y + this.ball.r + 1 > this.height ||
        this.ball.y - this.ball.r + 1 < 0
      )
        this.ball.vy = -this.ball.vy;

      const player: User | Computer =
        this.ball.x + this.ball.r < this.width / 2 ? this.user : this.computer;

      if (this.collision(this.ball, player)) {
        let collidePoint: number = this.ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        const angle = (Math.PI / 4) * collidePoint;

        const direction: 1 | -1 = this.ball.x < this.width / 2 ? 1 : -1;
        this.ball.vx = direction * this.ball.speed * Math.cos(angle);
        this.ball.vy = this.ball.speed * Math.sin(angle);
        this.ball.speed += 0.1;
      }
    }
  }
  render() {
    this.server
      .to(this.roomId)
      .emit('render', this.user.score, this.computer.score, this.ball);
    this.update();
  }

  stop(): void {
    console.log('stop');
  }
}
