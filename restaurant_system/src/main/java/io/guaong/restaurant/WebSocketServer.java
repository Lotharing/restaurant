package io.guaong.restaurant;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.guaong.restaurant.entity.OfflineOrder;
import io.guaong.restaurant.entity.OrderInfo;
import io.guaong.restaurant.repository.OrderInfoRepository;
@Component
@ServerEndpoint("/websocket")
public class WebSocketServer {
	
	private static List<WebSocketServer> webSockets = new ArrayList<WebSocketServer>();
	//用于记录所有登陆id
	private static List<String> idQueue = new ArrayList<String>();
	private Session session;
	//存入需要发送信息到离线id
//	private static List<OfflineOrder> offlineOrderQueue = new ArrayList<OfflineOrder>();
	//订单队列
	public static List<OrderInfo> orderQueue = new ArrayList<OrderInfo>();
	
	@OnOpen
	public void onOpen(Session session) {
		System.out.println("have a device connecting");
		this.session = session;
		webSockets.add(this);
	}
	
	@OnClose
	public void onClose() {
		int index = webSockets.indexOf(this);
		System.out.println("id:"+idQueue.get(index)+" closed ");
		idQueue.remove(index);
		webSockets.remove(this);
	}
	
	
	@OnMessage
	public void onMessage(String message) {
		String type = message.split("\\.")[0];
		String text = message.split("\\.")[1];
		if("1".equals(type)) { //发送连接消息
			System.out.println("id:"+text+" already conneted");
			idQueue.add(text);
//			for(int i = 0; i < offlineOrderQueue.size(); i++) {
//				OfflineOrder order = offlineOrderQueue.get(i);
//				if(text.equals(order.getId())) { //有离线订单消息需要发送
//					System.out.println("send offline order to"+order.getId());
//					System.out.println("send offline order content:"+order.getMessage());
//					this.sendMessage(order.getMessage());
//					offlineOrderQueue.remove(i);
//				}
//			}
		}else { //通知消息
			for (OrderInfo info : orderQueue) {
				if((info.getFoodNumber()+"").equals(text)) {
					System.out.println("id:"+info.getOpenid()+"take meal -- "+info.getFoodName());
					WebSocketServer.sendMessageToClient(info.getFoodName(), info.getOpenid());
//					idQueue.remove(info);
				}
			}
		}
	}
	
	
	public void sendMessage(String message) {
		try {
			this.session.getBasicRemote().sendText(message);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void sendMessageToClient(String message, String id) {
		int index = idQueue.indexOf(id);
//		System.out.println(idQueue.size());
//		System.out.println(index+":index");
		if(index != -1) {
			webSockets.get(index).sendMessage(message);
		}else {
//			final OfflineOrder order = new OfflineOrder();
//			order.setId(id);
//			order.setMessage(message);
//			offlineOrderQueue.add(order);
		}
	}

}
