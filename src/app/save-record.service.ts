import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExtendedRecord, Record } from './models';



interface DayResult {
  date: Date;
  balance: number;
}
interface ResultByDateSubject {
  data: {data: number[], label: string}[];
  labels: string[];
}


@Injectable({ providedIn: 'root' })
export class SaveRecordService {
  private savedRecords: Array<ExtendedRecord>;
  private balance =  0;
  private resultByDate: Array<DayResult> = [];
  private resultByDateSubject: ResultByDateSubject = {
    data: [{data: [], label: 'Balance'}],
    labels: []
  };

  public savedRecords$: BehaviorSubject<Array<ExtendedRecord>> = new BehaviorSubject<Array<ExtendedRecord>>([]);
  public balance$: BehaviorSubject<number> = new BehaviorSubject<number>(this.balance);
  public resultByDate$: BehaviorSubject<ResultByDateSubject> = new BehaviorSubject<ResultByDateSubject>(this.resultByDateSubject);

  public addRecord(record: Record): void  {
    this.savedRecords = this.savedRecords$.getValue();
    const extendRecord = {
     ...record,
     id: this.savedRecords[this.savedRecords?.length - 1]?.id + 1 || 1,
     profit: record.exitPrice - record.entryPrice,
   };
    this.savedRecords.push(extendRecord);
    this.savedRecords$.next(this.savedRecords);
    this.calcResultByDate();
  }

  private calcResultByDate(): void {
    this.savedRecords = this.savedRecords$.getValue();
    const uniqDates = this.savedRecords.filter((item, i, ar) => ar.findIndex(v => v.exitDate === item.exitDate) === i)
      .map(d => d.exitDate)
      .sort();
    this.resultByDate = [];
    for (const uniqDate of uniqDates) {
    this.resultByDate.push(
      {
      date: uniqDate,
      balance:  this.savedRecords.filter( item => item.exitDate <= uniqDate).reduce((acc, current) => acc + current.profit, 0)
    });
    }
    this.resultByDateSubject =
      { data: [{data: [], label: 'Balance'}],
      labels: [] };
    for (const balance of this.resultByDate) {
      this.resultByDateSubject.data[0].data.push(balance.balance);
      this.resultByDateSubject.labels.push(balance.date.toString());
    }
    this.resultByDate$.next(this.resultByDateSubject);
    this.calculateBalance();
  }

  public editRecord(extendedRecord: ExtendedRecord): void {
    this.savedRecords = this.savedRecords$.getValue();
    const foundIndex = this.savedRecords.findIndex(x => x.id === extendedRecord.id);
    this.savedRecords[foundIndex] = {
      ...extendedRecord,
      profit: extendedRecord.exitPrice - extendedRecord.entryPrice
    };
    this.calcResultByDate();
    this.savedRecords$.next(this.savedRecords);
  }

  public calculateBalance(): void {
    this.balance = this.savedRecords.reduce((acc, current) => acc + current.profit, 0);
    this.balance$.next(this.balance);
  }

}
