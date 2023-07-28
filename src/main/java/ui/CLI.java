package ui;

import java.util.Map;
import java.util.Scanner;

import model.Direction;
import model.EndOfGame;
import model.rules.Alphabet;

public class CLI {

    public static void main(String[] args) {
        var game = new Alphabet();
        Runnable r = () -> {
            for (var is : game.getBoard()) {
                for (var i : is) {
                    System.out.print(String.format("%4s  ", i));
                }
                System.out.println();
            }
            System.out.println(String.format("Score: %d", game.getScore()));
        };
        var end = EndOfGame.NONE;
        var in = new Scanner(System.in);
        var map = Map.of("w", Direction.TOP, "s", Direction.BOTTOM, "a", Direction.LEFT, "d", Direction.RIGHT);
        while (end == EndOfGame.NONE) {
            r.run();
            System.out.print("Informe sua movimentação: ");
            var x = in.next();
            end = game.play(map.get(x));
        }
        r.run();
        System.out.println(end == EndOfGame.WIN ? "You win!" : "You lose!");
        in.close();
    }
}
