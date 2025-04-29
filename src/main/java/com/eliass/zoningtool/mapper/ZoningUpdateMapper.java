package com.eliass.zoningtool.mapper;

import com.eliass.zoningtool.dto.ZoningUpdateDto;
import com.eliass.zoningtool.entity.ZoningUpdate;

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
