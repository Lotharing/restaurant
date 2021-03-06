package io.guaong.restaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import io.guaong.restaurant.entity.WindowInfo;

public interface WindowInfoRepository extends JpaRepository<WindowInfo, Long>{
	
	List<WindowInfo> findAll();
	
	@Query(nativeQuery = true, value="select max(restaurant_window_number)  from  restaurant.window_info order by restaurant_window_number")
	Integer getLastestWindowNumber();

}
