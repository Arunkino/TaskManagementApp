from django.shortcuts import render
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth.models import User

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # Get or create a default user for anonymous tasks
            default_user, created = User.objects.get_or_create(username='anonymous')
            serializer.save(user=default_user)

    def get_queryset(self):
        return self.queryset