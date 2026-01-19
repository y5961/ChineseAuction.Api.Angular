export class Donor {
    idDonor: number = 0;
    f_name: string = '';
    l_name: string = '';
    email: string = '';
    phonNumber: string = '';

    constructor(init?: Partial<Donor>) {
        Object.assign(this, init);
    }
}

export class DonorDto {
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phoneNumber: string = '';

    constructor(init?: Partial<DonorDto>) {
        Object.assign(this, init);
    }
}