package com.eliass.zoningtool.realestatedb.mapper;

import com.eliass.zoningtool.realestatedb.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatedb.entity.RealEstateZoning;


public class RealEstateZoningMapper {

    public static RealEstateZoningDto mapToRealEstateZoningDto (RealEstateZoning realEstateZoning, String geoJson){
        return new RealEstateZoningDto(
                realEstateZoning.getId(),
                geoJson,
                realEstateZoning.getMailadd(),
                realEstateZoning.getZoningTyp()
        );
    }
}