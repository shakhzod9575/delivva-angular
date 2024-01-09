import { DisputeData } from "./dispute";

export interface DisputeDataList {
    pageSize?: number;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
    data?: DisputeData[];
}