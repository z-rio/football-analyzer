from django.db.models import Q
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Player, ScoutReport
from .serializers import (
    PlayerDetailSerializer,
    PlayerSerializer,
    ScoutReportSerializer,
)


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    permission_classes = [AllowAny]
    pagination_class = None
    http_method_names = ['get', 'post', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PlayerDetailSerializer
        return PlayerSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        position = self.request.query_params.get('position')
        search = self.request.query_params.get('search')
        if position:
            qs = qs.filter(position=position)
        if search:
            qs = qs.filter(
                Q(name__icontains=search) | Q(club__icontains=search)
            )
        return qs


class ScoutReportViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ScoutReport.objects.all()
    serializer_class = ScoutReportSerializer
    permission_classes = [AllowAny]


class AnalyticsSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                'totalPlayers': Player.objects.count(),
                'totalReports': ScoutReport.objects.count(),
                'activeScouts': 18,
            }
        )
