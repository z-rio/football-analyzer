from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from core.models import TimeStampModel


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email: 
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        extra_fields.setdefault('role', 'ADMIN') 
        extra_fields.setdefault('status', 'ACTIVE')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimeStampModel):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        CLUB_MANAGER = "CLUB_MANAGER", "Club Manager"
        COACH = "COACH", "Coach"
        PLAYER = "PLAYER", "Player"
        FAN = "FAN", "Fan"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACTIVE = "ACTIVE", "Active"
        SUSPENDED = "SUSPENDED", "Suspended"

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.FAN
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"


class Club(TimeStampModel):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="club"
    )
    club_name = models.CharField(max_length=150)
    registration_number = models.CharField(max_length=100, unique=True)
    county = models.CharField(max_length=100)

    def __str__(self):
        return self.club_name


class Team(TimeStampModel):
    club = models.ForeignKey(
        Club,
        on_delete=models.CASCADE,
        related_name="teams"
    )
    team_name = models.CharField(max_length=100)
    founded_year = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.team_name

class PlayerProfile(TimeStampModel):    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='player_profile'
    )
    
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='players' 
    )

    jersey_number = models.PositiveIntegerField(null=True, blank=True)
    position = models.CharField(max_length=50, blank=True) 

    def __str__(self): 
        f"{self.user.email} - {self.team.team_name}"

class Match(TimeStampModel):
    home_team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name="home_matches"
    )
    away_team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name="away_matches"
    )
    match_date = models.DateTimeField()
    venue = models.CharField(max_length=255)
    home_score = models.IntegerField(default=0)
    away_score = models.IntegerField(default=0)
    played = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} ({self.match_date.strftime('%Y-%m-%d')})"


class Fan(TimeStampModel):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="fan_profile" 
    )
    favorite_team = models.ForeignKey(
        Team,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Fan: {self.user.email}"  