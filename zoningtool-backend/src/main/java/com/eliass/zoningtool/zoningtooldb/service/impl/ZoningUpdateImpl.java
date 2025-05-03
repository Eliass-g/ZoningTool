package com.eliass.zoningtool.zoningtooldb.service.impl;

import com.eliass.zoningtool.realestatedb.dto.RealEstateZoningDto;
import com.eliass.zoningtool.realestatedb.entity.RealEstateZoning;
import com.eliass.zoningtool.realestatedb.mapper.RealEstateZoningMapper;
import com.eliass.zoningtool.realestatedb.repository.RealEstateZoningRepository;
import com.eliass.zoningtool.zoningtooldb.dto.ParcelDto;
import com.eliass.zoningtool.zoningtooldb.dto.ZoningUpdateDto;
import com.eliass.zoningtool.zoningtooldb.entity.AuditLog;
import com.eliass.zoningtool.zoningtooldb.entity.ZoningUpdate;
import com.eliass.zoningtool.zoningtooldb.exception.ResourceNotFoundException;
import com.eliass.zoningtool.zoningtooldb.mapper.ZoningUpdateMapper;
import com.eliass.zoningtool.zoningtooldb.repository.AuditLogRepository;
import com.eliass.zoningtool.zoningtooldb.logger.AuditLogger;
import com.eliass.zoningtool.zoningtooldb.repository.ZoningUpdateRepository;
import com.eliass.zoningtool.zoningtooldb.service.ZoningUpdateService;
import lombok.AllArgsConstructor;
import org.slf4j.spi.DefaultLoggingEventBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ZoningUpdateImpl implements ZoningUpdateService {

    private ZoningUpdateRepository zoningUpdateRepository;

    private RealEstateZoningRepository realEstateZoningRepository;

    private AuditLogRepository auditLogRepository;

    private AuditLogger auditLogger;

    /*@Override
    public ZoningUpdateDto createZoningUpdate(ZoningUpdateDto zoningUpdateDto) {
        ZoningUpdate zoningUpdate = ZoningUpdateMapper.mapToZoningUpdate(zoningUpdateDto);
        ZoningUpdate savedZoningUpdate = zoningUpdateRepository.save(zoningUpdate);
        return ZoningUpdateMapper.mapToZoningUpdateDto(savedZoningUpdate);
    }

    @Override
    public ZoningUpdateDto getZoningUpdateById(Integer zoningUpdateId) {
        ZoningUpdate zoningUpdate = zoningUpdateRepository.findById(zoningUpdateId).orElseThrow(() -> new ResourceNotFoundException("Zoning update does not exist with the given id: " + zoningUpdateId));
        return ZoningUpdateMapper.mapToZoningUpdateDto(zoningUpdate);
    }

    @Override
    public List<ZoningUpdateDto> getAllZoningUpdates() {
        List<ZoningUpdate> zoningUpdates = zoningUpdateRepository.findAll();
        return zoningUpdates.stream().map((zoningUpdate) -> ZoningUpdateMapper.mapToZoningUpdateDto(zoningUpdate)).collect(Collectors.toList());
    }

    @Override
    public ZoningUpdateDto updateZoningUpdate(Integer zoningUpdateId, ZoningUpdateDto updatedZoningUpdate) {
        ZoningUpdate zoningUpdate = zoningUpdateRepository.findById(zoningUpdateId).orElseThrow(() -> new ResourceNotFoundException("Zoning update does not exist with id: " + zoningUpdateId));

        zoningUpdate.setParcelId(updatedZoningUpdate.getParcelId());
        zoningUpdate.setZoningTyp(updatedZoningUpdate.getZoningTyp());

        ZoningUpdate updatedZoningUpdateObj = zoningUpdateRepository.save(zoningUpdate);

        return ZoningUpdateMapper.mapToZoningUpdateDto(updatedZoningUpdateObj);
    }

    @Override
    public void deleteZoningUpdate(Integer zoningUpdateId) {
        ZoningUpdate zoningUpdate = zoningUpdateRepository.findById(zoningUpdateId).orElseThrow(() -> new ResourceNotFoundException("Zoning update does not exist with id: " + zoningUpdateId));

        zoningUpdateRepository.deleteById(zoningUpdateId);
    }   @Override
    public ParcelDto getParcelById(Integer parcelId) {
        RealEstateZoning parcel = realEstateZoningRepository.findById(parcelId).orElseThrow(() -> new RuntimeException("Parcel not found with ID: " + parcelId));

        String geoJson = realEstateZoningRepository.findGeoJsonByZoningId(parcelId);

        Optional<ZoningUpdate> zoningUpdateOpt = zoningUpdateRepository.findByParcelId(parcelId);

        String finalZoningTyp = zoningUpdateOpt.map(ZoningUpdate::getZoningTyp).orElse(parcel.getZoningTyp());
        String originalZoningTyp = zoningUpdateOpt.isPresent() ? parcel.getZoningTyp() : null;

        return new ParcelDto(parcel.getId(), geoJson, parcel.getMailadd(), finalZoningTyp, originalZoningTyp);
    }*/

    @Override
    public List<ParcelDto> getAllParcels() {
        Map<Integer, String> updates = zoningUpdateRepository.findAll().stream().collect(Collectors.toConcurrentMap(ZoningUpdate::getParcelId, ZoningUpdate::getZoningTyp));


        return realEstateZoningRepository.findAllSimple().stream().map(parcel -> {
            String update = updates.get(parcel.getId());
            return new ParcelDto(parcel.getId(), parcel.getGeom(), parcel.getMailadd(), (update != null) ? update : parcel.getZoningTyp(), (update != null) ? parcel.getZoningTyp() : null);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ParcelDto> bulkUpdate(List<ParcelDto> updates) {


        try {
            for (ParcelDto update : updates) {
                Integer parcelId = update.getId();
                String newZoningTyp = update.getZoningTyp();

                Optional<ZoningUpdate> existingUpdate = zoningUpdateRepository.findByParcelId(parcelId);

                if (existingUpdate.isEmpty()) {
                    RealEstateZoning original = realEstateZoningRepository.findById(parcelId).orElseThrow(() -> new RuntimeException("Parcel not found with ID: " + parcelId));
                    String originalZoningTyp = original.getZoningTyp();

                    if (!newZoningTyp.equals(originalZoningTyp)) {
                        zoningUpdateRepository.save(new ZoningUpdate(parcelId, newZoningTyp, originalZoningTyp));
                        auditLogger.log(String.format("Zoning update created for parcel with ID %d: Zoning type '%s' to '%s'.", parcelId, originalZoningTyp, newZoningTyp));
                    }
                } else {
                    ZoningUpdate updateRecord = existingUpdate.get();
                    String originalZoningTyp = updateRecord.getOrgZoningTyp();
                    String existingZoningTyp = updateRecord.getZoningTyp();

                    if (newZoningTyp.equals(existingZoningTyp)) {
                        auditLogger.log(String.format(
                                "Skipped zoning update for parcel with ID %d: Zoning type is already set to '%s'.",
                                parcelId, newZoningTyp
                        ));
                        continue;
                    }

                    if (newZoningTyp.equals(originalZoningTyp)) {
                        zoningUpdateRepository.delete(updateRecord);
                        auditLogger.log(String.format("Zoning update deleted for parcel with ID %d: Reverted to original zoning type '%s'", parcelId, originalZoningTyp));
                    } else {
                        updateRecord.setZoningTyp(newZoningTyp);
                        zoningUpdateRepository.save(updateRecord);
                        auditLogger.log(String.format("Zoning type updated for parcel with ID %d: Zoning type originally '%s' to '%s'.", parcelId, originalZoningTyp, newZoningTyp));
                    }
                }
            }
        } catch (Exception e) {
            auditLogger.log("Failed zoning bulk update: " + e.getMessage());
            throw e;
        }
        return updates;
    }

    @Override
    @Transactional
    public List<Integer> bulkDelete(List<Integer> parcelIds) {
        for (Integer parcelId : parcelIds) {
            Optional<ZoningUpdate> update = zoningUpdateRepository.findByParcelId(parcelId);
            if (update.isPresent()) {
                String orgZoningTyp = update.get().getOrgZoningTyp();
                zoningUpdateRepository.delete(update.get());
                auditLogger.log(String.format("Zoning update deleted for parcel with ID %d: Reverted to original zoning type '%s'", parcelId, orgZoningTyp));
            } else {
                auditLogger.log(String.format("No zoning update found to delete for parcel ID %d.", parcelId));
            }
        }
        return parcelIds;
    }

}
