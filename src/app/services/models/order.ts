export interface Order {
    id?: number;
    itemDescription?: string;
    startingDestination: {
        longitude?: number;
        latitude?: number;
    };
    finalDestination: {
        longitude?: number;
        latitude?: number;
    };
    startingPlace?: string;
    finalPlace?: string;
    costumer: {
        id?: number;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        email?: string;
        username?: string;
    };
    courier: {
        id?: number;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        email?: string;
        username?: string;
    };
    deliveryDate?: string;
    deliveryStartedAt?: string;
    deliveryFinishedAt?: string;
    status?: string;
}