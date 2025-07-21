import React from 'react';
import { format, setDefaultOptions  } from 'date-fns';
import { TrafficData } from '../../../types';
import { id } from 'date-fns/locale';


setDefaultOptions({ locale: id })
interface TrafficReportTableProps {
  data: TrafficData[];
  currentPage: number;
  itemsPerPage: number;
  activeFilter: string;
  isLoading: boolean;
}

const TrafficReportTable: React.FC<TrafficReportTableProps> = ({
  data,
  currentPage,
  itemsPerPage,
  activeFilter,
  isLoading
}) => {

  const getFilteredData = () => {

    return data;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();

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
  

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-200">
              No.
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-200">
              Ruas ↑
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-200">
              Gerbang ↑
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-200">
              Gardu ↑
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-200">
              Hari ↑
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-200">
              Tanggal ↑
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-200">
              Metode Pembayaran
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 border-r border-gray-200">
              Gol I
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
              Gol II
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
              Gol III
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
              Gol IV
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
              Gol V
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
              Total Lalin
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filteredData.map((item: any, index) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                {((currentPage - 1) * itemsPerPage) + index + 1}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                Ruas {item.IdCabang}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                {item.IdGerbang}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                {item.IdGardu}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                {format(new Date(item.Tanggal), 'eeee')}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                {format(new Date(item.Tanggal), 'dd-MM-yyyy')}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                {activeFilter}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                {item.Golongan === 1 ? CountfilteredData(item) : 0}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                {item.Golongan === 2 ? CountfilteredData(item) : 0}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                {item.Golongan === 3 ? CountfilteredData(item) : 0}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                {item.Golongan === 4 ? CountfilteredData(item) : 0}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                {item.Golongan === 5 ? CountfilteredData(item) : 0}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">
                {CountfilteredData(item) || 0}
              </td>
            </tr>
          ))}
          
          {/* Summary Rows */}
          {Object.entries(
            filteredData.reduce((acc, item) => {
              if (!acc[item.IdCabang]) {
                acc[item.IdCabang] = {
                  Golongan1: 0,
                  Golongan2: 0,
                  Golongan3: 0,
                  Golongan4: 0,
                  Golongan5: 0,
                  Total: 0,
                };
              }
              const totalLalin = CountfilteredData(item);
              if (item.Golongan === 1) acc[item.IdCabang].Golongan1 += totalLalin;
              if (item.Golongan === 2) acc[item.IdCabang].Golongan2 += totalLalin;
              if (item.Golongan === 3) acc[item.IdCabang].Golongan3 += totalLalin;
              if (item.Golongan === 4) acc[item.IdCabang].Golongan4 += totalLalin;
              if (item.Golongan === 5) acc[item.IdCabang].Golongan5 += totalLalin;
              acc[item.IdCabang].Total += totalLalin;
              return acc;
            }, {} as { [key: string]: { Golongan1: number, Golongan2: number, Golongan3: number, Golongan4: number, Golongan5: number, Total: number } })
          ).map(([idCabang, totals]) => (
            <tr key={idCabang} className="bg-gray-100 border-b border-gray-200">
              <td colSpan={7} className="px-4 py-3 text-sm font-medium text-gray-900">
                Total Lalin Ruas {idCabang}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center border-r border-gray-200">
                {totals.Golongan1}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center">
                {totals.Golongan2}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center border-r border-gray-200">
                {totals.Golongan3}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center">
                {totals.Golongan4}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center border-r border-gray-200">
                {totals.Golongan5}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center">
                {totals.Total}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-500 text-white">
            <td colSpan={7} className="px-4 py-3 text-sm font-medium">
              Total Lalin Keseluruhan
            </td>
            <td className="px-4 py-3 text-sm font-medium text-center border-r border-gray-400">
              {filteredData.reduce((acc, item) => acc + (item.Golongan === 1 ? CountfilteredData(item) : 0), 0)}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-center">
              {filteredData.reduce((acc, item) => acc + (item.Golongan === 2 ? CountfilteredData(item) : 0), 0)}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-center border-r border-gray-400">
              {filteredData.reduce((acc, item) => acc + (item.Golongan === 3 ? CountfilteredData(item) : 0), 0)}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-center">
              {filteredData.reduce((acc, item) => acc + (item.Golongan === 4 ? CountfilteredData(item) : 0), 0)}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-center border-r border-gray-400">
              {filteredData.reduce((acc, item) => acc + (item.Golongan === 5 ? CountfilteredData(item) : 0), 0)}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-center">
              {filteredData.reduce((acc, item) => acc + CountfilteredData(item), 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TrafficReportTable;