from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

# ========================
# 1. Utilisateurs
# ========================
class User(AbstractUser):

    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('supervisor', 'Superviseur'),
        ('user', 'Utilisateur Standard'),
    ]
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='core_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='core_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


# ========================
# 2. Caméras
# ========================
class Camera(models.Model):
    STATUS_CHOICES = [
        ('online', 'En ligne'),
        ('offline', 'Hors ligne'),
        ('maintenance', 'Maintenance'),
    ]

    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True)
    stream_url = models.CharField(max_length=255)  # RTSP, HTTP, etc.
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offline')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_cameras')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.location})"


# ========================
# 3. Centres de Contrôle
# ========================
class ControlCenter(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='control_centers')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ========================
# 4. Scénarios de Sécurité (fusion Profils + Règles)
# ========================
class SecurityScenario(models.Model):
    EVENT_TYPES = [
        ('motion', 'Mouvement'),
        ('unknown_face', 'Visage Inconnu'),
        ('suspicious_object', 'Objet Suspect'),
        ('intrusion', 'Intrusion'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Haute'),
        ('critical', 'Critique'),
    ]

    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='security_scenarios')
    
    # Cible
    apply_to_all_cameras = models.BooleanField(default=False)
    cameras = models.ManyToManyField(Camera, blank=True)
    control_center = models.ForeignKey(ControlCenter, null=True, blank=True, on_delete=models.SET_NULL)
    
    # Conditions
    event_types = models.JSONField(default=list, blank=True, null=True)  # FIXED: Use 'list' for serializable default
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    days_of_week = models.JSONField(default=list, blank=True, null=True)  # FIXED: Use 'list' for serializable default
    
    # Actions
    alert_email = models.BooleanField(default=False)
    alert_sms = models.BooleanField(default=False)
    save_recording = models.BooleanField(default=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Activation
    is_active = models.BooleanField(default=False)
    is_manual = models.BooleanField(default=True)  # False → auto-activation horaire
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Scénario de sécurité"
        verbose_name_plural = "Scénarios de sécurité"
        ordering = ['name']

    def clean(self):
        # Validation simple : start_time < end_time si définis
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError("L'heure de début doit être antérieure à l'heure de fin.")

    def get_preview(self):
        """Preview pour listes : Cible | Events | Prio | Statut"""
        if self.apply_to_all_cameras:
            target = "Toutes les caméras"
        elif self.control_center:
            target = f"Centre: {self.control_center.name}"
        else:
            cam_names = [c.name for c in self.cameras.all()[:3]]
            target = f"Caméras: {', '.join(cam_names)}" + ("..." if len(cam_names) < self.cameras.count() else "")
        
        events_str = ", ".join(self.event_types[:2]) if self.event_types else "Tous"
        status = "Actif" if self.is_active else "Inactif"
        return f"{target} | Événements: {events_str} | {self.get_priority_display()} | {status}"

    def __str__(self):
        return f"{self.name} ({self.user.username})"


# ========================
# 5. Accès Utilisateurs
# ========================
class CameraUserAccess(models.Model):
    PERMISSION_CHOICES = [
        ('view_live', 'Visionner le flux en direct'),
        ('view_history', 'Accéder à l’historique'),
        ('manage_alerts', 'Gérer les alertes'),
        ('full_control', 'Contrôle total'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='camera_accesses')
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name='user_accesses')
    permission = models.CharField(max_length=20, choices=PERMISSION_CHOICES)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_camera_accesses')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'camera')

    def __str__(self):
        return f"{self.user.username} → {self.camera.name} ({self.permission})"


class ControlCenterUserAccess(models.Model):
    ACCESS_LEVEL_CHOICES = [
        ('view_only', 'Visualisation seule'),
        ('operator', 'Opérateur'),
        ('admin', 'Administrateur du centre'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='control_center_accesses')
    control_center = models.ForeignKey(ControlCenter, on_delete=models.CASCADE, related_name='user_accesses')
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVEL_CHOICES)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_cc_accesses')
    granted_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'control_center')

    def __str__(self):
        return f"{self.user.username} → {self.control_center.name} ({self.access_level})"


# ========================
# 6. Événements (générés par IA, mais gérables)
# ========================
class Event(models.Model):
    EVENT_TYPES = SecurityScenario.EVENT_TYPES  # Réutilise les mêmes choix

    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    confidence_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="Score de confiance de la détection IA (0.0 à 1.0)"
    )
    metadata = models.JSONField(default=dict, blank=True)  # ex: {"zone": "Entrée", "object_class": "person"}
    is_processed = models.BooleanField(default=False)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.event_type} @ {self.camera.name} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"


# ========================
# (Optionnel) Alertes – liées aux événements
# ========================
class Alert(models.Model):
    ALERT_TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('dashboard', 'Tableau de bord'),
    ]

    PRIORITY_CHOICES = SecurityScenario.PRIORITY_CHOICES

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='alerts')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Alerte {self.priority} pour {self.user.username}"

allModels = [
    User,
    Camera,
    ControlCenter,
    SecurityScenario,
    CameraUserAccess,
    ControlCenterUserAccess,
    Event,
    Alert
]