import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
import logging
from urllib.parse import parse_qs

logger = logging.getLogger(__name__)

class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = await self.get_user_from_token()
        logger.info(f"WebSocket connection attempt by user: {self.user}")
        if self.user and self.user.is_authenticated:
            await self.channel_layer.group_add(
                f"user_{self.user.id}",
                self.channel_name
            )
            logger.info(f"WebSocket connected for user: {self.user}")
            await self.accept()
        else:
            logger.warning(f"Unauthenticated WebSocket connection attempt")
            await self.close()

    async def disconnect(self, close_code):
        logger.info(f"WebSocket disconnected for user: {self.user}, code: {close_code}")
        if self.user and self.user.is_authenticated:
            await self.channel_layer.group_discard(
                f"user_{self.user.id}",
                self.channel_name
            )

    async def receive(self, text_data):
        logger.info(f"Received WebSocket message: {text_data}")
        try:
            data = json.loads(text_data)
            logger.info(f"Parsed WebSocket data: {data}")
            # Handle the received data here
        except json.JSONDecodeError:
            logger.error(f"Failed to parse WebSocket message: {text_data}")

    async def task_update(self, event):
        logger.info(f"Sending task update to user {self.user}: {event}")
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_user_from_token(self):
        query_string = parse_qs(self.scope['query_string'].decode())
        token = query_string.get('token', [None])[0]
        if not token:
            logger.error("No token provided in WebSocket connection")
            return None
        try:
            access_token = AccessToken(token)
            user = User.objects.get(id=access_token['user_id'])
            return user
        except (TokenError, User.DoesNotExist) as e:
            logger.error(f"Failed to authenticate WebSocket connection: {str(e)}")
            return None