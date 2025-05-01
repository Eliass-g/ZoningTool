package com.eliass.zoningtool.zoningtooldb.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParcelDto {
    private Integer id;

    @JsonRawValue
    private String geom;
    
    private String mailadd;
    private String zoningTyp;
    private String orgZoningTyp = null;;
}
