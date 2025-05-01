package com.eliass.zoningtool.zoningtooldb.repository;

import com.eliass.zoningtool.zoningtooldb.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}