export class ProfileData {
    userId?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    username?: string;

    constructor(userId: number, firstName: string, lastName: string, phoneNumber: string, username: string) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.username = username;
    }
}