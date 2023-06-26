import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-common-date-picker',
  templateUrl: './common-date-picker.component.html',
  styleUrls: ['./common-date-picker.component.scss']
})
export class CommonDatePickerComponent implements OnInit {
  yesterday: any;
  model: any = new Date();
  minDate !: { year: number, month: number, day: number };

  constructor(private calendar: NgbCalendar) {

    this.model = calendar.getToday();
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  @Output() dateSelected: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    // const today = new Date();
    // const yesterday = new Date(today);

    // yesterday.setDate(yesterday.getDate() - 1);

    // today.toDateString();
    // yesterday.toDateString();
    // this.yesterday = yesterday;
  }
  // model: NgbDateStruct | undefined;
  // date: { year: number; month: number; } | undefined;
  selectToday() {
    this.model = this.calendar.getToday();
  }

  dateSelect(e: any) {
    console.log(e);
    this.dateSelected.emit(e);
  }
}
