package com.eliass.zoningtool.zoningtooldb.controller;

import com.eliass.zoningtool.zoningtooldb.dto.ParcelDto;
import com.eliass.zoningtool.zoningtooldb.dto.ZoningUpdateDto;
import com.eliass.zoningtool.zoningtooldb.service.ZoningUpdateService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/zoning")
public class ZoningUpdateController {

    private ZoningUpdateService zoningUpdateService;

    @PostMapping
    public ResponseEntity<ZoningUpdateDto> createZoningUpdate(@RequestBody ZoningUpdateDto zoningUpdateDto){
        ZoningUpdateDto savedZoningUpdate = zoningUpdateService.createZoningUpdate(zoningUpdateDto);
        return new ResponseEntity<>(savedZoningUpdate, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<ZoningUpdateDto> getZoningUpdateById(@PathVariable("id") Integer zoningUpdateId){
        ZoningUpdateDto zoningUpdateDto = zoningUpdateService.getZoningUpdateById(zoningUpdateId);
        return ResponseEntity.ok(zoningUpdateDto);
    }

    @GetMapping
    public ResponseEntity<List<ZoningUpdateDto>> getAllZoningUpdates(){
        List<ZoningUpdateDto> zoningUpdates = zoningUpdateService.getAllZoningUpdates();
        return ResponseEntity.ok(zoningUpdates);
    }

    @PutMapping("{id}")
    public ResponseEntity<ZoningUpdateDto> updateZoningUpdate(@PathVariable("id") Integer zoningUpdateId,
                                                              @RequestBody ZoningUpdateDto updatedZoningUpdate){
        ZoningUpdateDto zoningUpdateDto = zoningUpdateService.updateZoningUpdate(zoningUpdateId, updatedZoningUpdate);
        return ResponseEntity.ok(zoningUpdateDto);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteZoningUpdate(@PathVariable("id") Integer zoningUpdateId){
        zoningUpdateService.deleteZoningUpdate(zoningUpdateId);
        return ResponseEntity.ok("Zoning update deleted successfully.");
    }

    @GetMapping("/parcel/{id}")
    public ResponseEntity<ParcelDto> getParcelById(@PathVariable("id") Integer parcelId){
        ParcelDto parcelDto = zoningUpdateService.getParcelById(parcelId);
        return ResponseEntity.ok(parcelDto);
    }

    @GetMapping("/parcel")
    public ResponseEntity<List<ParcelDto>> getAllParcels() {
        List<ParcelDto> parcelDto = zoningUpdateService.getAllParcels();
        return ResponseEntity.ok(parcelDto);
    }

    @PostMapping("/update")
    public ResponseEntity<List<ParcelDto>> bulkUpdate(@RequestBody List<ParcelDto> updates) {
        List<ParcelDto> savedParcelDtos = zoningUpdateService.bulkUpdate(updates);
        return ResponseEntity.ok(savedParcelDtos);
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> bulkDelete(@RequestBody List<Integer> parcelIds) {
        zoningUpdateService.bulkDelete(parcelIds);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllUpdates() {
        zoningUpdateService.deleteAllUpdates();
        return ResponseEntity.noContent().build();
    }
}
