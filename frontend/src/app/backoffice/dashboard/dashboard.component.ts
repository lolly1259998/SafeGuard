import { Component, AfterViewInit, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule
],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  kpis = [
    { label: 'Active AI Detections', value: 128, desc: 'Last 30 days', color: 'text-primary' },
    { label: 'Critical Alerts', value: 6, desc: 'Escalated to SOC team', color: 'text-danger' },
    { label: 'High Risk Predictions', value: 14, desc: 'AI continuous models', color: 'text-warning' },
    { label: 'Reports Generated', value: 23, desc: 'Exportable (PDF / CSV)', color: 'text-success' },
  ];

  ngOnInit(): void {
    this.renderTimeline();
    this.renderChart();
  }

  renderTimeline() {
    const list = document.getElementById('timelineList');
    const events = [
      { name: 'Camera A', date: new Date(), notes: 'Anomalie détectée' },
      { name: 'Sensor B', date: new Date(), notes: 'Surveillance en cours' },
      { name: 'Firewall C', date: new Date(), notes: 'Intrusion bloquée' },
    ];
    if (list) {
      list.innerHTML = '';
      events.forEach(e => {
        const el = document.createElement('div');
        el.className = 'list-group-item';
        el.innerHTML = `<div class="fw-semibold">${e.name}</div>
                        <div class="small text-muted">${e.date.toLocaleString()} — ${e.notes}</div>`;
        list.appendChild(el);
      });
    }
  }

  renderChart() {
    const ctx = document.getElementById('casePie') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Network', 'Physical', 'Malware', 'Access'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: ['#246bff', '#2fa56a', '#ff7a45', '#e23d3d']
        }]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });
  }
}