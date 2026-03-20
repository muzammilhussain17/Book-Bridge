package List;

import java.util.ArrayList;


 class user {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    private String age;

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    private String country;

     @Override
     public String toString() {
            return "user{" +
                    "name='" + name + '\'' +
                    ", age='" + age + '\'' +
                    ", country='" + country + '\'' +
                    '}';
     }
 }


public class ListUserOnCity {
    public static void main(String[] args) {
        ArrayList<user> users = new ArrayList<>();
        users.add(users("Alice", "25", "USA"));
        users.add( users("Bob", "30", "USA"));
        users.add( users("Charlie", "22", "USA"));
        users.add( users("David", "18", "USA"));
        users.add( users("Emily", "25", "UK"));
        users.add( users("Fiona", "22", "Australia"));
        users.add( users("George", "18", "India"));
        users.add( users("Helen", "19", "USA"));
        users.add( users("Isaac", "61", "Brazil"));
        users.add( users("Jasmine", "27", "USA"));

        System.out.println("Users living in USA:");
        users.stream()
                .filter(u -> "USA".equals(u.getCountry()))
                .forEach(u -> System.out.println("→ " + u));
    }

    private static user users(String name, String number, String usa) {
       user u= new user();
       u.setName(name);
         u.setAge(number);
            u.setCountry(usa);
         return u;
    }
    //Find all users who live in USA




}



//
//
//package List;
//
//import java.util.*;
//
//public class ListUserOnCity {
//
//    public static void main(String[] args)
//    {
//
//
//
//    }
//}
