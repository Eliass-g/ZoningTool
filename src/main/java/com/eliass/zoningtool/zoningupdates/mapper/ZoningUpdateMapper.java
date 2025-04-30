package com.eliass.zoningtool.zoningupdates.mapper;

import com.eliass.zoningtool.zoningupdates.dto.ZoningUpdateDto;
import com.eliass.zoningtool.zoningupdates.entity.ZoningUpdate;

public class ZoningUpdateMapper {

    public static ZoningUpdateDto mapToZoningUpdateDto (ZoningUpdate zoningUpdate){
        return new ZoningUpdateDto(
                zoningUpdate.getId(),
                zoningUpdate.getParcelId(),
                zoningUpdate.getZoningTyp()
        );
    }

    public static ZoningUpdate mapToZoningUpdate(ZoningUpdateDto zoningUpdateDto){
        return new ZoningUpdate(
                zoningUpdateDto.getId(),
                zoningUpdateDto.getParcelId(),
                zoningUpdateDto.getZoningTyp()
        );
    }
}
