import cli from "@angular/cli";
import { UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { Any } from "typeorm";

@WebSocketGateway({ cors: true, path: '/global', methods: ['GET', 'POST'] })
export class GlobalGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	userIds: string[] = [];
	private connectedUsers: Map<string, Socket> = new Map();

	private connectedUserIds: Set<string> = new Set();
	// private connectedUsers: Map<string, Socket> = new Map();
	constructor(
		private readonly authService: AuthService
	) { }
	handleConnection(client: Socket) {
		this.GuardsConsumer(client);
		const userName = String(client.handshake.query.name);
		this.connectedUsers.set(userName, client);
		this.connectedUserIds.add(userName);
		this.updateConnectedUsers(); // Update the list of connected users first
		// client.emit('connectedUsers', { msg: 'hello' }); // Then emit the event to the newly connected client
		// this.server.emit('connectedUsers', { msg: 'hello' }); // Emit the event to all connected clients
		client.emit('updateList', { userIds: this.userIds });
		this.server.emit('updateList', { userIds: this.userIds });
	}

	handleDisconnect(client: Socket) {
		const userName = String(client.handshake.query.name);
		if (this.connectedUsers.has(userName)) {
			this.connectedUsers.delete(userName);
			this.connectedUserIds.delete(userName);
		}
		this.updateConnectedUsers();
		client.emit('updateList', { userIds: this.userIds });
		this.server.emit('updateList', { userIds: this.userIds });
	}

	private async updateConnectedUsers() {
		this.userIds = Array.from(this.connectedUserIds);
		// this.server.emit('connectedUsers', { msg: 'hello'});
	}

	@SubscribeMessage('acceptCall')
	async handleAcceptCall(client: Socket, payload: any) {
		console.log('acceptCall');
		client.to(payload.to).emit('AcceptCall', {
			answer: payload.answer,
			from: payload.from
		});
	}

	async GuardsConsumer(client: Socket) {
		const cookies = client.handshake.headers.cookie?.split(';');
		let access_token;
		for (let index = 0; index < cookies.length; index++) {
			const cookie = cookies[index].trim();
			if (cookie.startsWith('access_token='))
			{
				access_token = cookie.substring(String('access_token=').length);
			}
		}
		const payload = await this.authService.validateToken(access_token);
		if (!payload)
		{
			client.disconnect();
		}
	}

};

