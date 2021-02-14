import { Component, HostListener, OnInit } from '@angular/core';
import { Block } from './model/block';
import { EmptyBlock } from './model/empty-block';
import { TsTetris as TsTetris } from './model/ts-tetris';
import { Movement } from './model/movement.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'tstetris';
  game = new TsTetris();
  help = false;

  get board(): Block[][] {
    return this.game.board;
  }

  get next(): Block[][] {
    if (this.game.next) {
      const nextShape = this.game.next.shape;
      while (nextShape.length < 4) {
        const line: Block[] = [];
        for (let i = 0; i < nextShape[0].length; i++) {
          line.push(new EmptyBlock());
        }
        nextShape.push(line);
      }
      return nextShape;
    }
    return [];
  }

  ngOnInit() {
    this.game.gameoverListener = () => {
      console.error('GAMEOVER');
      alert('GAMEOVER');
    };
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    switch (key.toUpperCase()) {
      case '4':
      case 'A':
        if (this.game.playing) {
          this.game.handleMovement(Movement.LEFT);
        }
        break;
      case '6':
      case 'D':
        if (this.game.playing) {
          this.game.handleMovement(Movement.RIGHT);
        }
        break;
      case '2':
      case 'S':
        if (this.game.playing) {
          this.game.handleMovement(Movement.SPEED);
        }
        break;
      case '5':
      case ' ':
        if (this.game.playing) {
          this.game.handleMovement(Movement.ROTATE);
        }
        break;
      case 'P':
        this.game.pause();
        break;
      case 'Q':
        this.game.stop();
        break;
      case 'R':
        this.game.start();
        break;
      case 'H':
        this.help = true;
        setTimeout(() => (this.help = false), 5000);
        break;
      case 'G':
        // cheating
        if (this.game.playing) {
          this.game.changeNextPiece();
        }
        break;
    }
  }
}
