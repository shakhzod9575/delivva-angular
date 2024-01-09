import { UserData } from "./get-me-data";

export interface Dispute {
    id?: number;
    description?: string;
    disputeTypeName?: string;
    user?: UserData;
    status?: string;
    orderId?: number;
}