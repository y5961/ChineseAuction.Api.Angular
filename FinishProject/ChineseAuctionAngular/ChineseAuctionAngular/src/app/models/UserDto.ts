export class UserDto {
    identity: string = '';
    first_Name: string = ''; 
    last_Name: string = '';
    email?: string;
    phonNumber: string = '';
    city: string = '';
    address: string = '';

    constructor(init?: Partial<UserDto>) {
        Object.assign(this, init);
    }
}

export class LoginResponseDto {
    token: string = '';
    user: UserDto = new UserDto();

    constructor(init?: Partial<LoginResponseDto>) {
        Object.assign(this, init);
    }
}

export class LoginUserDto {
    identity: string = '';
    first_Name: string = '';
    last_Name: string = '';
    email: string='';
    password: string = '';
    phonNumber: string = '';
    city: string = '';
    address: string = '';

    constructor(init?: Partial<LoginUserDto>) {
        Object.assign(this, init);
    }
}

export class LoginRequestDto {
    email!: string;
    password!: string;

    constructor(init?: Partial<LoginRequestDto>) {
        Object.assign(this, init);
    }
}

export class DtoUserOrder {
    first_Name: string = '';
    last_Name: string = '';
    orders: any[] = []; 

    constructor(init?: Partial<DtoUserOrder>) {
        Object.assign(this, init);
    }
}
