import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccessService, CameraAccess } from '../../services/access.service.ts.service';
import { AiAnalysisService, AIPrediction, AccessAnalysis } from '../../services-ai/ai-analysis.service';

@Component({
  selector: 'app-camera-access-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './camera-access-list.component.html',
  styleUrls: ['./camera-access-list.component.css']
})
export class CameraAccessListComponent implements OnInit {
  // === PROPRIÉTÉS CRUD EXISTANTES ===
  accesses: CameraAccess[] = [];
  newAccess: Partial<CameraAccess> = { permission: 'view_live' };
  users: { id: number; username: string }[] = [];
  cameras: { id: number; name: string }[] = [];
  editing: CameraAccess | null = null;

  // === PROPRIÉTÉS IA (NOUVELLES) ===
  aiAnalyses: Map<number, AccessAnalysis> = new Map();
  showAIPanel = false;
  modelInfo: any = null;
  isTraining = false;

  constructor(
    private accessService: AccessService,
    private aiAnalysisService: AiAnalysisService
  ) {}

  ngOnInit(): void {
    // Charger d'abord users et cameras, puis les accès
    this.accessService.getUsers().subscribe(u => {
      this.users = u;
      this.accessService.getCameras().subscribe(c => {
        this.cameras = c;
        this.reload(); // après avoir les 2 listes
      });
    });
  }

  // === MÉTHODES CRUD EXISTANTES (INTACTES) ===
  reload(): void {
    this.accessService.getCameraAccess().subscribe(data => {
      // enrichir chaque accès avec les noms
      this.accesses = data.map(a => ({
        ...a,
        user_username: this.users.find(u => u.id === a.user)?.username || 'Inconnu',
        camera_name: this.cameras.find(c => c.id === a.camera)?.name || 'Inconnue'
      }));
    });
  }

  add(): void {
    // VÉRIFICATION DES CHAMPS OBLIGATOIRES - CORRIGÉ
    if (!this.newAccess.user || !this.newAccess.camera || !this.newAccess.permission) {
      alert('❌ Veuillez remplir tous les champs obligatoires (Utilisateur, Caméra, Permission)');
      return;
    }

    this.accessService.addCameraAccess(this.newAccess).subscribe({
      next: res => {
        const newA = {
          ...res,
          user_username: this.users.find(u => u.id === res.user)?.username || 'Inconnu',
          camera_name: this.cameras.find(c => c.id === res.camera)?.name || 'Inconnue'
        };
        this.accesses.push(newA);
        
        // RÉINITIALISATION CORRECTE du formulaire
        this.newAccess = { 
          permission: 'view_live',
          user: undefined,
          camera: undefined,
          expires_at: undefined
        };
        
        alert('✅ Accès ajouté avec succès!');
      },
      error: err => {
        console.error('Add error', err);
        alert('❌ Erreur lors de l\'ajout de l\'accès: ' + (err.error?.message || err.message));
      }
    });
  }

  startEdit(a: CameraAccess) {
    this.editing = { ...a };
  }

  saveEdit() {
    if (!this.editing?.id) return;
    this.accessService.updateCameraAccess(this.editing.id, this.editing).subscribe({
      next: res => {
        const i = this.accesses.findIndex(x => x.id === res.id);
        if (i > -1) {
          this.accesses[i] = {
            ...res,
            user_username: this.users.find(u => u.id === res.user)?.username || 'Inconnu',
            camera_name: this.cameras.find(c => c.id === res.camera)?.name || 'Inconnue'
          };
        }
        this.editing = null;
        alert('✅ Accès modifié avec succès!');
      },
      error: err => {
        console.error('Update error', err);
        alert('❌ Erreur lors de la modification');
      }
    });
  }

  delete(id?: number) {
    if (!id) return;
    if (!confirm('Confirmer la suppression ?')) return;
    this.accessService.deleteCameraAccess(id).subscribe({
      next: () => {
        this.accesses = this.accesses.filter(a => a.id !== id);
        alert('✅ Accès supprimé avec succès!');
      },
      error: err => {
        console.error('Delete error', err);
        alert('❌ Erreur lors de la suppression');
      }
    });
  }

  // === MÉTHODES IA (NOUVELLES) ===
  toggleAIPanel(): void {
    this.showAIPanel = !this.showAIPanel;
    if (this.showAIPanel) {
      this.getModelInfo();
    }
  }

  getModelInfo(): void {
    this.aiAnalysisService.getModelInfo().subscribe({
      next: (info) => {
        this.modelInfo = info;
      },
      error: (error) => {
        this.modelInfo = { 
          status: 'error', 
          message: 'Modèle non disponible' 
        };
      }
    });
  }

  analyzeAccess(accessId: number): void {
    const access = this.accesses.find(a => a.id === accessId);
    if (!access) return;

    this.aiAnalyses.set(accessId, {
      access_id: accessId,
      is_analyzing: true,
      last_analyzed: new Date()
    });

    const accessData = {
      user_id: access.user,
      permission: access.permission,
      camera_id: access.camera
    };

    this.aiAnalysisService.analyzeAccess(accessData).subscribe({
      next: (prediction: AIPrediction) => {
        this.aiAnalyses.set(accessId, {
          access_id: accessId,
          prediction: prediction,
          is_analyzing: false,
          last_analyzed: new Date()
        });
      },
      error: (error) => {
        this.aiAnalyses.set(accessId, {
          access_id: accessId,
          prediction: {
            suspicious: false,
            confidence: 0,
            risk_level: 'Erreur',
            model_accuracy: 'N/A',
            error: 'Erreur d\'analyse: ' + (error.error?.error || error.message)
          },
          is_analyzing: false,
          last_analyzed: new Date()
        });
      }
    });
  }

  analyzeAllAccess(): void {
    this.accesses.forEach(access => {
      if (!this.aiAnalyses.has(access.id!)) {
        this.analyzeAccess(access.id!);
      }
    });
  }

  trainModel(): void {
    this.isTraining = true;
    
    this.aiAnalysisService.trainModel().subscribe({
      next: (response) => {
        this.isTraining = false;
        alert('✅ Modèle IA entraîné avec succès!');
        this.getModelInfo();
      },
      error: (error) => {
        this.isTraining = false;
        alert('❌ Erreur lors de l\'entraînement du modèle: ' + (error.error?.error || error.message));
      }
    });
  }

  // Utilitaires IA
  getRiskClass(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case 'très élevé': return 'risk-very-high';
      case 'élevé': return 'risk-high';
      case 'moyen': return 'risk-medium';
      case 'faible': return 'risk-low';
      default: return 'risk-unknown';
    }
  }

  getRiskIcon(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case 'très élevé': return '🔴';
      case 'élevé': return '🟠';
      case 'moyen': return '🟡';
      case 'faible': return '🟢';
      default: return '❓';
    }
  }

  hasAnalysis(accessId: number): boolean {
    return this.aiAnalyses.has(accessId);
  }

  getAnalysis(accessId: number): AccessAnalysis | undefined {
    return this.aiAnalyses.get(accessId);
  }

  removeAnalysis(accessId: number): void {
    this.aiAnalyses.delete(accessId);
  }
}
