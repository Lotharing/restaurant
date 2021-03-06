package io.guaong.restaurant.entity;

public class WindowSales {
	
	private String windowName;
	private int number;
	public WindowSales(String windowName,  int number) {
		this.windowName = windowName;
		this.number = number;
	}
	public String getWindowName() {
		return windowName;
	}
	public void setWindowName(String windowName) {
		this.windowName = windowName;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	
	

}
