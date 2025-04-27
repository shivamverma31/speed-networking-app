import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Papa from 'papaparse';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Output() dataParsed = new EventEmitter<any[]>();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => this.dataParsed.emit(result.data as any[]),
      error: (error) => console.error('Parse error:', error)
    });
  }
}
