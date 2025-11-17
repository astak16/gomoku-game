# Gomoku Game (五子棋游戏)

A web-based Gomoku (Five in a Row) game built with vanilla JavaScript and HTML5 Canvas.

## Features

- 15x15 game board
- Two-player gameplay (Black vs White)
- Win detection for 5 consecutive pieces in any direction
- Beautiful gradient styling and responsive design
- Reset functionality

## How to Play

### 方法 1: 直接打开 (推荐)
直接在浏览器中打开 `index.html` 文件即可开始游戏。

### 方法 2: 使用本地服务器
如果需要使用本地服务器:
```bash
npm run serve
```
然后在浏览器访问 http://localhost:8000

## 游戏规则

1. 黑方先行
2. 点击棋盘任意交叉点下棋
3. 先在横向、纵向或对角线连成五子者获胜
4. 点击"重新开始"按钮开始新的一局

## Project Structure

```
gomoku-game/
├── game.js           # 游戏逻辑
├── index.html        # 页面布局
├── styles.css        # 样式文件
├── package.json      # 项目配置
└── README.md         # 说明文档
```

## Technologies Used

- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- CSS3
