package io.guaong.restaurant.entity;

import java.util.List;

public class WindowSelectedFoodsInfo {
	
	private String foodType;
	private List<SelectedFoodInfo> selectedFoodInfo;
	
	public WindowSelectedFoodsInfo() {}
	
	public WindowSelectedFoodsInfo(String foodType, List<SelectedFoodInfo> selectedFoodInfo) {
		this.foodType = foodType;
		this.selectedFoodInfo = selectedFoodInfo;
	}
	
	public String getFoodType() {
		return foodType;
	}
	public void setFoodType(String foodType) {
		this.foodType = foodType;
	}
	public List<SelectedFoodInfo> getSelectedFoodInfo() {
		return selectedFoodInfo;
	}
	public void setSelectedFoodInfo(List<SelectedFoodInfo> selectedFoodInfo) {
		this.selectedFoodInfo = selectedFoodInfo;
	}
	
	

}
