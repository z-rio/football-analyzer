from django.apps import AppConfig


class ScoutingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scouting'

    def ready(self):
        from django.db.models.signals import post_migrate

        def seed_if_empty(sender, **kwargs):
            if sender.name != 'scouting':
                return
            from scouting.models import Player
            from scouting.sample_data import SAMPLE_PLAYERS

            if Player.objects.exists():
                return
            for row in SAMPLE_PLAYERS:
                Player.objects.create(**row)

        post_migrate.connect(seed_if_empty, dispatch_uid='scouting_seed_players')
