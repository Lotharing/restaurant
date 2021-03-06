package io.guaong.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.guaong.restaurant.entity.EmployeeInfo;

public interface EmployeeInfoRepository extends JpaRepository<EmployeeInfo, Long>{

}
