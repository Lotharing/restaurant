package io.guaong.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.guaong.restaurant.entity.FoodType;

public interface  FoodTypeRepository extends JpaRepository<FoodType, Long>{

}
