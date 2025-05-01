package com.eliass.zoningtool.zoningtooldb.repository;

import com.eliass.zoningtool.zoningtooldb.entity.ZoningUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ZoningUpdateRepository extends JpaRepository<ZoningUpdate, Integer> {
    Optional<ZoningUpdate> findByParcelId(Integer parcelId);
}
