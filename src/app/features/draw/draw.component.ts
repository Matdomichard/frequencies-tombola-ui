import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="draw-container">
      <mat-card>
        <mat-card-title>🎲 Tirage au Sort</mat-card-title>
        <mat-card-content>
          <canvas #wheelCanvas width="500" height="500"></canvas>
          <p *ngIf="!isDrawing">Cliquez pour tirer les lots.</p>
          <p *ngIf="isDrawing">⏳ Tirage en cours...</p>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="startSpin()"
            [disabled]="isDrawing"
          >
            <mat-icon>casino</mat-icon>
            Tirer les lots
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class DrawComponent implements OnInit, AfterViewInit {
  @ViewChild('wheelCanvas', { static: true }) wheelCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() tombolaId!: number;
  @Output() drawComplete = new EventEmitter<any>();
  
  isDrawing = false;
  ctx!: CanvasRenderingContext2D;
  rotation = 0;
  segments = [
    { color: '#eae56f', text: 'Lot 1' },
    { color: '#89f26e', text: 'Lot 2' },
    { color: '#7de6ef', text: 'Lot 3' },
    { color: '#e7706f', text: 'Lot 4' },
    { color: '#eae56f', text: 'Lot 5' },
    { color: '#89f26e', text: 'Lot 6' }
  ];

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Suppression de la récupération de l'ID via la route
    // car maintenant nous utilisons l'Input
  }

  ngAfterViewInit(): void {
    if (this.wheelCanvas && this.wheelCanvas.nativeElement) {
        this.ctx = this.wheelCanvas.nativeElement.getContext('2d')!;
        requestAnimationFrame(() => {
            this.drawWheel();
        });
    }
}

  drawWheel(): void {
    if (!this.ctx) {
        console.error('Contexte du canvas non initialisé');
        return;
    }

    const canvas = this.wheelCanvas.nativeElement;
    const ctx = this.ctx;
    
    // Définir une taille fixe pour le canvas
    canvas.width = 500;
    canvas.height = 500;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50; // Réduire légèrement le rayon

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner un cercle de fond
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);

    const anglePerSegment = (2 * Math.PI) / this.segments.length;

    this.segments.forEach((segment, index) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, index * anglePerSegment, (index + 1) * anglePerSegment);
      ctx.closePath();

      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Améliorer le rendu du texte
      ctx.save();
      ctx.rotate(index * anglePerSegment + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(segment.text, radius - 30, 0);
      ctx.restore();
    });

    ctx.restore();

    // Dessiner le pointeur
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + radius + 10, centerY - 20);
    ctx.lineTo(canvas.width / 2 + radius + 40, centerY);
    ctx.lineTo(canvas.width / 2 + radius + 10, centerY + 20);
    ctx.closePath();
    ctx.fillStyle = '#f44336';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  startSpin(): void {
    if (!this.tombolaId) return;
    this.isDrawing = true;

    const audio = new Audio('/wheel-spin.mp3');
    audio.loop = true;
    audio.volume = 0.7;
    audio.play().catch(console.error);

    this.apiService.draw(this.tombolaId).subscribe({
      next: (result) => {
        const winningIndex = Math.floor(Math.random() * this.segments.length);
        const baseRotations = 15;
        const finalRotation = (baseRotations * 360) + (360 - (winningIndex * (360 / this.segments.length)));
        
        gsap.to(this, {
          rotation: (finalRotation * Math.PI) / 180,
          duration: 15,
          ease: "power4.inOut",
          onUpdate: () => this.drawWheel(),
          onComplete: () => {
            audio.pause();
            audio.currentTime = 0;
            this.isDrawing = false;
            // Émettre l'événement de fin de tirage
            this.drawComplete.emit(result);
          }
        });
      },
      error: (err) => {
        console.error('❌ Erreur lors du tirage:', err);
        audio.pause();
        audio.currentTime = 0;
        this.isDrawing = false;
        this.drawComplete.emit(null);
      }
    });
  }
}
