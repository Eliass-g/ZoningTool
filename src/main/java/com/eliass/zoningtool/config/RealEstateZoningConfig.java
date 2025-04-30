package com.eliass.zoningtool.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(entityManagerFactoryRef = "realEstateZoningEntityManagerFactory", transactionManagerRef = "realEstateZoningTransactionManager", basePackages = {"com.eliass.zoningtool.realestatezoning.repository"})

public class RealEstateZoningConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.secondary")
    public DataSourceProperties realEstateZoningDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource realEstateZoningDataSource(@Qualifier("realEstateZoningDataSourceProperties") DataSourceProperties dataSourceProperties) {
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean realEstateZoningEntityManagerFactory(@Qualifier("realEstateZoningDataSource") DataSource realEstateZoningDataSource, EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(realEstateZoningDataSource)
                .packages("com.eliass.zoningtool.realestatezoning.entity")
                .persistenceUnit("realEstateZoning")
                .properties(Map.of("hibernate.hbm2ddl.auto", "none"))
                .build();
    }

    @Bean
    public PlatformTransactionManager realEstateZoningTransactionManager(@Qualifier("realEstateZoningEntityManagerFactory") EntityManagerFactory factory) {
        return new JpaTransactionManager(factory);
    }

}