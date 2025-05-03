package com.eliass.zoningtool.realestatedb.service.impl;

import com.eliass.zoningtool.realestatedb.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatedb.entity.RealEstateZoning;
import com.eliass.zoningtool.realestatedb.exception.ResourceNotFoundException;
import com.eliass.zoningtool.realestatedb.mapper.RealEstateZoningMapper;
import com.eliass.zoningtool.realestatedb.repository.RealEstateZoningRepository;
import com.eliass.zoningtool.realestatedb.service.RealEstateZoningService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RealEstateZoningImpl implements RealEstateZoningService {

    private RealEstateZoningRepository realEstateZoningRepository;

/*    @Override
    public RealEstateZoningDto getRealEstateZoningById(Integer realEstateZoningId) {
        RealEstateZoning realEstateZoning = realEstateZoningRepository.findById(realEstateZoningId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Real estate does not exist with the given id: " + realEstateZoningId));
        String geoJson = realEstateZoningRepository.findGeoJsonByZoningId(realEstateZoningId);
        return RealEstateZoningMapper.mapToRealEstateZoningDto(realEstateZoning, geoJson);
    }

    @Override
    public List<RealEstateZoning> getAllRealEstateZoning() {
        return realEstateZoningRepository.findAllSimple();
    }*/
}

