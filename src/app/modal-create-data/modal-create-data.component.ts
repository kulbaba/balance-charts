import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaveRecordService } from '../save-record.service';
import { ExtendedRecord, Record } from '../models';


@Component({
  selector: 'app-modal-create-data',
  templateUrl: './modal-create-data.component.html',
  styleUrls: ['./modal-create-data.component.scss']
})
export class ModalCreateDataComponent implements OnInit {

  nameButton = 'Add';
  dataForm: FormGroup;

  constructor(
    private dialog: MatDialogRef<ModalCreateDataComponent>,
    private formBuilder: FormBuilder,
    private saveDataService: SaveRecordService,
    @Inject(MAT_DIALOG_DATA) public data: ExtendedRecord,
  ) {
    this.dataForm = this.formBuilder.group({
        entryDate: new FormControl('', Validators.required),
        exitDate: new FormControl('', Validators.required),
        entryPrice:  new FormControl('', [Validators.required, Validators.min(0)]),
        exitPrice: new FormControl('', [Validators.required, Validators.min(0)]),

      }, {
        validators: this.getValidation('entryDate', 'exitDate')
      }
    );
    if (this.data){
      this.dataForm.patchValue(this.data);
      this.nameButton = 'Edit';
    }
  }

  ngOnInit(): void {

  }

  add(): void {
   const record: Record = this.dataForm.value;
   if (this.nameButton === 'Add'){
   this.saveDataService.addRecord(record);
   }
   if (this.nameButton === 'Edit'){
     const editData: ExtendedRecord = {
     ...record,
     id: this.data.id,
     profit: this.data.profit,
     };

     this.saveDataService.editRecord(editData);
   }
   this.dialog.close();

  }

  public getValidation(entryDate, exitData): ValidatorFn {
    return (AC: AbstractControl) => {
      if (!AC) {
        return null;
      }
      const tempEntryDate = AC.get(entryDate);
      const tempExitData = AC.get(exitData);
      if (tempEntryDate.value > tempExitData.value) {
        return {dateError: true};
      }
      return null;
    };

  }
}

