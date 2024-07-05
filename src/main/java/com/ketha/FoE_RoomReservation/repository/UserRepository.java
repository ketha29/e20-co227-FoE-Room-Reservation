package com.ketha.FoE_RoomReservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ketha.FoE_RoomReservation.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

}
