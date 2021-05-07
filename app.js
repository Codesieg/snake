window.onload = function() {

    let canvas;
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    let ctx;
    let delay = 100;
    let snakee;
    let newDirection;
    let applee;
    let widthInBlocks = canvasWidth / blockSize;
    let heigthInBlocks = canvasHeight / blockSize;
    let score = 0;
    let centreX = canvasWidth / 2;
    let centreY = canvasHeight / 2;
    let timeout;


    document.onkeydown = ('onkeydown', handleKeyDown);

    init();

    function init() {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '30px solid grey';
        document.querySelector('.wrapper').appendChild(canvas);
        ctx = canvas.getContext('2d');
        canvas.style.margin = "50px";
        canvas.style.backgroundColor = "#ddd";
        newDirection = 39;
        console.log("nouvelle direction : " + newDirection);
        startGame();
    }

    function refreshCanvas() {

        snakee.walk(newDirection);
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.eatApple(applee)) {
                snakee.eatingApple = true;
                score++;
                do {
                    applee.setNewPosition();
                }
                while (applee.isOnSnake(snakee))

                if (score % 5 == 0) {
                    console.log("accelearation : " + score % 5);
                    speedUp();
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawScore();
            applee.draw();
            snakee.draw();
            timeout = setTimeout(refreshCanvas, delay);
        }
    }

    function speedUp() {
        delay /= 1.5;
    }

    function gameOver() {
        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "red"
        ctx.textAlign = "center";
        ctx.strokeText("GAME OVER", centreX, centreY - 180)
        ctx.fillText("GAME OVER", centreX, centreY - 180);
        ctx.fillText("Appuyer sur espace pour rejouer", centreX, centreY - 120);
        ctx.strokeText("Appuyer sur espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    function startGame() {
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4]
        ]);
        applee = new Apple([12, 5]);
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();

        ctx.textBaseline = 'middle';
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "grey"
        ctx.textAlign = "center";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);

    }
    // Déclaration de mon nouvel objet snakee
    function Snake(body) {
        this.body = body;
        this.eatingApple = false;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.walk = function(setDirection) {
            console.log("direction definit : " + setDirection);
            var nextPosition = this.body[0].slice();
            if (setDirection == 37 && setDirection != 39) {
                nextPosition[0] -= 1;
            } else if (setDirection == 39) {
                nextPosition[0] += 1;
            } else if (setDirection == 40) {
                nextPosition[1] += 1;
            } else if (setDirection == 38) {
                nextPosition[1] -= 1;
            }
            this.body.unshift(nextPosition);
            if (!this.eatingApple) {
                this.body.pop();
            } else {
                this.eatingApple = false;
            }

        }
        this.checkCollision = function() {
            let wallCollision = false;
            // console.log("wallCallision : " + wallCollision);
            let bodyCollision = false;
            let snakeHead = this.body[0];
            let bodySnake = this.body.slice(1);
            let snakeX = snakeHead[0];
            let snakeY = snakeHead[1];
            const minX = 0;
            const minY = 0;
            const maxX = widthInBlocks - 1;
            const maxY = heigthInBlocks - 1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            // console.log("wallCallision : " + isNotBetweenHorizontalWalls);

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
                // console.log("wallCallision : " + wallCollision)
            }

            for (let index = 0; index < bodySnake.length; index++) {

                if (snakeX == bodySnake[index][0] && snakeY == bodySnake[index][1]) {
                    bodyCollision = ture;
                    // console.log("bodyCollision : " + bodyCollision);
                }
            }
            return wallCollision || bodyCollision;
        };

        this.eatApple = function(apple) {
            const snakeHead = this.body[0];
            if (snakeHead[0] == apple.position[0] && snakeHead[1] == apple.position[1]) {
                return true;
            } else {
                return false;
            }
        };
    }

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            var x = this.position[0] * blockSize;
            var y = this.position[1] * blockSize;
            ctx.fillRect(x, y, blockSize, blockSize);
            ctx.restore();
        };
        this.setNewPosition = function() {
            this.position = [getRandomInt(29), getRandomInt(19)];
        }

        this.isOnSnake = function(snake) {
            let isOnSnake = false;
            for (let index = 0; index < snake.body.length; index++) {
                if (this.position[0] == snake.body[index][0] && this.position[1] == snake.body[index][1]) {
                    isOnSnake = true;
                }
            }

            return isOnSnake;
        }
    }

    function handleKeyDown(event) {
        let keyPress = event.keyCode;
        switch (keyPress) {
            case 37:
                console.log('vers la gauche');
                if (newDirection != 39) {
                    newDirection = 37;
                }
                break;
            case 38:
                console.log('vers le haut ');
                if (newDirection != 40) {
                    newDirection = 38;
                }
                break;
            case 39:
                console.log('vers la droite ');
                if (newDirection != 37) {
                    newDirection = 39;
                }
                break;
            case 40:
                console.log('vers le bas ');
                if (newDirection != 38) {
                    newDirection = 40;
                }
                break;
            case 32:
                console.log('epace ');
                startGame();
                break;
            default:
                return;
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}