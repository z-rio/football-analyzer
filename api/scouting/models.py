from django.db import models


class Player(models.Model):
    class Position(models.TextChoices):
        FORWARD = 'Forward', 'Forward'
        MIDFIELDER = 'Midfielder', 'Midfielder'
        DEFENDER = 'Defender', 'Defender'
        GOALKEEPER = 'Goalkeeper', 'Goalkeeper'

    class Region(models.TextChoices):
        NAIROBI = 'Nairobi', 'Nairobi'
        NYANZA = 'Nyanza', 'Nyanza'
        WESTERN = 'Western', 'Western'
        RIFT_VALLEY = 'Rift Valley', 'Rift Valley'
        COAST = 'Coast', 'Coast'
        CENTRAL = 'Central', 'Central'

    name = models.CharField(max_length=150)
    position = models.CharField(max_length=20, choices=Position.choices)
    age = models.IntegerField()
    club = models.CharField(max_length=150)
    nationality = models.CharField(max_length=100, default='Kenyan')
    region = models.CharField(max_length=50, choices=Region.choices)
    rating = models.IntegerField(default=70)
    x_g = models.FloatField(default=0.0)
    x_a = models.FloatField(default=0.0)
    matches_played = models.IntegerField(default=0)
    goals = models.IntegerField(default=0)
    assists = models.IntegerField(default=0)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return self.name


class ScoutReport(models.Model):
    player = models.ForeignKey(
        Player,
        related_name='reports',
        on_delete=models.CASCADE,
    )
    scout_name = models.CharField(max_length=150)
    comments = models.TextField()
    recommended_rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.scout_name} on {self.player.name}'
