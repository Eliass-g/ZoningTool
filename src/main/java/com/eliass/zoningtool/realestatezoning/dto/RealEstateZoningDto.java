package com.eliass.zoningtool.realestatezoning.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.locationtech.jts.geom.Geometry;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RealEstateZoningDto {
    private Integer id;

    @JsonRawValue
    private String geom;

    private String mailadd;
    private String zoningTyp;
}
