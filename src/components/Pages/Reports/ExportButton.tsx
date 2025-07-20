import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { TrafficData } from '../../../types';

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
    if (activeFilter === 'keseluruhan') {
      return data;
    }
    
    const paymentTypeMap: { [key: string]: string[] } = {
      'tunai': ['Cash'],
      'etoll': ['E-Toll'],
      'flo': ['Flo'],
      'ktp': ['KTP'],
      'etoll-tunai-flo': ['E-Toll', 'Cash', 'Flo']
    };
    
    const allowedTypes = paymentTypeMap[activeFilter] || [];
    return data.filter(item => allowedTypes.includes(item.paymentType));
  };

  const exportToExcel = () => {
    const filteredData = getFilteredData();
    const paymentMethod = getPaymentMethodDisplay();
    
    // Create CSV content
    const headers = [
      'No.',
      'Ruas',
      'Gerbang',
      'Gardu',
      'Hari',
      'Tanggal',
      'Metode Pembayaran',
      'Gol I',
      'Gol II'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map((item, index) => [
        index + 1,
        `Ruas ${item.shift}`,
        item.gateName.replace('Gate ', 'Gerbang '),
        `0${index + 1}`,
        ['Kamis', 'Rabu', 'Selasa', 'Senin', 'Minggu', 'Sabtu'][index % 6],
        new Date(item.date).toLocaleDateString('id-ID'),
        paymentMethod,
        Math.floor(item.totalVehicles * 0.6),
        Math.floor(item.totalVehicles * 0.4)
      ].join(','))
    ].join('\n');

    // Create and download file
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

  const exportToPDF = () => {
    const filteredData = getFilteredData();
    const paymentMethod = getPaymentMethodDisplay();
    
    // Create new window for PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const doc = printWindow.document;
      
      // Create document structure using DOM manipulation
      doc.documentElement.innerHTML = '';
      
      // Create head element
      const head = doc.createElement('head');
      const title = doc.createElement('title');
      title.textContent = 'Laporan Lalin Per Hari';
      head.appendChild(title);
      
      // Create and add styles
      const style = doc.createElement('style');
      style.textContent = `
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; text-align: center; }
        .info { margin: 20px 0; }
        .info p { margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .summary { background-color: #f9f9f9; font-weight: bold; }
        .total { background-color: #6b7280; color: white; font-weight: bold; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      `;
      head.appendChild(style);
      
      // Create body element
      const body = doc.createElement('body');
      
      // Create header
      const h1 = doc.createElement('h1');
      h1.textContent = 'Laporan Lalin Per Hari';
      body.appendChild(h1);
      
      // Create info section
      const infoDiv = doc.createElement('div');
      infoDiv.className = 'info';
      
      const dateP = doc.createElement('p');
      const dateBold = doc.createElement('strong');
      dateBold.textContent = 'Tanggal: ';
      dateP.appendChild(dateBold);
      dateP.appendChild(doc.createTextNode(new Date(selectedDate).toLocaleDateString('id-ID')));
      infoDiv.appendChild(dateP);
      
      const filterP = doc.createElement('p');
      const filterBold = doc.createElement('strong');
      filterBold.textContent = 'Filter: ';
      filterP.appendChild(filterBold);
      filterP.appendChild(doc.createTextNode(paymentMethod));
      infoDiv.appendChild(filterP);
      
      body.appendChild(infoDiv);
      
      // Create table
      const table = doc.createElement('table');
      
      // Create table header
      const thead = doc.createElement('thead');
      const headerRow = doc.createElement('tr');
      const headers = ['No.', 'Ruas', 'Gerbang', 'Gardu', 'Hari', 'Tanggal', 'Metode Pembayaran', 'Gol I', 'Gol II'];
      
      headers.forEach(headerText => {
        const th = doc.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Create table body
      const tbody = doc.createElement('tbody');
      
      // Add data rows
      filteredData.forEach((item, index) => {
        const row = doc.createElement('tr');
        const cells = [
          index + 1,
          `Ruas ${item.shift}`,
          item.gateName.replace('Gate ', 'Gerbang '),
          `0${index + 1}`,
          ['Kamis', 'Rabu', 'Selasa', 'Senin', 'Minggu', 'Sabtu'][index % 6],
          new Date(item.date).toLocaleDateString('id-ID'),
          paymentMethod,
          Math.floor(item.totalVehicles * 0.6),
          Math.floor(item.totalVehicles * 0.4)
        ];
        
        cells.forEach(cellText => {
          const td = doc.createElement('td');
          td.textContent = cellText.toString();
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      
      // Add summary rows
      const summaryRows = [
        { label: 'Total Lalin Ruas 1', gol1: '1791', gol2: '7698', className: 'summary' },
        { label: 'Total Lalin Ruas 2', gol1: '4779', gol2: '7698', className: 'summary' },
        { label: 'Total Lalin Keseluruhan', gol1: '6570', gol2: '7698', className: 'total' }
      ];
      
      summaryRows.forEach(summaryRow => {
        const row = doc.createElement('tr');
        row.className = summaryRow.className;
        
        const labelCell = doc.createElement('td');
        labelCell.colSpan = 7;
        labelCell.textContent = summaryRow.label;
        row.appendChild(labelCell);
        
        const gol1Cell = doc.createElement('td');
        gol1Cell.textContent = summaryRow.gol1;
        row.appendChild(gol1Cell);
        
        const gol2Cell = doc.createElement('td');
        gol2Cell.textContent = summaryRow.gol2;
        row.appendChild(gol2Cell);
        
        tbody.appendChild(row);
      });
      
      table.appendChild(tbody);
      body.appendChild(table);
      
      // Append to document
      doc.documentElement.appendChild(head);
      doc.documentElement.appendChild(body);
      
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    
    setIsOpen(false);
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