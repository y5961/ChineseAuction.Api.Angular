export class LoginUserDto {
    Identity: string = '';      
    First_Name: string = '';    
    Last_Name: string = '';    
    Email: string = '';        
    password: string = '';      
    PhonNumber: string = '';    
    City: string = '';         
    Address: string = '';      
    constructor(init?: Partial<LoginUserDto>) {
        Object.assign(this, init);
    }
}

export class LoginRequestDto {
    Email!: string;            
    password!: string;         

    constructor(init?: Partial<LoginRequestDto>) {
        Object.assign(this, init);
    }
}