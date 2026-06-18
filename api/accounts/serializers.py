from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import Club, Team, PlayerProfile, Match, Fan

User = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'role', 'status', 'password']
        read_only_fields = ['id', 'status']


class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'club_name', 'registration_number', 'county']



class PlayerProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlayerProfile
        fields = ['id', 'team']


class FanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        fields = ['id', 'favorite_team']


class CustomClubRegistrationSerializer(serializers.Serializer):

    user = CustomUserSerializer()
    club = ClubSerializer()

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        club_data = validated_data.pop('club')

        with transaction.atomic():
            user_data['role'] = User.Role.CLUB_MANAGER
            user = User.objects.create_user(**user_data)
            Club.objects.create(user=user, **club_data)
        
        return {"user": user, "club": user.club}


class CustomTeamRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = ['id', 'club', 'team_name', 'founded_year']



class CustomMatchSerializer(serializers.ModelSerializer):

    home_team_name = serializers.CharField(source='home_team.team_name', read_only=True)
    away_team_name = serializers.CharField(source='away_team.team_name', read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'home_team', 'home_team_name', 
            'away_team', 'away_team_name', 
            'match_date', 'venue', 
            'home_score', 'away_score', 'played'
        ]

    def validate(self, data):

        home_team = data.get('home_team') or (self.instance.home_team if self.instance else None)
        away_team = data.get('away_team') or (self.instance.away_team if self.instance else None)

        if home_team == away_team:
            raise serializers.ValidationError("A team cannot play a match against itself.")
        return data

class UserVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['status']

    def validate_status(self, value):

        if value not in [User.Status.ACTIVE, User.Status.SUSPENDED]:
            raise serializers.ValidationError("Admin can only set status to ACTIVE or SUSPENDED.")
        return value