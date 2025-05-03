package com.eliass.zoningtool.realestatedb.controller;

import com.eliass.zoningtool.realestatedb.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatedb.entity.RealEstateZoning;
import com.eliass.zoningtool.realestatedb.service.RealEstateZoningService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/realestate")
public class RealEstateZoningController {

    private RealEstateZoningService realEstateZoningService;

/*    @GetMapping("{id}")
    public ResponseEntity<RealEstateZoningDto> getRealEstateZoningById(@PathVariable("id") Integer realEstateZoningId){
        RealEstateZoningDto realEstateZoningDto = realEstateZoningService.getRealEstateZoningById(realEstateZoningId);
        return ResponseEntity.ok(realEstateZoningDto);
    }

    @GetMapping
    public ResponseEntity<List<RealEstateZoning>> getAllRealEstateZoning(){
        List<RealEstateZoning> realEstateZoning = realEstateZoningService.getAllRealEstateZoning();
        return ResponseEntity.ok(realEstateZoning);
    }*/

}
