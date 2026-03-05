package com.orderfulfillment.orders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.orderfulfillment.orders.ordermanagement.infra.OrderCreatedEvent;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.Map;

import static org.apache.kafka.clients.producer.ProducerConfig.*;

@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, OrderCreatedEvent> orderEventProducerFactory() {
        ObjectMapper objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        JsonSerializer<OrderCreatedEvent> valueSerializer = new JsonSerializer<>(objectMapper);

        Map<String, Object> config = Map.of(BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new DefaultKafkaProducerFactory<>(config, new StringSerializer(), valueSerializer);
    }

    @Bean
    public KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate(
            ProducerFactory<String, OrderCreatedEvent> orderEventProducerFactory) {
        return new KafkaTemplate<>(orderEventProducerFactory);
    }
}
