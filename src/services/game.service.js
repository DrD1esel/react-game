import asphaltTexture from '../images/asphalt.jpg';
import grassTexture from '../images/grass.jpg';
import carTexture from '../images/car.png';
import obstacleTexture from '../images/obstacle.png';

export default class GameService {
  constructor(canvasElement, carCanvas) {
    this.carCanvas = carCanvas;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctxCar = this.carCanvas.getContext('2d');
    this.asphaltImg = null;
    this.grassImg = null;
    this.carImg = null;
    this.obstacleImg = null;
    this.speed = 4;
    this.asphaltShift = 0;
    this.distance = 0;
    this.obstacles = [];
    this.lastObstacleDistance = 0;
    this.pause = false;
    this.booster = 10;
    this.isBoost = false;
    this.isAutoPilot = false;
    this.initGame();
    this.initListeners();
  }

  initListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (e) => {
    
    if (e.key === 'e') {
      this.isAutoPilot = !this.isAutoPilot;
    }
    if(this.isAutoPilot) {
      return;
    }
    if (e.key === 'a' && !this.carRaf && !this.pause) {
      this.carXto = this.carXmin;
    }
    if (e.key === 'd' && !this.carRaf && !this.pause) {
      this.carXto = this.carXmax;
    }
    if (!this.carRaf) {
      this.turnCar();
    }

    if (e.key === 'w') {
      this.speed += 2;
    }
    if (e.key === 's') {
      this.speed -= this.speed > 3 ? 2 : 0;
    }
    if (e.key === 'r') {
      console.log(this.distance);
    }
    if (e.key === ' ' && !this.isBoost) {
      this.speed += this.booster;
      this.isBoost = true;
    }
    if (e.key === 'q') {
      this.pause = !this.pause;
      if (!this.pause) {
        requestAnimationFrame(this.drawRoad);
      }
    }
  };

  handleKeyUp = (e) => {
    
    if(this.isAutoPilot) {
      return;
    }
    if (e.key === 'a' || e.key === 'd') {
      this.carXto = this.carX;
      this.drawCar();
      this.carRaf = null;
    }
    if (e.key === ' ' && this.isBoost) {
      this.speed -= this.booster;
      this.isBoost = false;
    }
  };

  initGame() {
    const clientRect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.floor(
      (2500 * clientRect.width) / clientRect.height
    );
    this.canvas.height = 2500;
    this.carCanvas.width = this.canvas.width;
    this.carCanvas.height = this.canvas.height;
    this.carY = this.carCanvas.height - 350;
    this.initAsphalt();
    this.initGrass();
    this.initCar();
    this.initObstacle();
    this.drawRoad();
  }

  initAsphalt = () => {
    const img = new Image();
    img.onload = () => {
      this.asphaltImg = img;
      this.asphaltX = Math.floor((this.canvas.width - img.width) / 2);
      this.carX = this.asphaltX + 50;
      this.carXmax = this.asphaltX + this.asphaltImg.width - 150;
      this.carXmin = this.asphaltX;
      this.lines = [
        { x: this.asphaltX + 60 },
        { x: this.asphaltX + 280 },
        { x: this.asphaltX + 500 },
      ];
    };
    img.src = asphaltTexture;
  };

  initGrass = () => {
    const img = new Image();
    img.onload = () => {
      this.grassImg = img;
    };
    img.src = grassTexture;
  };

  initCar = () => {
    const img = new Image();
    img.onload = () => {
      this.carImg = img;
      this.drawCar();
    };
    img.src = carTexture;
  };

  initObstacle = () => {
    const img = new Image();
    img.onload = () => {
      this.obstacleImg = img;
      console.log(img.width);
    };
    img.src = obstacleTexture;
  };

