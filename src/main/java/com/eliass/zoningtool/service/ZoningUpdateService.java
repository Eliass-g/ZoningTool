package com.eliass.zoningtool.service;

import com.eliass.zoningtool.dto.ZoningUpdateDto;

import java.util.List;

public interface ZoningUpdateService {
    ZoningUpdateDto createZoningUpdate(ZoningUpdateDto zoningUpdateDto);

    ZoningUpdateDto getZoningUpdateById(Integer zoningUpdateId);

    List<ZoningUpdateDto> getAllZoningUpdates();

    ZoningUpdateDto updateZoningUpdate(Integer zoningUpdateId, ZoningUpdateDto updatedZoningUpdate);

    void deleteZoningUpdate(Integer zoningUpdateId);
}
