from django.core.management.base import BaseCommand

from scouting.models import Player
from scouting.sample_data import SAMPLE_PLAYERS


class Command(BaseCommand):
    help = 'Seed sample Kenyan players when the players table is empty'

    def handle(self, *args, **options):
        if Player.objects.exists():
            self.stdout.write(self.style.WARNING('Players already exist; skipping seed.'))
            return

        for row in SAMPLE_PLAYERS:
            Player.objects.create(**row)

        self.stdout.write(
            self.style.SUCCESS(f'Seeded {len(SAMPLE_PLAYERS)} sample players.')
        )
