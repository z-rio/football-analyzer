from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

User = get_user_model()


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    # Columns displayed in the user list table
    list_display = ('email', 'phone_number', 'role', 'status', 'is_staff', 'is_active')
    
    # Filters available on the right sidebar
    list_filter = ('role', 'status', 'is_staff', 'is_active')
    
    # Search box configuration
    search_fields = ('email', 'phone_number')
    
    # Ordering in the list view
    ordering = ('email',)

    # Form layout when editing an existing user in the admin panel
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('phone_number',)}),
        ('System Role & Status', {'fields': ('role', 'status')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    # Form layout when creating a NEW user via the admin panel
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'password', 'phone_number', 'role', 'status'),
            },
        ),
    )