package lk.isuru781.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class simpleChat {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")//client will send message to server  /app/chat
    @SendTo("/topic/messages")//server sent to client /topic/messages
    public String sendMessage(String message) {
        return "Server says: " + message;
    }

    @MessageMapping("/private-chat")//chat eka server ekata yana eka  /app/private-chat kiyalal server ekata yawanne
    public void sentPrivateMessage(@Payload ChatMessage message) {
        System.out.println("📩 Private Message Request:");
        System.out.println("   From: " + message.getSender());
        System.out.println("   To: " + message.getReceiver());

        // Send to user
        messagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/private", //   /user/queue/private meka thamai client eken subscribe wenne
                message
        );//server eken adala clienta msg eka yanne
        System.out.println("✅ Sent to /user/" + message.getReceiver() + "/queue/private");
    }

    {/*
// =================================================================
// 1. Connection (සම්බන්ධ වීම - Handshake)
// =================================================================

// මෙතනදී අපි Server එකට connect වෙනවා.
// වැදගත්ම දේ තමයි '?user=${username}' කොටස.
// අපි connect වෙද්දිම අපේ නම (Username) යවනවා.
// Backend එකේ 'MyHandshakeHandler' එකෙන් මේ නම අල්ලගෙන,
// ඒ connection එක අදාළ user ට වෙන් කරනවා (Register කරනවා).
const socket = new SockJS(`http://localhost:8080/websocket?user=${username}`);


// =================================================================
// 2. Subscribing (පණිවිඩ ලබා ගැනීම - Receiver)
// =================================================================

// Server එකෙන් අපේ නමට එන මැසේජ් (Private Messages) ගන්න නම් මේකට Subscribe වෙන්න ඕන.
// "/user/queue/private" කියලා දුන්නම, Spring Boot එකෙන් දන්නවා
// මේක අර කලින් Register වුණු User ගේ පෞද්ගලික පෝලිම (Private Queue) කියලා.
// ඒ නිසා වෙන අයගේ මැසේජ් මෙතනට එන්නේ නෑ.
 stompClient.subscribe('/user/queue/private', function(message) {

        // Server එකෙන් මැසේජ් එකක් ආපු ගමන් මෙතනට තමයි එන්නේ.
        // මෙතනදී අපිට මැසේජ් එක පෙන්නන්න පුළුවන් (Display message).
const msgBody = JSON.parse(message.body);
        console.log("මට මැසේජ් එකක් ආවා:", msgBody);

    });


// =================================================================
// 3. Sending (පණිවිඩ යැවීම - Sender)
// =================================================================

// අපි යවන මැසේජ් එක Server එකට බාර දෙන්නේ මේ Endpoint එකට.
// "/app" කියන්නේ Application Prefix එක.
// "/private-chat" කියන්නේ Controller එකේ @MessageMapping එකේ තියෙන නම.
// මෙතනින් යැව්වම Controller එකෙන් receiver කවුද කියලා බලලා එයාට යවනවා.
stompClient.send("/app/private-chat", {}, JSON.stringify({
        sender: username,
                receiver: receiverName,
                content: "Hello friend!"
    }));
*/}
}
