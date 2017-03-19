import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import 'moment/locale/ru';

@Component({
    selector: 'teacher-schedule',
    templateUrl: 'teacher-schedule.html'
})
export class TeacherSchedulePage {

    selectedTeacher: any;
    teacherList: any[];
    selectedWeek: number;
    weekList: number[];
    schedule: any[];

    constructor(public navCtrl: NavController, public http: Http) {
        this.weekList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        this.selectedWeek = 1;

        this.http.get('http://wiki.nayanova.edu/api.php?action=list&listtype=configOptions')
            .map(res => res.json())
            .subscribe(data => {
                let ss = data.filter(option => option.Key === 'Semester Starts');
                if (ss.length !== 0) {
                    ss = ss[0];

                    moment.locale('ru');

                    let startMomentMonday = moment(ss.Value).startOf('week');
                    let diffToNowInDays = moment().diff(startMomentMonday, 'days');

                    let weekNum = Math.floor(diffToNowInDays / 7) + 1;

                    this.selectedWeek = weekNum;
                }
            });

        this.http.get('http://wiki.nayanova.edu/api.php?action=list&listtype=teachers')
            .map(res => res.json())
            .subscribe(data => {
                this.teacherList = data;

                if (this.teacherList.length > 0) {
                    this.selectedTeacher = this.teacherList[0];

                    this.updateSchedule(http);
                }
            });
    }

    updateSchedule(http: Http) {
        this.http.get('http://wiki.nayanova.edu/api.php?action=TeacherWeekSchedule&teacherId='
            + this.selectedTeacher.TeacherId + '&week=' + this.selectedWeek)
            .map(res => res.json())
            .subscribe(data => {
                let lessons = data;

                const dowString = ["", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

                let result: any[] = new Array();
                for (let i = 1; i <= 7; i++) {
                    result[i] = new Array();
                    result[i].Lessons = new Array();
                    result[i].dowString = dowString[i];
                }

                lessons.forEach(function (element, index) {
                    var dateParts = element.Date.split("-");
                    element.date = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
                    element.Time = element.Time.substring(0, 5);

                    result[element.dow].date = element.date;
                    result[element.dow].Lessons.push(element);
                });

                var finalResult = new Array();

                for (let i = 1; i <= 7; i++) {
                    if (result[i].Lessons.length > 0) {
                        finalResult.push(result[i]);
                    }
                }

                this.schedule = finalResult;
            });
    }

}
