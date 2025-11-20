class GomokuGame {
    constructor(canvas, playerIndicator, gameStatus) {
        this.boardSize = 15;
        this.canvas = canvas;
        this.playerIndicator = playerIndicator;
        this.gameStatus = gameStatus;
        this.ctx = canvas.getContext('2d');

        if (!this.ctx) {
            throw new Error('Could not get 2D context from canvas');
        }

        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;

        this.resizeCanvas();
        this.initBoard();
        this.drawBoard();
        this.updatePlayerIndicator();
    }

    resizeCanvas() {
        // 获取canvas的CSS渲染尺寸
        const rect = this.canvas.getBoundingClientRect();
        const size = Math.min(rect.width, 600); // 最大600px

        // 设置canvas的实际像素尺寸，考虑设备像素比以获得清晰显示
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;

        // 缩放canvas上下文以匹配设备像素比
        this.ctx.scale(dpr, dpr);

        // 设置CSS尺寸
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';

        // 更新单元格大小
        this.cellSize = size / this.boardSize;
    }

    initBoard() {
        this.board = Array.from({ length: this.boardSize }, () =>
            Array(this.boardSize).fill(null)
        );
    }

    drawBoard() {
        // 绘制背景
        const size = this.cellSize * this.boardSize;
        this.ctx.fillStyle = '#dcb35c';
        this.ctx.fillRect(0, 0, size, size);

        // 绘制网格线
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.boardSize; i++) {
            // 横线
            this.ctx.beginPath();
            this.ctx.moveTo(this.cellSize / 2, i * this.cellSize + this.cellSize / 2);
            this.ctx.lineTo(
                size - this.cellSize / 2,
                i * this.cellSize + this.cellSize / 2
            );
            this.ctx.stroke();

            // 竖线
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize + this.cellSize / 2, this.cellSize / 2);
            this.ctx.lineTo(
                i * this.cellSize + this.cellSize / 2,
                size - this.cellSize / 2
            );
            this.ctx.stroke();
        }

        // 绘制星位
        const starPoints = [
            { row: 3, col: 3 },
            { row: 3, col: 11 },
            { row: 7, col: 7 },
            { row: 11, col: 3 },
            { row: 11, col: 11 },
        ];

        this.ctx.fillStyle = '#000';
        starPoints.forEach(({ row, col }) => {
            this.ctx.beginPath();
            this.ctx.arc(
                col * this.cellSize + this.cellSize / 2,
                row * this.cellSize + this.cellSize / 2,
                4,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });

        // 绘制所有棋子
        this.drawPieces();
    }

    drawPieces() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.board[row][col];
                if (cell) {
                    this.drawPiece(row, col, cell);
                }
            }
        }
    }

    drawPiece(row, col, player) {
        const x = col * this.cellSize + this.cellSize / 2;
        const y = row * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize / 2 - 4;

        const gradient = this.ctx.createRadialGradient(
            x - radius / 4,
            y - radius / 4,
            radius / 10,
            x,
            y,
            radius
        );

        if (player === 'black') {
            gradient.addColorStop(0, '#666');
            gradient.addColorStop(1, '#000');
        } else {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = player === 'black' ? '#000' : '#999';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    handleClick(event) {
        if (this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.round(x / this.cellSize - 0.5);
        const row = Math.round(y / this.cellSize - 0.5);

        if (
            row >= 0 &&
            row < this.boardSize &&
            col >= 0 &&
            col < this.boardSize &&
            !this.board[row][col]
        ) {
            this.board[row][col] = this.currentPlayer;
            this.drawBoard();

            if (this.checkWin(row, col)) {
                this.gameOver = true;
                this.showWinner();
            } else if (this.checkDraw()) {
                this.gameOver = true;
                this.showDraw();
            } else {
                this.switchPlayer();
            }
        }
    }

    checkWin(row, col) {
        const directions = [
            { dr: 0, dc: 1 },  // 横向
            { dr: 1, dc: 0 },  // 纵向
            { dr: 1, dc: 1 },  // 对角线 \
            { dr: 1, dc: -1 }, // 对角线 /
        ];

        return directions.some(({ dr, dc }) => {
            return this.countDirection(row, col, dr, dc) >= 5;
        });
    }

    countDirection(row, col, dr, dc) {
        const player = this.board[row][col];
        if (!player) return 0;

        let count = 1;

        count += this.countLine(row, col, dr, dc, player);
        count += this.countLine(row, col, -dr, -dc, player);

        return count;
    }

    countLine(row, col, dr, dc, player) {
        let count = 0;
        let r = row + dr;
        let c = col + dc;

        while (
            r >= 0 &&
            r < this.boardSize &&
            c >= 0 &&
            c < this.boardSize &&
            this.board[r][c] === player
        ) {
            count++;
            r += dr;
            c += dc;
        }

        return count;
    }

    checkDraw() {
        return this.board.every((row) => row.every((cell) => cell !== null));
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updatePlayerIndicator();
    }

    updatePlayerIndicator() {
        this.playerIndicator.textContent = this.currentPlayer === 'black' ? '黑方' : '白方';
        this.playerIndicator.style.color = this.currentPlayer === 'black' ? '#000' : '#666';
    }

    showWinner() {
        const winnerText = this.currentPlayer === 'black' ? '黑方获胜!' : '白方获胜!';
        this.gameStatus.textContent = winnerText;
        this.gameStatus.className = `game-status winner-${this.currentPlayer}`;
    }

    showDraw() {
        this.gameStatus.textContent = '平局!';
        this.gameStatus.className = 'game-status';
    }

    reset() {
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.gameStatus.textContent = '';
        this.gameStatus.className = 'game-status';
        this.initBoard();
        this.drawBoard();
        this.updatePlayerIndicator();
    }

    handleResize() {
        // 重新计算canvas尺寸
        this.resizeCanvas();
        // 重新绘制棋盘（保留当前游戏状态）
        this.drawBoard();
    }
}

// 初始化游戏
const canvas = document.getElementById('game-board');
const resetBtn = document.getElementById('reset-btn');
const playerIndicator = document.getElementById('player-indicator');
const gameStatus = document.getElementById('game-status');

if (!canvas || !resetBtn || !playerIndicator || !gameStatus) {
    throw new Error('Required DOM elements not found');
}

const game = new GomokuGame(canvas, playerIndicator, gameStatus);

resetBtn.addEventListener('click', () => {
    game.reset();
});

canvas.addEventListener('click', (event) => {
    game.handleClick(event);
});

// 监听窗口大小变化
let resizeTimeout;
window.addEventListener('resize', () => {
    // 使用防抖优化性能
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        game.handleResize();
    }, 250);
});
