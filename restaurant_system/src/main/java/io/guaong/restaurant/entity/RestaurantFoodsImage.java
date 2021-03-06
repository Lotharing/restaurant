package io.guaong.restaurant.entity;

import java.util.List;

public class RestaurantFoodsImage {
	
	private List<FoodImage> foodImages;
	
	public RestaurantFoodsImage() {}
	
	public RestaurantFoodsImage(List<FoodImage> foodImages) {
		this.foodImages = foodImages;
	}
	
	public List<FoodImage> getFoodImages() {
		return foodImages;
	}

	public void setFoodImages(List<FoodImage> foodImages) {
		this.foodImages = foodImages;
	}

}
