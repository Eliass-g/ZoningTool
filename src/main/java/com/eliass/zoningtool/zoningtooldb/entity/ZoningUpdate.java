package com.eliass.zoningtool.zoningtooldb.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "zoning_updates")
public class ZoningUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "parcel_id", nullable = false, unique = true)
    private Integer parcelId;

    @Column(name = "zoning_typ", nullable = false, length = 80)
    private String zoningTyp;

    @Column(name = "org_zoning_typ", nullable = true, length = 80)
    private String orgZoningTyp;


    public ZoningUpdate(Integer parcelId, String zoningTyp, String orgZoningTyp) {
        this.parcelId = parcelId;
        this.zoningTyp = zoningTyp;
        this.orgZoningTyp = orgZoningTyp;
    }
}