  drawRoad = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.distance += this.speed;
    this.asphaltShift = (this.asphaltShift + this.speed) % 257;
    for (let i = -257 + this.asphaltShift; i < this.canvas.height; i += 257) {
      if (this.grassImg) {
        let x = 0;
        while (x < this.canvas.width) {
          this.ctx.drawImage(this.grassImg, x, i);
          x += this.grassImg.width;
        }
      }
      if (this.asphaltImg) {
        this.ctx.drawImage(this.asphaltImg, this.asphaltX, i);
      }
    }
    this.drawObstacles();
    if (!this.pause) {
      requestAnimationFrame(this.drawRoad);
    }
  };

  drawObstacles = () => {
    this.ctx.fillStyle = 'red';
    if (!this.obstacleImg) {
      return;
    }
    this.checkCollisions();
    this.obstacles.forEach((obstacle) => {
      this.ctx.drawImage(
        this.obstacleImg,
        this.lines[obstacle.line].x,
        obstacle.y + 20
      );
      obstacle.y += this.speed;
    });
    if (this.lastObstacleDistance + 2500 < this.distance) {
      this.createObstacle();
    }
    this.cleanObstacles();
    if (this.isAutoPilot) {
      this.autoPilot();
    }
  };

  drawCar = () => {
    this.ctxCar.clearRect(0, 0, this.carCanvas.width, this.carCanvas.height);
    if (this.carImg) {
      this.ctxCar.save();
      if (this.carXto > this.carX) {
        this.ctxCar.translate(this.carX + 75, this.carCanvas.height - 170);
        this.ctxCar.rotate((5 * Math.PI) / 180);

        this.ctxCar.translate(-this.carX - 75, -this.carCanvas.height + 170);
      }
      if (this.carXto < this.carX) {
        this.ctxCar.translate(this.carX + 75, this.carCanvas.height - 170);
        this.ctxCar.rotate((-5 * Math.PI) / 180);

        this.ctxCar.translate(-this.carX - 75, -this.carCanvas.height + 170);
      }
      this.ctxCar.drawImage(this.carImg, this.carX, this.carY);

      this.ctxCar.restore();
    }
  };

  createObstacle = () => {
    const chance = Math.floor(Math.floor(Math.random() * 2));
    if (chance) {
      return;
    }
    this.obstacles.push({ line: Math.floor(Math.random() * 3), y: -50 });
    this.lastObstacleDistance = this.distance - 50;
  };

  cleanObstacles = () => {
    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.y < this.canvas.height
    );
  };

  checkCollisions = () => {
    if (!this.carImg || !this.obstacleImg) {
      return;
    }
    const carEndX = this.carX + this.carImg.width;
    const carEndY = this.carY + this.carImg.height;
    this.obstacles.forEach((obstacle) => {
      const startX = this.lines[obstacle.line].x;
      const endX = startX + this.obstacleImg.width;
      const startY = obstacle.y;
      const endY = obstacle.y + this.obstacleImg.height;
      if (
        ((this.carX < endX && this.carX > startX) ||
          (carEndX < endX && carEndX > startX)) &&
        ((this.carY < endY && carEndY > endY) ||
          (this.carY < startY && carEndY > startY))
      ) {
        this.pause = true;
      }
    });
  };

  turnCar = () => {
    if (this.carXto !== this.carX) {
      if (this.carXto > this.carX && !this.pause) {
        this.carX =
          this.carX + this.speed / 2 < this.carXto
            ? this.carX + this.speed / 2
            : this.carXto;
      } else if (this.carXto < this.carX && !this.pause) {
        this.carX =
          this.carX - this.speed / 2 > this.carXto
            ? this.carX - this.speed / 2
            : this.carXto;
      }
      this.drawCar();
      this.carRaf = requestAnimationFrame(this.turnCar);
    } else {
      this.carRaf = null;
    }
  };

  autoPilot = () => {
    const obstacle = this.getNearestObstacle();
    if (obstacle && obstacle.y > 0 && !this.carRaf) {
      if (obstacle.line !== 2) {
        this.carXto = this.lines[obstacle.line + 1].x;
      } else {
        this.carXto = this.lines[1].x;
      }
      this.turnCar();
    }
  };

  getNearestObstacle = () => {
    if (this.obstacles.length) {
      return this.obstacles.reduce((nearest, curr) =>
        nearest.y > curr.y ? nearest : curr
      );
    }
  };
}
