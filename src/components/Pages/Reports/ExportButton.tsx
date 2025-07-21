import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { TrafficData } from '../../../types';
import { format } from 'date-fns';

interface ExportButtonProps {
  data: TrafficData[];
  activeFilter: string;
  selectedDate: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, activeFilter, selectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPaymentMethodDisplay = () => {
    const methodMap: { [key: string]: string } = {
      'tunai': 'Tunai',
      'etoll': 'E-Toll',
      'flo': 'Flo',
      'ktp': 'KTP',
      'etoll-tunai-flo': 'E-Toll+Tunai+Flo',
      'keseluruhan': 'E-Toll+Tunai+Flo'
    };
    return methodMap[activeFilter] || 'E-Toll+Tunai+Flo';
  };

const getFilteredData = () => {
  if (!data || data.length === 0) return [];

  return data.map(item => {
    let total = 0;

    if (activeFilter === 'keseluruhan') {
      total =
        item.Tunai +
        item.DinasOpr +
        item.DinasMitra +
        item.DinasKary +
        item.eFlo +
        item.eMandiri +
        item.eBri +
        item.eBni +
        item.eBca +
        item.eNobu +
        item.eDKI +
        item.eMega || 0;
    } else if (activeFilter === 'tunai') {
      total = item.Tunai || 0;
    } else if (activeFilter === 'etoll') {
      total =
        item.eMandiri +
        item.eBri +
        item.eBni +
        item.eBca +
        item.eNobu +
        item.eDKI +
        item.eMega || 0;
    } else if (activeFilter === 'flo') {
      total = item.eFlo || 0;
    } else if (activeFilter === 'etoll-tunai-flo') {
      total =
        item.Tunai +
        item.eFlo +
        item.eMandiri +
        item.eBri +
        item.eBni +
        item.eBca +
        item.eNobu +
        item.eDKI +
        item.eMega || 0;
    }

    return {
      ...item,
      TotalByFilter: total,
    };
  });
};


