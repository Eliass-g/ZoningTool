package com.eliass.zoningtool.realestatezoning.repository;

import com.eliass.zoningtool.realestatezoning.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatezoning.entity.RealEstateZoning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealEstateZoningRepository extends JpaRepository<RealEstateZoning, Integer> {

    @Query(value = """
        SELECT
            id,
            ST_AsGeoJSON(geom) AS geom,
            mailadd,
            zoning_typ
        FROM real_estate_zoning
        WHERE id = :realEstateZoningId
        """, nativeQuery = true)
    String findGeoJsonByZoningId(@Param("realEstateZoningId") Integer realEstateZoningId);

    @Query(value = """
        SELECT
            id,
            ST_AsGeoJSON(geom) AS geom,
            mailadd,
            zoning_typ
        FROM real_estate_zoning
        """, nativeQuery = true)
    List<RealEstateZoningDto> findAllSimple();
}
