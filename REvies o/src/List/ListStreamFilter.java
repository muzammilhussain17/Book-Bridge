package List;

import java.util.*;

public class ListStreamFilter {
    public static void main(String [] args)
    {

        List <Integer> numbers= Arrays.asList(1,2,-3,4,5,-6);
//        List <Integer>  positive= numbers.stream()
//                .filter(n-> n>0 && n%2==0)
//                .toList();
//
//        System.out.println("Positive numbers: "+positive);
        List <String>  signs= numbers.stream()
                .map (
                        n-> {
                            if (n > 0) {
                                return "positive number";
                            } else if (n < 0) {
                                return "negative number";
                            } else {
                                return "number is zero";
                            }
                        }).toList();

        System.out.println("Signs: "+signs);

    }



}
