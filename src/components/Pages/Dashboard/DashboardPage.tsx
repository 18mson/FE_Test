import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Calendar } from 'lucide-react';
import { getTrafficData } from '../../../services/api';
import { TrafficData } from '../../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ProcessedChartData {
  paymentMethodData: { [key: string]: number };
  gateData: { [key: string]: number };
  shiftData: { [key: string]: number };
  segmentData: { [key: string]: number };
}

const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [processedData, setProcessedData] = useState<ProcessedChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const processDataForCharts = (data: TrafficData[]) => {
    if (!data || data.length === 0) {
      return {
        paymentMethodData: {},
        gateData: {},
        shiftData: {},
        segmentData: {},
      };
    }

    const paymentMethodData = data.reduce((acc, curr) => {
      acc['eMandiri'] = (acc['eMandiri'] || 0) + curr.eMandiri;
      acc['eBri'] = (acc['eBri'] || 0) + curr.eBri;
      acc['eBni'] = (acc['eBni'] || 0) + curr.eBni;
      acc['eBca'] = (acc['eBca'] || 0) + curr.eBca;
      acc['eNobu'] = (acc['eNobu'] || 0) + curr.eNobu;
      acc['eDKI'] = (acc['eDKI'] || 0) + curr.eDKI;
      acc['eMega'] = (acc['eMega'] || 0) + curr.eMega;
      acc['eFlo'] = (acc['eFlo'] || 0) + curr.eFlo;
      return acc;
    }, {} as { [key: string]: number });

    const gateData = data.reduce((acc, curr) => {
      const gate = `Gerbang ${curr.IdGerbang}`;
      acc[gate] = (acc[gate] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const shiftData = data.reduce((acc, curr) => {
      const shift = `Shift ${curr.Shift}`;
      acc[shift] = (acc[shift] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const segmentData = data.reduce((acc, curr) => {
        const segment = `Ruas ${curr.IdCabang}`;
        acc[segment] = (acc[segment] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });


    return { paymentMethodData, gateData, shiftData, segmentData };
  };

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getTrafficData({
          tanggal: selectedDate,
          search: '',
          limit: 10000,
          page: 1,
        });
        const processed = processDataForCharts(data.data.rows.rows);
        setProcessedData(processed);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  const handleFilter = () => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getTrafficData({
          tanggal: selectedDate,
          search: '',
          limit: 10000,
          page: 1,
        });
        const processed = processDataForCharts(data.data.rows.rows);
        setProcessedData(processed);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  };


  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(0);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '60%',
  };

  const getMaxValue = (data: { [key: string]: number } | null | undefined) => {
    if (!data) return 100;
    const values = Object.values(data);
    if (values.length === 0) return 100;
    return Math.ceil(Math.max(...values) * 1.1);
  };

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: '#e5e7eb',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#e5e7eb',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          }
        },
        title: {
          display: true,
          text: 'Jumlah Lalin',
          color: '#6b7280',
          font: {
            size: 12,
          }
        }
      },
    },
  };

  const paymentMethodChartOptions = {
    ...baseChartOptions,
    scales: {
        ...baseChartOptions.scales,
        y: {
            ...baseChartOptions.scales.y,
            max: getMaxValue(processedData?.paymentMethodData),
        }
    }
  };

  const gateChartOptions = {
    ...baseChartOptions,
    scales: {
        ...baseChartOptions.scales,
        y: {
            ...baseChartOptions.scales.y,
            max: getMaxValue(processedData?.gateData),
        }
    }
  };

  // Mock data for charts to match the design
  const paymentMethodChartData = {
    labels: processedData?.paymentMethodData ? Object.keys(processedData.paymentMethodData) : [],
    datasets: [
      {
        data: processedData?.paymentMethodData ? Object.values(processedData.paymentMethodData) : [],
        backgroundColor: '#4b5563',
        borderColor: '#4b5563',
        borderWidth: 0,
        barThickness: 40,
      },
    ],
  };

  const gateChartData = {
    labels: processedData?.gateData ? Object.keys(processedData.gateData) : [],
    datasets: [
      {
        data: processedData?.gateData ? Object.values(processedData.gateData) : [],
        backgroundColor: '#4b5563',
        borderColor: '#4b5563',
        borderWidth: 0,
        barThickness: 40,
      },
    ],
  };

  const shiftChartData = {
    labels: processedData?.shiftData ? Object.keys(processedData.shiftData) : [],
    datasets: [
      {
        data: processedData?.shiftData ? Object.values(processedData.shiftData) : [],
        backgroundColor: ['#d1d5db', '#9ca3af', '#4b5563'],
        borderWidth: 0,
      },
    ],
  };

  const segmentChartData = {
    labels: processedData?.segmentData ? Object.keys(processedData.segmentData) : [],
    datasets: [
      {
        data: processedData?.segmentData ? Object.values(processedData.segmentData) : [],
        backgroundColor: ['#d1d5db', '#9ca3af', '#4b5563'],
        borderWidth: 0,
      },
    ],
  };


  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 p-4 min-h-[calc(100vh-61px)]">
      <div className="p-6 bg-white min-h-[calc(100vh-120px)] rounded-lg">
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              placeholder="Tanggal"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Filter
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Method Chart */}
          <div className="h-80">
            <Bar data={paymentMethodChartData} options={paymentMethodChartOptions} />
          </div>

          {/* Shift Chart */}
          <div className="h-80 flex flex-col items-center">
            <div className="w-48 h-48 mb-4">
              <Doughnut data={shiftChartData} options={doughnutOptions} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Total Lalin per Shift</h3>
              <div className="space-y-2 text-sm">
                {processedData?.shiftData && Object.keys(processedData.shiftData).length > 0 ? (
                  Object.keys(processedData.shiftData).map((shift, index) => {
                    const total = Object.values(processedData.shiftData).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((processedData.shiftData[shift] / total) * 100).toFixed(0) : 0;
                    const colors = ['bg-gray-300', 'bg-gray-400', 'bg-gray-600'];
                    return (
                      <div key={shift} className="flex items-center justify-between w-32">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                          <span className="text-gray-600">{shift}</span>
                        </div>
                        <span className="text-gray-900 font-medium">{percentage}%</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Gate Chart */}
          <div className="h-80">
            <Bar data={gateChartData} options={gateChartOptions} />
          </div>

          {/* Segment Chart */}
          <div className="h-80 flex flex-col items-center">
            <div className="w-48 h-48 mb-4">
              <Doughnut data={segmentChartData} options={doughnutOptions} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Total Lalin per Cabang</h3>
              <div className="space-y-2 text-sm">
                {processedData?.segmentData && Object.keys(processedData.segmentData).length > 0 ? (
                  Object.keys(processedData.segmentData).map((segment, index) => {
                    const total = Object.values(processedData.segmentData).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((processedData.segmentData[segment] / total) * 100).toFixed(0) : 0;
                    const colors = ['bg-gray-300', 'bg-gray-400', 'bg-gray-600', 'bg-gray-200', 'bg-gray-500'];
                    return (
                      <div key={segment} className="flex items-center justify-between w-40">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                          <span className="text-gray-600">{segment}</span>
                        </div>
                        <span className="text-gray-900 font-medium">{percentage}%</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;