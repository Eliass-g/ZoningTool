package com.eliass.zoningtool.zoningtooldb.mapper;

import com.eliass.zoningtool.zoningtooldb.dto.ZoningUpdateDto;
import com.eliass.zoningtool.zoningtooldb.entity.ZoningUpdate;

public class ZoningUpdateMapper {

    public static ZoningUpdateDto mapToZoningUpdateDto (ZoningUpdate zoningUpdate){
        return new ZoningUpdateDto(
                zoningUpdate.getId(),
                zoningUpdate.getParcelId(),
                zoningUpdate.getZoningTyp(),
                zoningUpdate.getOrgZoningTyp()
        );
    }

    public static ZoningUpdate mapToZoningUpdate(ZoningUpdateDto zoningUpdateDto){
        return new ZoningUpdate(
                zoningUpdateDto.getId(),
                zoningUpdateDto.getParcelId(),
                zoningUpdateDto.getZoningTyp(),
                zoningUpdateDto.getOrgZoningTyp()
        );
    }
}
