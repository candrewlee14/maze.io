const EllipseOrLine = require('./ellipseorline.js');
module.exports =
    class Maze {
        constructor(x, y, width, height, cellsX, cellsY) {
            if (arguments.length > 0){
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.cellsX = cellsX;
                this.cellsY = cellsY;
                this.maze = this.makeGrid(x, y, width, height, cellsX, cellsY);
                this.aldousBroderCarvePath(1, 1);
                this.openEnds();
            }
        }


        convertFromObj(obj) {
            for (var prop in obj) {
                if (prop == "maze") {
                    this.maze = this.makeGrid(obj['x'], obj['y'], obj['width'], obj['height'], obj['cellsX'], obj['cellsY']);
                    for (var y = 0; y < obj['maze'].length; y++) {
                        for (var x = 0; x < obj['maze'][0].length; x++) {
                            this.maze[y][x].convertFromObj(obj[prop][y][x]);
                        }
                    }
                } else {
                    this[prop] = obj[prop];
                }
            }
        }

        makeGrid(x, y, width, height, cellsX, cellsY) {
            this.cellsX = cellsX - cellsX % 2;
            this.cellsY = cellsY - cellsY % 2;
            let wholeMaze = [];
            for (var posY = 0; posY <= cellsY; posY++) {
                let row = [];
                for (var posX = 0; posX <= cellsX; posX++) {
                    if (posY % 2 == 0 && posX % 2 == 0) {
                        row.push(new EllipseOrLine(x + posX * (width / cellsX), y + posY * (height / cellsY), 1, 1, 1));
                    } else if (posY % 2 == 0 && posX % 2 == 1) {
                        row.push(new EllipseOrLine(x + (posX + 1) * (width / cellsX), y + posY * (height / cellsY), x + (posX - 1) * (width / cellsX), y + posY * (height / cellsY), 2, width, height));
                    } else if (posY % 2 == 1 && posX % 2 == 0) {
                        row.push(new EllipseOrLine(x + posX * (width / cellsX), y + (posY + 1) * (height / cellsY), x + posX * (width / cellsX), y + (posY - 1) * (height / cellsY), 2, width, height));
                    } else {
                        //these will all be gone once the algorithm goes through and carves the maze
                        row.push(new EllipseOrLine(x + (posX) * (width / cellsX), y + (posY) * (height / cellsY), 0, 0, 1));
                    }
                }
                wholeMaze.push(row);
            }
            return wholeMaze;
        }

        aldousBroderCarvePath(x, y) {
            var treadedCount = 0;
            var h = this.cellsY;
            var w = this.cellsX;
            var totalCells = Math.floor(h / 2) * Math.floor(w / 2);

            treadedCount++;
            this.maze[y][x].type = 3;


            while (treadedCount < totalCells) {
                if (x == 49) {
                    console.log("");
                }
                var direction = Math.floor(Math.random() * 3.999);
                var directionOptions = [false, false, false, false];

                directionOptions[0] = (x + 2) < w;
                directionOptions[1] = (x - 2) > 0;
                directionOptions[2] = (y + 2) < h;
                directionOptions[3] = (y - 2) > 0;

                if (!directionOptions[direction]) {
                    direction = -1;
                    for (var i = 0; i < directionOptions.length; i++) {
                        if (directionOptions[i]) {
                            direction = i;
                            break;
                        }
                    }
                    if (direction == -1) {
                        System.out.println("NO PATHS WERE POSSIBLE");
                        break;
                    }
                }


                if (this.carvePathBetween(direction, x, y)) {
                    treadedCount++;
                    console.log(x + ", " + y + "  " + treadedCount);
                    //printCharMatrix(charMatrix);
                }

                if (direction == 0) {
                    x += 2;
                } else if (direction == 1) {
                    x -= 2;
                } else if (direction == 2) {
                    y += 2;
                } else if (direction == 3) {
                    y -= 2;
                }

            }
            return [w, h];
        }

        carvePathBetween(direction, x, y) {
            if (direction == 0) {
                if (this.maze[y][x + 2].type == 3)
                    return false;
                this.maze[y][x + 1].type = 3;
                this.maze[y][x + 2].type = 3;
            } else if (direction == 1) {
                if (this.maze[y][x - 2].type == 3)
                    return false;
                this.maze[y][x - 1].type = 3;
                this.maze[y][x - 2].type = 3;

            } else if (direction == 2) {
                if (this.maze[y + 2][x].type == 3)
                    return false;
                this.maze[y + 1][x].type = 3;
                this.maze[y + 2][x].type = 3;


            } else if (direction == 3) {
                if (this.maze[y - 2][x].type == 3)
                    return false;
                this.maze[y - 1][x].type = 3;
                this.maze[y - 2][x].type = 3;

            }
            return true;
        }

        openEnds() {
            this.maze[0][1].type = 3;
            this.maze[this.cellsY][this.cellsX - 1].type = 3;

        }
        display(sk) {
            for (var posY = 0; posY <= this.cellsY; posY++) {
                for (var posX = 0; posX <= this.cellsX; posX++) {
                    this.maze[posY][posX].display(sk);
                }
            }
        }

    }