from rest_framework import serializers

from .models import Player, ScoutReport


class ScoutReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoutReport
        fields = [
            'id',
            'player',
            'scout_name',
            'comments',
            'recommended_rating',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PlayerSerializer(serializers.ModelSerializer):
    xG = serializers.FloatField(source='x_g')
    xA = serializers.FloatField(source='x_a')

    class Meta:
        model = Player
        fields = [
            'id',
            'name',
            'position',
            'age',
            'club',
            'nationality',
            'region',
            'rating',
            'xG',
            'xA',
            'matches_played',
            'goals',
            'assists',
        ]


class PlayerDetailSerializer(PlayerSerializer):
    reports = ScoutReportSerializer(many=True, read_only=True)

    class Meta(PlayerSerializer.Meta):
        fields = PlayerSerializer.Meta.fields + ['reports']
