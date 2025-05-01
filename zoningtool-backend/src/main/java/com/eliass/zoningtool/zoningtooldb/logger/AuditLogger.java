package com.eliass.zoningtool.audit;

import com.eliass.zoningtool.zoningtooldb.entity.AuditLog;
import com.eliass.zoningtool.zoningtooldb.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AuditLogger {

    private static final Logger fileLogger = LoggerFactory.getLogger("AUDIT_LOGGER");

    private final AuditLogRepository auditLogRepository;

    public AuditLogger(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String message) {
        fileLogger.info(message);

        AuditLog auditLog = new AuditLog();
        auditLog.setCreated(LocalDateTime.now());
        auditLog.setMessage(message);
        auditLogRepository.save(auditLog);
    }
}
