package com.eliass.zoningtool.realestatezoning.mapper;

import com.eliass.zoningtool.realestatezoning.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatezoning.entity.RealEstateZoning;


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