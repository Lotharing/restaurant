package io.guaong.restaurant.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class OrderInfo {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	@Column(nullable = false)
	private String openid;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private int foodNumber;
	@Column(nullable = false)
	private String foodName;
	@Column(nullable = false)
	private int price;
	@Column(nullable = false)
	private int allPrice;
	@Column(nullable = false)
	private Date date;
	@Column(nullable = false)
	private int number;
	@Column(nullable = false)
	private int windowNum;
	@Column(nullable = false)
	private String img;
	@Column(nullable = false)
	private int status;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getFoodNumber() {
		return foodNumber;
	}
	public void setFoodNumber(int foodNumber) {
		this.foodNumber = foodNumber;
	}
	public String getFoodName() {
		return foodName;
	}
	public void setFoodName(String foodName) {
		this.foodName = foodName;
	}
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public int getAllPrice() {
		return allPrice;
	}
	public void setAllPrice(int allPrice) {
		this.allPrice = allPrice;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public int getWindowNum() {
		return windowNum;
	}
	public void setWindowNum(int windowNum) {
		this.windowNum = windowNum;
	}
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	
}
