package Map;

import java.util.*;

public class MapPractice {
    public static void main(String[] args) {

        Map <Integer, String> soda= new HashMap<>();
        soda.put(1,"Coke");
        soda.put(2,"Pepsi");
        soda.put(3,"Sprite");


        if(soda.containsKey(2))
        {
            System.out.println("Soda is found");
        }
        else
        {
            System.out.println("Soda is not found");
        }
    }

}
