package com.eliass.zoningtool.zoningtooldb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ZoningUpdateDto {
    private Integer id;
    private Integer parcelId;
    private String zoningTyp;
    private String orgZoningTyp;
}
