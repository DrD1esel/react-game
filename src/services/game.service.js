import asphaltTexture from '../images/asphalt.jpg';
import grassTexture from '../images/grass.jpg';
import carTexture from '../images/car.png';

export default class GameService {
  constructor(canvasElement, carCanvas) {
    this.carCanvas = carCanvas;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctxCar = this.carCanvas.getContext('2d');
    this.asphaltImg = null;
    this.grassImg = null;
    this.carImg = null;
    this.carX = 700;
    this.carXmax = 1200;
    this.carXmin = 650;
    this.speed = 4;
    this.asphaltShift = 0;
    this.distance = 0;
    this.obstacles = [];
    this.lastObstacleDistance = 0;
    this.pause = false;
    this.lines = [{ x: 680 }, { x: 900 }, { x: 1120 }];
    this.initGame();
    this.initListeners();
  }

  initListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (e) => {
    if (e.key === 'a' && !this.carRaf) {
      this.carXto = this.carXmin;
    }
    if (e.key === 'd' && !this.carRaf) {
      this.carXto = this.carXmax;
    }
    if (!this.carRaf) {
      this.turnCar();
    }

    if (e.key === 'w') {
      this.speed++;
    }
    if (e.key === 's') {
      this.speed -= this.speed > 2 ? 1 : 0;
    }
    if (e.key === 'q') {
      this.pause = !this.pause;
      if (!this.pause) {
        requestAnimationFrame(this.drawRoad);
      }
    }
  };

  handleKeyUp = (e) => {
    if (e.key === 'a' || e.key === 'd') {
      this.carXto = this.carX;
      this.drawCar();
      this.carRaf = null;
    }
  };

  initGame() {
    console.log(window.screen);
    const clientRect = this.canvas.getBoundingClientRect();
    console.log(clientRect)
    this.canvas.width = Math.floor((2500 * clientRect.width) / clientRect.height);
    this.canvas.height = 2500;
    this.carCanvas.width = this.canvas.width;
    this.carCanvas.height = this.canvas.height;
    this.initAsphalt();
    this.initGrass();
    this.initCar();
    this.drawRoad();
  }

  initAsphalt = () => {
    const img = new Image();
    img.onload = () => {
      this.asphaltImg = img;
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

  drawRoad = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.distance += this.speed;
    this.asphaltShift = (this.asphaltShift + this.speed) % 257;
    for (let i = -257 + this.asphaltShift; i < this.canvas.height; i += 257) {
      if (this.grassImg) {
        this.ctx.drawImage(this.grassImg, 0, i);
      }
      if (this.asphaltImg) {
        this.ctx.drawImage(this.asphaltImg, 638, i);
      }
    }
    this.drawObstacles();
    if (!this.pause) {
      requestAnimationFrame(this.drawRoad);
    }
  };

  drawObstacles = () => {
    this.ctx.fillStyle = 'red';
    this.obstacles.forEach((obstacle) => {
      this.ctx.fillRect(this.lines[obstacle.line].x, obstacle.y, 150, 50);
      obstacle.y += this.speed;
    });
    if (this.lastObstacleDistance + 1000 < this.distance) {
      this.createObstacle();
    }
    this.cleanObstacles();
  };

  drawCar = () => {
    this.ctxCar.clearRect(0, 0, this.carCanvas.width, this.carCanvas.height);
    if (this.carImg) {
      this.ctxCar.save();
      if (this.carXto > this.carX) {
        this.ctxCar.translate(this.carX + 75, this.carCanvas.height - 150);
        this.ctxCar.rotate((5 * Math.PI) / 180);

        this.ctxCar.translate(-this.carX - 75, -this.carCanvas.height + 150);
      }
      if (this.carXto < this.carX) {
        this.ctxCar.translate(this.carX + 75, this.carCanvas.height - 150);
        this.ctxCar.rotate((-5 * Math.PI) / 180);

        this.ctxCar.translate(-this.carX - 75, -this.carCanvas.height + 150);
      }
      this.ctxCar.drawImage(this.carImg, this.carX, this.carCanvas.height - 350);

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
    this.obstacles = this.obstacles.filter((obstacle) => obstacle.y < this.ctx.height);
  };

  turnCar = () => {
    if (this.carXto !== this.carX) {
      if (this.carXto > this.carX) {
        this.carX = this.carX + this.speed / 2 < this.carXto ? this.carX + this.speed / 2 : this.carXto;
      } else if (this.carXto < this.carX) {
        this.carX = this.carX - this.speed / 2 > this.carXto ? this.carX - this.speed / 2 : this.carXto;
      }
      this.drawCar();
      this.carRaf = requestAnimationFrame(this.turnCar);
    } else {
      this.carRaf = null;
    }
  };
}
