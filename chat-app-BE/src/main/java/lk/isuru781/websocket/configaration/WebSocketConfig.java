package lk.isuru781.websocket.configaration;

import lk.isuru781.websocket.controller.MyHandshakeHandler;
import org.springframework.context.annotation.Configuration;


import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/websocket")
                .setAllowedOrigins("http://localhost:5173")//?user=isuru781") // Adjust according to your frontend origin
                .setHandshakeHandler(new MyHandshakeHandler()) // Add this line meken thamai server eka namin save karaganne name
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");///queue is mandatory for private messaging.
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user"); // Private messages සඳහා අත්‍යවශ්‍යයි
    }




}
