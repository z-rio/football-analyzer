from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from . import serializers
from . import models


class CustomUserRegisterView(generics.CreateAPIView):

    serializer_class = serializers.CustomUserSerializer


class ClubRegistrationView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = serializers.CustomClubRegistrationSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        
        created_data = serializer.save()
        
        return Response({
            'detail': 'Club and Manager account created successfully.',
            'data': serializers.CustomUserSerializer(created_data['user']).data
        }, status=status.HTTP_201_CREATED)


class TeamRegistrationView(generics.CreateAPIView):

    serializer_class = serializers.CustomTeamRegistrationSerializer

from rest_framework.permissions import IsAdminUser

class VerifyUserView(generics.UpdateAPIView):

    queryset = models.User.objects.all()
    serializer_class = serializers.UserVerificationSerializer
    permission_classes = [IsAdminUser]  

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            "detail": f"User status successfully updated to {request.data.get('status')}.",
            "user": response.data
        }, status=status.HTTP_200_OK)