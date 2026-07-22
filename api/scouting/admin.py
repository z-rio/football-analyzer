from django.contrib import admin

from .models import Player, ScoutReport


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'position',
        'age',
        'club',
        'region',
        'rating',
        'x_g',
        'x_a',
        'goals',
        'assists',
    )
    list_filter = ('position', 'region', 'nationality')
    search_fields = ('name', 'club')


@admin.register(ScoutReport)
class ScoutReportAdmin(admin.ModelAdmin):
    list_display = (
        'player',
        'scout_name',
        'recommended_rating',
        'created_at',
    )
    list_filter = ('scout_name', 'created_at')
    search_fields = ('player__name', 'scout_name', 'comments')
