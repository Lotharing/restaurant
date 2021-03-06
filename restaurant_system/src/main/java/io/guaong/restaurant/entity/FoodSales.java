package io.guaong.restaurant.entity;

public class FoodSales {
	
	private String foodName;
	private int number;
	
	public FoodSales(String foodName, int number) {
		this.foodName = foodName;
		this.number = number;
	}
	
	public String getFoodName() {
		return foodName;
	}
	public void setFoodName(String foodName) {
		this.foodName = foodName;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	
	

}
