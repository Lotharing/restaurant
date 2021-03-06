package io.guaong.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.guaong.restaurant.entity.Suggest;

public interface SuggestRepository  extends JpaRepository<Suggest, Integer>{

}
