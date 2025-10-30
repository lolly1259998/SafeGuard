import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';
import { Camera, CameraService } from '../../../backoffice/services/camera.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoEl', { static: false }) videoEl?: ElementRef<HTMLVideoElement>;
  @ViewChild('imgEl', { static: false }) imgEl?: ElementRef<HTMLImageElement>;
  @ViewChild('canvasEl', { static: false }) canvasEl?: ElementRef<HTMLCanvasElement>;

  camera: Camera | null = null;
  hls?: Hls;
  error = '';
  loading = true;
  private pendingUrl: string | null = null;
  mjpegUrl: string | null = null;

  // Overlay state
  overlayOn = true;
  nightMode = false;
  metrics = { fps: 0, luma: 0, darkPct: 0 };
  private animationId: number | null = null;
  private lastFrameAt = 0;

  // Smoothing (EMA) and throttle
  private ema = { fps: 0, luma: 0, darkPct: 0 };
  private lastMetricsUpdate = 0;
  private readonly emaAlpha = 0.2;
  private readonly metricsEveryMs = 500;

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
        this.cdr.detectChanges();
        setTimeout(() => this.maybeStart(), 0);
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
    if (!this.pendingUrl) return;
    if (this.isMjpeg(this.pendingUrl)) {
      this.mjpegUrl = this.pendingUrl;
      this.pendingUrl = null;
      this.error = '';
      this.startOverlayLoop();
      return;
    }
    if (!this.videoEl?.nativeElement) {
      setTimeout(() => this.maybeStart(), 50);
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
    video.muted = true;
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
          this.startOverlayLoop();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(() => {});
        this.startOverlayLoop();
      } else {
        this.error = 'Votre navigateur ne supporte pas HLS. Essayez Chrome/Edge récents.';
      }
    } else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      video.src = url;
      video.play().catch(() => {});
      this.startOverlayLoop();
    } else if (this.isMjpeg(url)) {
      this.mjpegUrl = url;
      this.error = '';
      this.startOverlayLoop();
    } else if (url.match(/^https?:\/\//i)) {
      this.error = 'Flux non supporté par ce lecteur.';
    } else {
      this.error = 'URL de flux inconnue.';
    }
  }

  private startOverlayLoop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    const loop = () => {
      const canvas = this.canvasEl?.nativeElement;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true } as any);
      const video = this.videoEl?.nativeElement;
      const img = this.imgEl?.nativeElement;
      const srcEl: HTMLVideoElement | HTMLImageElement | undefined = this.mjpegUrl ? img : video;

      if (canvas && ctx && srcEl && this.overlayOn) {
        let w = 1280, h = 720;
        if (srcEl instanceof HTMLVideoElement) {
          w = srcEl.videoWidth || srcEl.clientWidth || w;
          h = srcEl.videoHeight || srcEl.clientHeight || h;
        } else if (srcEl instanceof HTMLImageElement) {
          w = srcEl.naturalWidth || srcEl.width || w;
          h = srcEl.naturalHeight || srcEl.height || h;
        }
        if (w > 0 && h > 0) {
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w; canvas.height = h;
          }
          (ctx as any).filter = this.nightMode ? 'brightness(1.25) contrast(1.15) saturate(1.05)' : 'none';
          (ctx as CanvasRenderingContext2D).drawImage(srcEl as any, 0, 0, w, h);

          // Metrics (EMA/throttle)
          try {
            const sampleSize = 64;
            const sw = Math.min(sampleSize, w), sh = Math.min(sampleSize, h);
            const data = (ctx as CanvasRenderingContext2D).getImageData(0, 0, sw, sh).data;
            let lumaSum = 0, dark = 0;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i], g = data[i+1], b = data[i+2];
              const y = 0.2126*r + 0.7152*g + 0.0722*b;
              lumaSum += y;
              if (y < 20) dark++;
            }
            const pixels = Math.max(1, data.length / 4);
            const now = performance.now();
            const dt = this.lastFrameAt ? (now - this.lastFrameAt) : 0;
            this.lastFrameAt = now;
            const raw = { fps: dt > 0 ? Math.min(99, 1000 / dt) : this.ema.fps, luma: lumaSum / pixels, darkPct: (dark / pixels) * 100 };
            this.ema.fps = this.emaAlpha * raw.fps + (1 - this.emaAlpha) * this.ema.fps;
            this.ema.luma = this.emaAlpha * raw.luma + (1 - this.emaAlpha) * this.ema.luma;
            this.ema.darkPct = this.emaAlpha * raw.darkPct + (1 - this.emaAlpha) * this.ema.darkPct;
            if (now - this.lastMetricsUpdate >= this.metricsEveryMs) {
              this.metrics = { fps: Math.round(this.ema.fps), luma: Math.round(this.ema.luma), darkPct: Math.round(this.ema.darkPct) };
              this.lastMetricsUpdate = now;
            }
          } catch {}
        }
      }
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  private isMjpeg(url: string): boolean {
    return /\.(mjpg|mjpeg)(\?.*)?$/i.test(url);
  }

  ngOnDestroy(): void {
    if (this.hls) this.hls.destroy();
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}
