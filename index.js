"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
var Color;
(function (Color) {
    Color["Reset"] = "\u001B[0m";
    Color["Red"] = "\u001B[31m";
    Color["Green"] = "\u001B[32m";
    Color["Yellow"] = "\u001B[33m";
})(Color || (Color = {}));
class ConsoleColors {
    static logColor(text, color) {
        console.log(color + text + Color.Reset);
    }
    static logRed(text) {
        ConsoleColors.logColor(text, Color.Red);
    }
    static logGreen(text) {
        ConsoleColors.logColor(text, Color.Green);
    }
    static logYellow(text) {
        ConsoleColors.logColor(text, Color.Yellow);
    }
}
class Role {
    constructor(name, health, attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }
    getName() {
        return this.name;
    }
    getHealth() {
        return this.health;
    }
    decreaseHealth(damage) {
        this.health -= damage;
        ConsoleColors.logYellow(`[系統]: ${this.name} 扣 ${damage} 血量，剩餘血量: ${this.health}`);
    }
    attack() {
        return Math.floor(Math.random() * this.attackPower);
    }
    isDead() {
        return this.health <= 0;
    }
}
class User extends Role {
    constructor(name) {
        super(name, 100, 50);
        this.score = 0;
    }
    getScore() {
        return this.score;
    }
    scoring(score) {
        this.score += score;
    }
}
class Boss extends Role {
    constructor(name, health, time, attackPower) {
        super(name, health, attackPower);
        this.time = time;
    }
    generateRandomWord() {
        const words = [
            "apple",
            "banana",
            "cherry",
            "durian",
            "elderberry",
            "fig",
            "grapefruit",
            "honeydew",
            "kiwi",
            "lemon",
            "mango",
            "nectarine",
            "orange",
            "peach",
            "quince",
            "raspberry",
            "strawberry",
            "tangerine",
            "watermelon",
            'cat',
            'dog',
            'book',
            'chair',
            'apple',
            'banana',
            'computer',
            'phone',
            'television',
            'program',
            'algorithm',
            'database',
            'javascript',
            'typescript',
            'python',
            'java',
            'c++',
            'assembly',
            'peripheral',
            'microcontroller',
            'microprocessor',
            'neuroscience',
            'biotechnology',
            'quantum',
            'thermodynamics',
            'chromatography',
            'bioinformatics',
            'heterogeneous',
            'homogeneous',
            'inorganic',
            'organic',
            'spectroscopy',
            'stoichiometry',
            'transcription',
            'translation',
            'recombination',
            'hybridization',
            'phosphorylation',
            'methylation',
            'isomerization',
            'condensation',
            'hydrolysis',
            'respiration',
            'photosynthesis',
            'biosynthesis',
            'transformation',
            'evolution',
            'ecosystem',
        ];
        const index = Math.floor(Math.random() * words.length);
        return words[index];
    }
    getTime() {
        return this.time;
    }
}
class Controller {
    constructor() {
        this.WIN_SCORE = 100;
        this.user = null;
        this.bosses = [
            new Boss("黑暗魔王", 50, 20, 8),
            new Boss("毒蛇魔王", 70, 20, 8),
            new Boss("魔龍王", 90, 20, 8),
            new Boss("鬼面魔王", 110, 40, 12),
            new Boss("火焰魔王", 130, 40, 12),
            new Boss("火焰魔王", 150, 40, 12),
            new Boss("雷電魔王", 170, 40, 15),
            new Boss("地獄魔王", 190, 50, 15),
            new Boss("獨角魔王", 210, 50, 15),
            new Boss("風暴魔王", 230, 70, 15),
        ];
        this.currentLevel = 0;
        this.rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    startGame() {
        console.log("遊戲開始!");
        this.rl.question("請輸入玩家姓名: ", (name) => {
            this.user = new User(name);
            ConsoleColors.logYellow(`[系統]: 玩家 ${this.user.getName()} 血量為 ${this.user.getHealth()}`);
            this.playLevel();
        });
    }
    playLevel() {
        if (this.currentLevel < this.bosses.length) {
            const boss = this.bosses[this.currentLevel];
            const attackWord = boss.generateRandomWord();
            console.log('----------------------');
            ConsoleColors.logYellow(`[系統]: 關卡等級 ${this.currentLevel + 1}, Boss: ${boss.getName()}`);
            console.log(`${boss.getName()} 血量為 ${boss.getHealth()}`);
            const timeoutId = setTimeout(() => {
                // 攻擊失敗
                console.log();
                ConsoleColors.logYellow(`[系統]: 時間到!!!`);
                this.failedToDefeat(boss);
            }, boss.getTime() * 1000);
            this.rl.question(`請輸入攻擊咒語: '${attackWord}', 時間倒數: ${boss.getTime()} 秒:`, (input) => {
                clearTimeout(timeoutId);
                if (input.trim() === attackWord) {
                    // 攻擊成功
                    this.successfullyDefeated(boss);
                }
                else {
                    // 攻擊失敗
                    this.failedToDefeat(boss);
                }
            });
        }
        else {
            ConsoleColors.logGreen(`[系統]: 恭喜通關，總得分: ${this.user.getScore()}`);
            this.rl.close();
        }
    }
    successfullyDefeated(boss) {
        ConsoleColors.logGreen('[系統]: 攻擊成功!!!');
        console.log(`Boss ${boss.getName()} 受到 ${this.user.attack()} 傷害`);
        boss.decreaseHealth(boss.attack());
        if (boss.isDead()) {
            console.log(`成功擊殺 Boss ${boss.getName()}，前往下一關`);
            this.currentLevel++;
            this.user.scoring(this.WIN_SCORE);
        }
        else {
            console.log(`Boss ${boss.getName()} 剩餘 ${boss.getHealth()} 血量`);
        }
        this.playLevel();
    }
    failedToDefeat(boss) {
        ConsoleColors.logRed('[系統]: 攻擊失敗..');
        console.log(`${this.user.getName()} 受到 ${boss.getName()} ${boss.attack()} 傷害`);
        this.user.decreaseHealth(boss.attack());
        if (this.user.isDead()) {
            console.log(`${this.user.getName()}被 Boss ${boss.getName()}擊殺`);
            console.log(`通過關卡數: ${this.currentLevel + 1}，總得分: ${this.user.getScore()}`);
            this.rl.close();
        }
        else {
            this.playLevel();
        }
    }
}
const Game = new Controller();
Game.startGame();
