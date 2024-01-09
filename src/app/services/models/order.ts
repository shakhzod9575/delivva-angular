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
    status?: string;
}