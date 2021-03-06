package io.guaong.restaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.guaong.restaurant.entity.OrderInfo;

public interface OrderInfoRepository extends JpaRepository<OrderInfo, Long>{
	
	List<OrderInfo> findOrderInfoByOpenid(String openid);
	
	@Query(nativeQuery = true, value = "select count(*) from restaurant.order_info where window_num = :number")
	int getWindowSalesVolume(@Param("number") int number);
	
	@Query(nativeQuery = true, value = "select count(*) from restaurant.order_info where food_number = :number")
	int getFoodSalesVolume(@Param("number") int number);
	
	@Query(nativeQuery = true, value = "select count(*) from restaurant.order_info where date >= :timeBottom and date <= :timeTop")
	int getTimeSalesVolume(@Param("timeBottom") String timeBottom, @Param("timeTop") String timeTop);
	
	@Query(nativeQuery = true, value = "select * from restaurant.order_info where openid = :openid and (status = 0 or status = 1)")
	List<OrderInfo> getDoingOrder(@Param("openid") String openid);
	
	@Query(nativeQuery = true, value = "select * from restaurant.order_info where openid = :openid and status = 3")
	List<OrderInfo> getFinishedOrder(@Param("openid") String openid);
	
	@Query(nativeQuery = true, value = "select * from restaurant.order_info where openid = :openid and status = 2 ")
	List<OrderInfo> getWaitingOrder(@Param("openid") String openid);
	
	@Query(nativeQuery = true, value = "select * from restaurant.order_info where window_num = :number and status = 1")
	List<OrderInfo> getCurrentWindowWaittingOrder(@Param("number") int number);
	
	@Query(nativeQuery = true, value = "select * from restaurant.order_info where window_num = :number and status = 0")
	List<OrderInfo> getCurrentWindowDeliveredOrder(@Param("number") int number);
}
