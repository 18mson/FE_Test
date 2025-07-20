export interface User {
  is_logged_in: number;
  token: string;
}

export interface StoredUser {
  d: string; // token
  j: number; // is_logged_in
}

export interface Gate {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

export interface TrafficData {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
  ktp: number;
}

export interface DashboardStats {
  totalCash: number;
  totalEToll: number;
  totalFlo: number;
  totalKTP: number;
  totalOverall: number;
  totalETollCashFlo: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface GateParams {
  id?: number;
  IdCabang?: number;
  NamaCabang?: string;
  NamaGerbang?: string;
}

export interface ReportParams {
  tanggal: string;
  page: number;
  limit?: number;
  search?: string;
}