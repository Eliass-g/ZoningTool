package com.eliass.zoningtool.zoningtooldb.service;

import com.eliass.zoningtool.realestatedb.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatedb.entity.RealEstateZoning;
import com.eliass.zoningtool.zoningtooldb.dto.ParcelDto;
import com.eliass.zoningtool.zoningtooldb.dto.ZoningUpdateDto;

import java.util.List;

public interface ZoningUpdateService {
/*    ZoningUpdateDto createZoningUpdate(ZoningUpdateDto zoningUpdateDto);

    ZoningUpdateDto getZoningUpdateById(Integer zoningUpdateId);

    List<ZoningUpdateDto> getAllZoningUpdates();

    ZoningUpdateDto updateZoningUpdate(Integer zoningUpdateId, ZoningUpdateDto updatedZoningUpdate);

    void deleteZoningUpdate(Integer zoningUpdateId);

    ParcelDto getParcelById(Integer parcelId);
    */

    List<ParcelDto> getAllParcels();

    List<ParcelDto> bulkUpdate(List<ParcelDto> updates);

    List<Integer> bulkDelete(List<Integer> parcelIds);

}
