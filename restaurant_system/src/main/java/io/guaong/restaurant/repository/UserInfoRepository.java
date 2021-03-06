package io.guaong.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.guaong.restaurant.entity.FoodInfo;
import io.guaong.restaurant.entity.UserInfo;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long>{
	
	

}
