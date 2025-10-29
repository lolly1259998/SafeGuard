import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Hls from 'hls.js';
import { Camera, CameraService } from '../../../backoffice/services/camera.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoEl', { static: false }) videoEl?: ElementRef<HTMLVideoElement>;

  camera: Camera | null = null;
  hls?: Hls;
  error = '';
  loading = true;
  private pendingUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private cameraService: CameraService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Identifiant caméra manquant';
      this.loading = false;
      return;
    }
    this.cameraService.get(id).subscribe({
      next: cam => {
        this.camera = cam;
        this.loading = false;
        this.pendingUrl = cam.stream_url;
        this.cdr.detectChanges(); // Force la mise à jour de la vue
        setTimeout(() => this.maybeStart(), 0); // Attend le prochain cycle
      },
      error: err => {
        this.error = err.message || 'Erreur de chargement de la caméra';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.maybeStart(), 0);
  }

  private maybeStart() {
    if (!this.videoEl?.nativeElement || !this.pendingUrl) {
      // Si pas prêt, réessayer dans 50ms
      if (this.pendingUrl) {
        setTimeout(() => this.maybeStart(), 50);
      }
      return;
    }
    const url = this.pendingUrl;
    this.pendingUrl = null;
    this.startPlayback(url);
  }

  private startPlayback(url: string) {
    if (!this.videoEl?.nativeElement) {
      this.error = 'Élément vidéo non disponible';
      return;
    }
    const video = this.videoEl.nativeElement;
    video.muted = true; // pour maximiser l'autoplay
    video.autoplay = true;
    (video as any).playsInline = true;

    if (url.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        this.hls = new Hls({ enableWorker: true });
        this.hls.on(Hls.Events.ERROR, (_e, data) => {
          const level = data.fatal ? 'fatale' : 'non fatale';
          this.error = `Erreur HLS (${level}) - type: ${data.type}${data.details ? ", details: " + data.details : ''}`;
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                this.hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                this.hls?.recoverMediaError();
                break;
              default:
                this.hls?.destroy();
                break;
            }
          }
        });
        this.hls.loadSource(url);
        this.hls.attachMedia(video);
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(() => {});
      } else {
        this.error = 'Votre navigateur ne supporte pas HLS. Essayez Chrome/Edge récents.';
      }
    } else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      video.src = url;
      video.play().catch(() => {});
    } else if (url.match(/^https?:\/\//i)) {
      this.error = 'Flux non supporté par ce lecteur. Si MJPEG, utilisez <img src=URL>.';
    } else {
      this.error = 'URL de flux inconnue.';
    }
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
