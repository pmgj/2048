package ui;

import java.util.Scanner;

import model.Direction;
import model.EndOfGame;
import model.TwoZeroFourEight;

public class CLI {

    public static void main(String[] args) {
        TwoZeroFourEight game = new TwoZeroFourEight();
        Runnable r = () -> {
            for (Integer[] is : game.getBoard()) {
                for (int i : is) {
                    System.out.print(String.format("%4d  ", i));
                }
                System.out.println();
            }
            System.out.println(String.format("Score: %d", game.getScore()));
        };
        EndOfGame end = EndOfGame.NONE;
        Scanner in = new Scanner(System.in);
        while (end == EndOfGame.NONE) {
            r.run();
            System.out.print("Informe sua movimentação: ");
            String x = in.next();
            switch (x) {
                case "w":
                case "W":
                    end = game.move(Direction.TOP);
                    break;
                case "s":
                case "S":
                    end = game.move(Direction.BOTTOM);
                    break;
                case "a":
                case "A":
                    end = game.move(Direction.LEFT);
                    break;
                case "d":
                case "D":
                    end = game.move(Direction.RIGHT);
                    break;
            }
        }
        r.run();
        System.out.println(end == EndOfGame.WIN ? "You win!" : "You lose!");
        in.close();
    }
}
