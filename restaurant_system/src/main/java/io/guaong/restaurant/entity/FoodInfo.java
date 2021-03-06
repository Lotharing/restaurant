package io.guaong.restaurant.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import io.guaong.restaurant.FoodInfoController;

@Entity
public class FoodInfo{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	@Column(nullable = false)
	private int foodNumber;
	@Column(nullable = false)
	private int restaurantWindowNumber;
	@Column(nullable = false)
	private String foodName;
	@Column(nullable = false)
	private double foodPrice;
	@Column(nullable = false)
	private String foodImgUrl;
	@Column(nullable = false)
	private String foodType;
	
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getFoodNumber() {
		return foodNumber;
	}
	public void setFoodNumber(int foodNumber) {
		this.foodNumber = foodNumber;
	}
	public int getRestaurantWindowNumber() {
		return restaurantWindowNumber;
	}
	public void setRestaurantWindowNumber(int restaurantWindowNumber) {
		this.restaurantWindowNumber = restaurantWindowNumber;
	}
	public String getFoodName() {
		return foodName;
	}
	public void setFoodName(String foodName) {
		this.foodName = foodName;
	}
	public double getFoodPrice() {
		return foodPrice;
	}
	public void setFoodPrice(double foodPrice) {
		this.foodPrice = foodPrice;
	}
	public String getFoodImgUrl() {
		return FoodInfoController.url + foodImgUrl;
	}
	public void setFoodImgUrl(String foodImgUrl) {
		this.foodImgUrl = foodImgUrl;
	}
	public String getFoodType() {
		return foodType;
	}
	public void setFoodType(String foodType) {
		this.foodType = foodType;
	}
	
}
