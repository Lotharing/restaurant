package io.guaong.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
@SpringBootApplication
public class RestaurantSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantSystemApplication.class, args);
	}
	
	@Bean
	public FilterRegistrationBean<ResponseHeaderFilter> filterRegistrationBean () {
		FilterRegistrationBean<ResponseHeaderFilter> filterRegistrationBean = new FilterRegistrationBean<ResponseHeaderFilter>();
	    filterRegistrationBean.addUrlPatterns("/*");
	    filterRegistrationBean.setFilter(new ResponseHeaderFilter());
	    return filterRegistrationBean;
	}

}
