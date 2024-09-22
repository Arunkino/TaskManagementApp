from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging
from django.db.models import Count

logger = logging.getLogger(__name__)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        task = serializer.save(user=self.request.user)
        logger.info(f"Task created: {task.id} by user: {self.request.user}")
        self.send_task_update('create', task)

    def perform_update(self, serializer):
        task = serializer.save()
        logger.info(f"Task updated: {task.id} by user: {self.request.user}")
        self.send_task_update('update', task)

    def perform_destroy(self, instance):
        task_id = instance.id
        logger.info(f"Task deleted: {task_id} by user: {self.request.user}")
        instance.delete()
        self.send_task_update('delete', {'id': task_id})

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    

    # Send WebSocket message
    def send_task_update(self, action, task):
        channel_layer = get_channel_layer()
        data = {
            "type": "task_update",
            "action": action,
            "task": TaskSerializer(task).data if isinstance(task, Task) else task
        }
        async_to_sync(channel_layer.group_send)(
            f"user_{self.request.user.id}",
            data
        )
        logger.info(f"WebSocket message sent for {action} task: {task.id if isinstance(task, Task) else task}")

    # Statistics view
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        user_tasks = Task.objects.filter(user=request.user)
        total_tasks = user_tasks.count()
        completed_tasks = user_tasks.filter(completed=True).count()
        pending_tasks = total_tasks - completed_tasks

        # Get tasks created in the last 7 days
        from django.utils import timezone
        from datetime import timedelta
        seven_days_ago = timezone.now() - timedelta(days=7)
        tasks_last_7_days = user_tasks.filter(created_at__gte=seven_days_ago).count()

        # Get tasks by day of week
        from django.db.models.functions import ExtractWeekDay
        tasks_by_day = user_tasks.annotate(day=ExtractWeekDay('created_at')) \
                               .values('day') \
                               .annotate(count=Count('id')) \
                               .order_by('day')

        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        tasks_by_day_dict = {days[item['day']-1]: item['count'] for item in tasks_by_day}

        data = {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'tasks_last_7_days': tasks_last_7_days,
            'tasks_by_day': tasks_by_day_dict
        }

        return Response(data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        logger.info(f"New user registered: {user.username}")
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    logger.warning(f"User registration failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)