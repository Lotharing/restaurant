package io.guaong.restaurant.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import io.guaong.restaurant.FoodInfoController;
@Entity
public class WindowInfo{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	@Column(nullable = false)
	private int restaurantWindowNumber;
	@Column(nullable = false)
	private String windowName;
//	@Column(nullable = false)
//	private String windowHeadImgUrl;
	@Column(nullable = false)
	private String windowIntroduction;
	
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getRestaurantWindowNumber() {
		return restaurantWindowNumber;
	}
	public void setRestaurantWindowNumber(int restaurantWindowNumber) {
		this.restaurantWindowNumber = restaurantWindowNumber;
	}
	public String getWindowName() {
		return windowName;
	}
	public void setWindowName(String windowName) {
		this.windowName = windowName;
	}
//	public String getWindowHeadImgUrl() {
//		return FoodInfoController.url + windowHeadImgUrl;
//	}
//	public void setWindowHeadImgUrl(String windowHeadImgUrl) {
//		this.windowHeadImgUrl = windowHeadImgUrl;
//	}
	public String getWindowIntroduction() {
		return windowIntroduction;
	}
	public void setWindowIntroduction(String windowIntroduction) {
		this.windowIntroduction = windowIntroduction;
	}
	
}
