import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaisseSessionReportService {

  exportSessionsPdf(sessions: any[]): void {

    let html = `
      <html>
        <head>
          <title>Rapport sessions caisse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Rapport sessions caisse</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Caissier</th>
                <th>Ouverture</th>
                <th>Fermeture</th>
                <th>Espèces</th>
                <th>Carte</th>
                <th>Commandes</th>
                <th>Écart</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
    `;

    sessions.forEach(session => {
      html += `
        <tr>
          <td>#${session.id}</td>
          <td>${session.openedByName || ''}</td>
          <td>${session.openedAt || ''}</td>
          <td>${session.closedAt || ''}</td>
          <td>${session.totalCash || 0} DH</td>
          <td>${session.totalCard || 0} DH</td>
          <td>${session.ordersCount || 0}</td>
          <td>${session.differenceAmount || 0} DH</td>
          <td>${session.status || ''}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  }
}