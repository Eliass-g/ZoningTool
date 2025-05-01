package com.eliass.zoningtool.realestatedb.entity;

import com.fasterxml.jackson.annotation.JsonRawValue;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Immutable
@Table(name = "real_estate_zoning")
public class RealEstateZoning {

    @Id
    private Integer id;

    @Column(name = "geom", columnDefinition = "geometry")
    @JsonRawValue
    private String geom;

    @Column(name = "mailadd", length = 80)
    private String mailadd;

    @Column(name = "zoning_typ", length = 80)
    private String zoningTyp;

}
