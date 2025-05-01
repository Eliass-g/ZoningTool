package com.eliass.zoningtool.realestatedb.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RealEstateZoningDto {
    private Integer id;

    @JsonRawValue
    private String geom;

    private String mailadd;
    private String zoningTyp;
}
