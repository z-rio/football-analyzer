from django.core.management.base import BaseCommand
from faker import Faker
import random

from django.contrib.auth import get_user_model
User = get_user_model()

fake = Faker()


class Command(BaseCommand):
    help = "Seed 100 users"

    def handle(self, *args, **kwargs):

        self.stdout.write(self.style.WARNING("Seeding 100 users..."))
        self.stdout.write(self.style.WARNING("This will delete all existing users!"))

        User.objects.all().delete()

        self.stdout.write(self.style.WARNING("Existing users deleted."))


        for i in range(100):

            User.objects.create_user(
                email=f"user{i}@example.com",
                password="Password123!",
                phone_number=f"07{random.randint(10000000, 99999999)}",
                role=random.choice(
                    [
                        User.Role.PLAYER,
                        User.Role.FAN,
                        User.Role.COACH,
                        User.Role.CLUB_MANAGER,
                    ]
                ),
                status=random.choices(
                    [User.Status.ACTIVE,
                     User.Status.PENDING,
                     User.Status.SUSPENDED],
                    weights=[70, 20, 10]
                )[0],
            )

        self.stdout.write(
            self.style.SUCCESS("100 users seeded successfully")
        )