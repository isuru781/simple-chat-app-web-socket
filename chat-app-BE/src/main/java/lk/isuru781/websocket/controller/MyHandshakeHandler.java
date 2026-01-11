package lk.isuru781.websocket.controller;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.UriComponentsBuilder; // Import this
import java.security.Principal;
import java.util.Map;

public class MyHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        // Safe way to extract query parameters
        String query = request.getURI().getQuery();
        if (query != null && query.contains("user=")) {
            // Parse query params safely
            String username = UriComponentsBuilder.fromUri(request.getURI())
                    .build()
                    .getQueryParams()
                    .getFirst("user");

            if (username != null) {
                System.out.println("✅ User Connected: " + username); // Add logging
                return new UserPrincipal(username);
            }
        }
        return null;
    }
}