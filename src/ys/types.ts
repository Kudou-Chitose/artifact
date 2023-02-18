export interface IWeight {
    [key: string]: number;
}

export interface ITable {
    [key: string]: { [key: string]: number };
}

export interface IBuild {
    key: string;
    name: string;
    set: string[];
    main: {
        [slotKey: string]: string[];
    };
    weight: {
        [affixKey: string]: number;
    };
}
