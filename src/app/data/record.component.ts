import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreateDataComponent} from '../modal-create-data/modal-create-data.component';
import { SaveRecordService } from '../save-record.service';
import { BehaviorSubject } from 'rxjs';
import { ExtendedRecord, Record } from '../models';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  public savedRecords$: BehaviorSubject<Array<ExtendedRecord>>;
  public balance$: BehaviorSubject<number>;

  constructor(
    private saveDateService: SaveRecordService,
    private dialog: MatDialog,
  ) {
    this.savedRecords$ = this.saveDateService.savedRecords$;
    this.balance$ = this.saveDateService.balance$;
  }

  ngOnInit(): void {
  }

  openAddModal(): void {
    this.dialog.open(ModalCreateDataComponent);
  }
  openEditModal(data: ExtendedRecord): void{
    this.dialog.open(ModalCreateDataComponent , { data });
  }

}
