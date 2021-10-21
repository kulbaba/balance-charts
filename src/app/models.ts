
export interface Record{
  entryDate: Date;
  exitDate: Date;
  entryPrice: number;
  exitPrice: number;
}

export interface ExtendedRecord extends Record {
  profit: number;
  id: number;
}
