package com.eliass.zoningtool.realestatezoning.service.impl;

import com.eliass.zoningtool.realestatezoning.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatezoning.entity.RealEstateZoning;
import com.eliass.zoningtool.realestatezoning.exception.ResourceNotFoundException;
import com.eliass.zoningtool.realestatezoning.mapper.RealEstateZoningMapper;
import com.eliass.zoningtool.realestatezoning.repository.RealEstateZoningRepository;
import com.eliass.zoningtool.realestatezoning.service.RealEstateZoningService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RealEstateZoningImpl implements RealEstateZoningService {

    private RealEstateZoningRepository realEstateZoningRepository;

    @Override
    public RealEstateZoningDto getRealEstateZoningById(Integer realEstateZoningId) {
        RealEstateZoning realEstateZoning = realEstateZoningRepository.findById(realEstateZoningId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Real estate does not exist with the given id: " + realEstateZoningId));
        String geoJson = realEstateZoningRepository.findGeoJsonByZoningId(realEstateZoningId);
        return RealEstateZoningMapper.mapToRealEstateZoningDto(realEstateZoning, geoJson);
    }

    @Override
    public List<RealEstateZoningDto> getAllRealEstateZoning() {
        return realEstateZoningRepository.findAllSimple();
    }
}

