package com.eliass.zoningtool.realestatezoning.service;

import com.eliass.zoningtool.realestatezoning.dto.RealEstateZoningDto;

import java.util.List;

public interface RealEstateZoningService {

    RealEstateZoningDto getRealEstateZoningById(Integer zoningUpdateId);

    List<RealEstateZoningDto> getAllRealEstateZoning();

}
