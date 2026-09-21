package com.gramarogya.gramarogya_backend.config;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.util.StringUtils;

@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:gramarogya_db}")
    private String configuredDatabase;

    @Bean
    @Primary
    public MongoClient mongoClient() {
        if (!StringUtils.hasText(mongoUri) || mongoUri.contains("${")) {
            throw new IllegalStateException("MONGODB_URI is required and must point to your MongoDB Atlas cluster.");
        }

        if (mongoUri.contains("localhost") || mongoUri.contains("127.0.0.1")) {
            throw new IllegalStateException("MONGODB_URI is pointing to localhost. Set it to your MongoDB Atlas URI.");
        }

        return MongoClients.create(mongoUri);
    }

    @Bean
    @Primary
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        String database = StringUtils.hasText(connectionString.getDatabase())
                ? connectionString.getDatabase()
                : configuredDatabase;

        return new MongoTemplate(mongoClient, database);
    }
}
