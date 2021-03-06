package io.guaong.restaurant.entity;

public class SelectedFoodInfo {
	
	private String foodName;
	private double foodPrice;
	private String foodImgUrl;
	private int no;
	private int id;
	
	public SelectedFoodInfo(String foodName, double foodPrice, String foodImgUrl, int no, int id) {
		this.foodImgUrl = foodImgUrl;
		this.foodName = foodName;
		this.foodPrice = foodPrice;
		this.no = no;
		this.id = id;
	}
	
	public SelectedFoodInfo() {}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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
		return foodImgUrl;
	}
	public void setFoodImgUrl(String foodImgUrl) {
		this.foodImgUrl = foodImgUrl;
	}
	public int getNo() {
		return no;
	}
	public void setNo(int no) {
		this.no = no;
	}

}
