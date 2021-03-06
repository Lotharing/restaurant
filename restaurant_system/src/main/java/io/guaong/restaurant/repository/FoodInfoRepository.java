package io.guaong.restaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.guaong.restaurant.entity.FoodInfo;

public interface FoodInfoRepository extends JpaRepository<FoodInfo, Integer>{

	List<FoodInfo> findAll();
	
	@Query(nativeQuery = true, value ="select * from restaurant.food_info order by food_number")
	List<FoodInfo> findAllOrderByFoodNumber();
	
	List<FoodInfo> findFoodInfoByRestaurantWindowNumber(int number);
	
	FoodInfo findFoodInfoByFoodNumber(int number);
	
	@Query(nativeQuery = true, value = "select distinct restaurant_window_number from food_info")
	List<Integer> getDistinctRestaurantWindows();
	
	@Query(nativeQuery = true, value = "select distinct food_type from food_info where restaurant_window_number = :number")
	List<String> getDistinctFoodType(@Param("number") int number);
	
	@Query(nativeQuery = true, value = "select max(food_number) from restaurant.food_info where restaurant_window_number = :number order by food_number desc")
	Integer getCurrentWindowLastFoodNumber(@Param("number") int number);
	
	List<FoodInfo> findFoodInfoByFoodType(String type);

}
