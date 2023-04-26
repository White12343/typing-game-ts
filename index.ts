import readline from "readline";

enum Color {
  Reset = "\x1b[0m",
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
}

class ConsoleColors {
  static logColor(text: string, color: Color): void {
    console.log(color + text + Color.Reset);
  }

  static logRed(text: string): void {
    ConsoleColors.logColor(text, Color.Red);
  }

  static logGreen(text: string): void {
    ConsoleColors.logColor(text, Color.Green);
  }

  static logYellow(text: string): void {
    ConsoleColors.logColor(text, Color.Yellow);
  }
}

abstract class Role {
  private name: string;
  private health: number;
  private attackPower: number;

  constructor(name: string, health: number, attackPower: number) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
  }

  getName(): string {
    return this.name;
  }

  getHealth(): number {
    return this.health;
  }
  
  decreaseHealth(damage: number): void {
    this.health -= damage;
    ConsoleColors.logYellow(`[系統]: ${this.name} 扣 ${damage} 血量，剩餘血量: ${this.health}`);
  }

  attack(): number {
    return Math.floor(Math.random() * this.attackPower);
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}

class User extends Role {
  private score: number;

  constructor(name: string) {
    super(name, 100, 50);
    this.score = 0;
  }

  getScore(): number {
    return this.score;
  }

  scoring(score): void {
    this.score += score;
  }
}

class Boss extends Role {
  private time: number;

  constructor(name: string, health: number, time: number, attackPower: number) {
    super(name, health, attackPower);
    this.time = time;
  }

  generateRandomWord(): string {
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

  getTime(): number {
    return this.time;
  }
}

class Controller {
  private readonly WIN_SCORE: number = 100;
  private user: User;
  private bosses: Boss[];
  private currentLevel: number;
  private rl: readline.Interface;

  constructor() {
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
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  startGame(): void {
    console.log("遊戲開始!");
    this.rl.question("請輸入玩家姓名: ", (name) => {
      this.user = new User(name);
      ConsoleColors.logYellow(`[系統]: 玩家 ${this.user.getName()} 血量為 ${this.user.getHealth()}`);
      this.playLevel();
    });
  }

  private playLevel(): void {
    if (this.currentLevel < this.bosses.length) {
      const boss: Boss = this.bosses[this.currentLevel];
      const attackWord: string = boss.generateRandomWord();

      console.log('----------------------');
      ConsoleColors.logYellow(`[系統]: 關卡等級 ${this.currentLevel + 1}, Boss: ${boss.getName()}`);
      console.log(`${boss.getName()} 血量為 ${boss.getHealth()}`);

      const timeoutId = setTimeout(() => {
        // 攻擊失敗
        console.log();
        ConsoleColors.logYellow(`[系統]: 時間到!!!`);
        this.failedToDefeat(boss);
      }, boss.getTime() * 1000);
  
      this.rl.question(
        `請輸入攻擊咒語: '${attackWord}', 時間倒數: ${boss.getTime()} 秒:`,
        (input) => {
          clearTimeout(timeoutId);
          if (input.trim() === attackWord) {
            // 攻擊成功
            this.successfullyDefeated(boss);
          } else {
            // 攻擊失敗
            this.failedToDefeat(boss);
          }
        }
      );
    } else {
      ConsoleColors.logGreen(`[系統]: 恭喜通關，總得分: ${this.user.getScore()}`);
      this.rl.close();
    }
  }
 
  private successfullyDefeated(boss: Boss): void {
    ConsoleColors.logGreen('[系統]: 攻擊成功!!!');
    console.log(`Boss ${boss.getName()} 受到 ${this.user.attack()} 傷害`);
    boss.decreaseHealth(boss.attack());

    if (boss.isDead()) {
      console.log(`成功擊殺 Boss ${boss.getName()}，前往下一關`);
      this.currentLevel++;
      this.user.scoring(this.WIN_SCORE);
    } else {
      console.log(`Boss ${boss.getName()} 剩餘 ${boss.getHealth()} 血量`);
    }
    this.playLevel();
  }

  private failedToDefeat(boss: Boss): void {
    ConsoleColors.logRed('[系統]: 攻擊失敗..');
    console.log(`${this.user.getName()} 受到 ${boss.getName()} ${boss.attack()} 傷害`);
    this.user.decreaseHealth(boss.attack());

    if (this.user.isDead()) {
      console.log(`${this.user.getName()}被 Boss ${boss.getName()}擊殺`);
      console.log(`通過關卡數: ${this.currentLevel + 1}，總得分: ${this.user.getScore()}`);
      this.rl.close();
    } else {
      this.playLevel();
    }
  }
}

const Game = new Controller();
Game.startGame();