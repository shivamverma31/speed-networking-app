import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from '../upload/upload.component';
import { ResultsComponent } from '../results/results.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  rawData: any[] = [];
  groups: string[][] = [];
  resetFileInput = false;

  onDataParsed(data: any[]) {
    this.rawData = data;
  }

  generateGroups() {
    const grouped: string[][] = [];
    const usedIndices = new Set<number>();

    // Try to match participants based on similar interests
    for (let i = 0; i < this.rawData.length; i++) {
      if (usedIndices.has(i)) continue;
      const group = [this.rawData[i]];
      usedIndices.add(i);

      for (let j = i + 1; j < this.rawData.length; j++) {
        if (usedIndices.has(j)) continue;

        // Compare common interests
        let commonScore = this.getCommonScore(this.rawData[i], this.rawData[j]);
        if (commonScore >= 2) { // Match if at least 2 interests match
          group.push(this.rawData[j]);
          usedIndices.add(j);
        }

        if (group.length === 4) break; // Group of 4 complete
      }

      grouped.push(group.map(p => p.Name));
    }

    // Handle remaining participants (force groups even if not perfect matches)
    const remaining = this.rawData
      .map((p, idx) => ({ ...p, idx }))
      .filter(p => !usedIndices.has(p.idx));

    if (remaining.length) {
      let tempGroup: string[] = [];
      for (let r of remaining) {
        tempGroup.push(r.Name);
        if (tempGroup.length === 4) {
          grouped.push([...tempGroup]);
          tempGroup = [];
        }
      }
      if (tempGroup.length > 0) {
        grouped.push(tempGroup); // Last incomplete group
      }
    }

    this.groups = grouped;
  }

  private getCommonScore(a: any, b: any) {
    let score = 0;
    for (const key in a) {
      if (key !== 'Name' && a[key] && b[key] && a[key] === b[key]) {
        score++;
      }
    }
    return score;
  }

  clearData() {
    this.rawData = [];
    this.groups = [];
    this.resetFileInput = true; // Trigger file input reset
    setTimeout(() => (this.resetFileInput = false), 0); // Reset the flag
  }
}
