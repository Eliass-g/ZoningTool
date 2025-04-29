package com.eliass.zoningtool.controller;

import com.eliass.zoningtool.dto.ZoningUpdateDto;
import com.eliass.zoningtool.service.ZoningUpdateService;
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
}
