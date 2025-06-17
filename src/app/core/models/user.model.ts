export interface UserModel {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
}

export interface AuthResponseModel {
    user: UserModel;
    token: string;
} 