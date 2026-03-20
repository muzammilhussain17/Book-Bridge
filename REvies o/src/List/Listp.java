package List;

import java.util.*;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Listp {
    public static void main(String[] args) {


        // Map<Integer, String> kella= new HashMap<>();
        // kella.put(01,"Banana");

        // if (kella.containsKey(01)){
        //     System.out.println("yes kella found");

        // }
        // else{
        //     System.out.println("not found");
        // }

//        List<String> fruits= new ArrayList<>();
//        fruits.add("apple");
//        fruits.add("banana");
//
//        for(String fruite : fruits){
//            System.out.println(fruite);
//        }

        List<String> fruits= Arrays.asList("Apple","Banana");

        for (String fruites : fruits)
        {
            if(fruites.equals("Apple"))
            {
                System.out.println("Apple is found");
                break;
            }
            else{
                System.out.println("mannn fuck offf");
            }
        }



    }
}