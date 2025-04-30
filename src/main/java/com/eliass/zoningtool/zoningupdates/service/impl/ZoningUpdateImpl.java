package com.eliass.zoningtool.zoningupdates.service.impl;

import com.eliass.zoningtool.zoningupdates.dto.ZoningUpdateDto;
import com.eliass.zoningtool.zoningupdates.entity.ZoningUpdate;
import com.eliass.zoningtool.zoningupdates.exception.ResourceNotFoundException;
import com.eliass.zoningtool.zoningupdates.mapper.ZoningUpdateMapper;
import com.eliass.zoningtool.zoningupdates.repository.ZoningUpdateRepository;
import com.eliass.zoningtool.zoningupdates.service.ZoningUpdateService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ZoningUpdateImpl implements ZoningUpdateService {

    private ZoningUpdateRepository zoningUpdateRepository;

    @Override
    public ZoningUpdateDto createZoningUpdate(ZoningUpdateDto zoningUpdateDto) {
        ZoningUpdate zoningUpdate = ZoningUpdateMapper.mapToZoningUpdate(zoningUpdateDto);
        ZoningUpdate savedZoningUpdate = zoningUpdateRepository.save(zoningUpdate);
        return ZoningUpdateMapper.mapToZoningUpdateDto(savedZoningUpdate);
    }

    @Override
    public ZoningUpdateDto getZoningUpdateById(Integer zoningUpdateId) {
        ZoningUpdate zoningUpdate = zoningUpdateRepository.findById(zoningUpdateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Zoning update does not exist with the given id: " + zoningUpdateId));
        return ZoningUpdateMapper.mapToZoningUpdateDto(zoningUpdate);
    }

    @Override
    public List<ZoningUpdateDto> getAllZoningUpdates() {
        List<ZoningUpdate> zoningUpdates = zoningUpdateRepository.findAll();
        return zoningUpdates.stream().map((zoningUpdate) -> ZoningUpdateMapper.mapToZoningUpdateDto(zoningUpdate))
                .collect(Collectors.toList());
    }

    @Override
    public ZoningUpdateDto updateZoningUpdate(Integer zoningUpdateId, ZoningUpdateDto updatedZoningUpdate) {
        ZoningUpdate zoningUpdate = zoningUpdateRepository.findById(zoningUpdateId).orElseThrow(
                () -> new ResourceNotFoundException("Zoning update does not exist with id: " + zoningUpdateId)
        );

        zoningUpdate.setParcelId(updatedZoningUpdate.getParcelId());
        zoningUpdate.setZoningTyp(updatedZoningUpdate.getZoningTyp());

        ZoningUpdate updatedZoningUpdateObj =  zoningUpdateRepository.save(zoningUpdate);

        return ZoningUpdateMapper.mapToZoningUpdateDto(updatedZoningUpdateObj);
    }

    @Override
    public void deleteZoningUpdate(Integer zoningUpdateId) {
        ZoningUpdate zoningUpdate = zoningUpdateRepository.findById(zoningUpdateId).orElseThrow(
                () -> new ResourceNotFoundException("Zoning update does not exist with id: " + zoningUpdateId)
        );

        zoningUpdateRepository.deleteById(zoningUpdateId);
    }

}
