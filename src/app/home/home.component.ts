import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from '../upload/upload.component';
import { ResultsComponent } from '../results/results.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    UploadComponent,
    ResultsComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  rawData: any[] = [];
  columns: string[] = [];
  groupKey = '';
  pairs: [string, string][] = [];

  onDataParsed(data: any[]) {
    this.rawData = data;
    this.columns = Object.keys(data[0] || {}).filter((c) => c !== 'Name');
    this.groupKey = this.columns[0] || '';
  }

  generatePairs() {
    const shuffled = this.shuffle([...this.rawData]);
    this.pairs = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      this.pairs.push([
        shuffled[i]?.Name || 'TBD',
        shuffled[i + 1]?.Name || 'TBD'
      ]);
    }
  }

  private shuffle(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
