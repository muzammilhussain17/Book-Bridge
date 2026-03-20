package List;

import java.util.*;

public class ListPractice {

    public static void main(String[] args)
    {
        List<Integer> list= Arrays.asList(1,2,-1,3,-4,0,5);

        List <Integer> positive= new ArrayList<>();
        List <String> labels= new ArrayList<>();

        for(int number: list)
        {
            if (number>0)
            {
                positive.add(number);
                labels.add("positive number");
            }
             else if(number<0){
                 System.out.println("negative number");
        }
             else{
                 System.out.println("number is zero");
            }
        }

        System.out.println(labels);
        System.out.println(positive);

    }

}
