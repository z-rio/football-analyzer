from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AnalyticsSummaryView, PlayerViewSet, ScoutReportViewSet

router = DefaultRouter()
router.register(r'players', PlayerViewSet, basename='player')
router.register(r'reports', ScoutReportViewSet, basename='report')

urlpatterns = [
    path('analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('', include(router.urls)),
]
