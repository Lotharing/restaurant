package io.guaong.restaurant.entity;

public class FoodImage {
	
	private String key;
	private String url;

	public FoodImage(String key, String url) {
		this.key = key;
		this.url = url;
	}
	
	public FoodImage() {}
	
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}

}