  const exportToExcel = () => {
    const filteredData = getFilteredData();
    const paymentMethod = getPaymentMethodDisplay();
    
    const headers = [
      'No.',
      'Ruas',
      'Gerbang',
      'Gardu',
      'Hari',
      'Tanggal',
      'Metode Pembayaran',
      'Gol I',
      'Gol II',
      'Gol III',
      'Gol IV',
      'Gol V',
      'Total',
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map((item, index) => [
        index + 1,
        `Ruas ${item.IdCabang}`,
        item.IdGerbang,
        `0${index + 1}`,
        ['Kamis', 'Rabu', 'Selasa', 'Senin', 'Minggu', 'Sabtu'][index % 6],
        new Date(item.Tanggal).toLocaleDateString('id-ID'),
        paymentMethod,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-lalin-${selectedDate}-${activeFilter}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsOpen(false);
  };

  const CountfilteredData =(item: TrafficData) => {
    if (activeFilter === 'keseluruhan') {
      return item.Tunai + item.DinasOpr + item.DinasMitra + item.DinasKary + item.eFlo + item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega || 0;
    } else if (activeFilter === 'tunai') {
      return item.Tunai || 0;
    } else if (activeFilter === 'etoll') {
      return item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega || 0;
    } else if (activeFilter === 'eFlo') {
      return item.eFlo || 0;
    } else if (activeFilter === 'etoll-tunai-flo') {
      return item.Tunai + item.eFlo + item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega || 0;
    } return 0;
  }

  const exportToPDF = () => {
    const filteredData = getFilteredData();
    const paymentMethod = getPaymentMethodDisplay();

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = filteredData.map((item, index) => {
      const gol1 = item.Golongan === 1 ? CountfilteredData(item) : 0;
      const gol2 = item.Golongan === 2 ? CountfilteredData(item) : 0;
      const gol3 = item.Golongan === 3 ? CountfilteredData(item) : 0;
      const gol4 = item.Golongan === 4 ? CountfilteredData(item) : 0;
      const gol5 = item.Golongan === 5 ? CountfilteredData(item) : 0;
      const total = CountfilteredData(item);

      return `
        <tr>
          <td>${index + 1}</td>
          <td>Ruas ${item.IdCabang}</td>
          <td>${item.IdGerbang}</td>
          <td>${item.IdGardu}</td>
          <td>${format(new Date(item.Tanggal), 'eeee')}</td>
          <td>${format(new Date(item.Tanggal), 'dd-MM-yyyy')}</td>
          <td>${paymentMethod}</td>
          <td>${gol1}</td>
          <td>${gol2}</td>
          <td>${gol3}</td>
          <td>${gol4}</td>
          <td>${gol5}</td>
          <td>${total}</td>
        </tr>
      `;
    }).join('');

    const ruasSummary = {} as Record<number, { Gol1: number; Gol2: number; Gol3: number; Gol4: number; Gol5: number; Total: number }>;
    filteredData.forEach(item => {
      const key = item.IdCabang;
      const val = CountfilteredData(item);

      if (!ruasSummary[key]) {
        ruasSummary[key] = { Gol1: 0, Gol2: 0, Gol3: 0, Gol4: 0, Gol5: 0, Total: 0 };
      }

      if (item.Golongan === 1) ruasSummary[key].Gol1 += val;
      if (item.Golongan === 2) ruasSummary[key].Gol2 += val;
      if (item.Golongan === 3) ruasSummary[key].Gol3 += val;
      if (item.Golongan === 4) ruasSummary[key].Gol4 += val;
      if (item.Golongan === 5) ruasSummary[key].Gol5 += val;

      ruasSummary[key].Total += val;
    });

    const summaryRows = Object.entries(ruasSummary).map(([key, totals]) => `
      <tr style="background-color: #f9f9f9; font-weight: bold;">
        <td colspan="7">Total Lalin Ruas ${key}</td>
        <td>${totals.Gol1}</td>
        <td>${totals.Gol2}</td>
        <td>${totals.Gol3}</td>
        <td>${totals.Gol4}</td>
        <td>${totals.Gol5}</td>
        <td>${totals.Total}</td>
      </tr>
    `).join('');

    const grandTotal = filteredData.reduce((acc, item) => {
      const val = CountfilteredData(item);
      if (item.Golongan === 1) acc.Gol1 += val;
      if (item.Golongan === 2) acc.Gol2 += val;
      if (item.Golongan === 3) acc.Gol3 += val;
      if (item.Golongan === 4) acc.Gol4 += val;
      if (item.Golongan === 5) acc.Gol5 += val;
      acc.Total += val;
      return acc;
    }, { Gol1: 0, Gol2: 0, Gol3: 0, Gol4: 0, Gol5: 0, Total: 0 });

    const finalTotalRow = `
      <tr style="background-color: #6b7280; color: white; font-weight: bold;">
        <td colspan="7">Total Lalin Keseluruhan</td>
        <td>${grandTotal.Gol1}</td>
        <td>${grandTotal.Gol2}</td>
        <td>${grandTotal.Gol3}</td>
        <td>${grandTotal.Gol4}</td>
        <td>${grandTotal.Gol5}</td>
        <td>${grandTotal.Total}</td>
      </tr>
    `;

    const html = `
      <html>
        <head>
          <title>Laporan Lalin Per Hari</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #999; padding: 8px; font-size: 12px; text-align: center; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Laporan Lalin Per Hari</h1>
          <p>Tanggal: ${new Date(selectedDate).toLocaleDateString('id-ID')}</p>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Ruas</th>
                <th>Gerbang</th>
                <th>Gardu</th>
                <th>Hari</th>
                <th>Tanggal</th>
                <th>Metode Pembayaran</th>
                <th>Gol I</th>
                <th>Gol II</th>
                <th>Gol III</th>
                <th>Gol IV</th>
                <th>Gol V</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              ${summaryRows}
              ${finalTotalRow}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={exportToExcel}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FileSpreadsheet className="h-4 w-4 mr-3 text-green-600" />
                Export to Excel
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FileText className="h-4 w-4 mr-3 text-red-600" />
                Export to PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;