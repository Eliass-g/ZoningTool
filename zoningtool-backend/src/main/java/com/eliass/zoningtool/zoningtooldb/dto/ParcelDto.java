package com.eliass.zoningtool.zoningtooldb.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ParcelDto {
    private Integer id;

    @JsonRawValue
    private String geom;
    
    private String mailadd;
    private String zoningTyp;
    private String orgZoningTyp = null;;

    public ParcelDto(Integer id, String geom, String mailadd, String zoningTyp, String orgZoningTyp) {
        this.id = id;
        this.geom = geom;
        setMailadd(mailadd);
        this.zoningTyp = zoningTyp;
        this.orgZoningTyp = orgZoningTyp;
    }


    public void setMailadd(String mailadd) {
        if (mailadd == null) {
            this.mailadd = null;
            return;
        }

        // Split into words, capitalize first letter of each, and join back
        String[] words = mailadd.split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }
        this.mailadd = result.toString().trim();
    }
}
