export class CategoryDto {
    name: string = '';

    constructor(init?: Partial<CategoryDto>) {
        Object.assign(this, init);
    }
}


export class GetCategoryDto {
    id: number = 0;
    name: string = '';

    constructor(init?: Partial<GetCategoryDto>) {
        Object.assign(this, init);
    }
}