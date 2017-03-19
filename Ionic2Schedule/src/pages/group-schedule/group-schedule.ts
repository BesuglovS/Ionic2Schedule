import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import 'moment/locale/ru';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'group-schedule',
    templateUrl: 'group-schedule.html'
})
export class GroupSchedulePage {

    selectedGroup: any;
    groupList: any[];
    selectedWeek: number;
    weekList: number[];
    schedule: any[];
    storage: any;

    constructor(public navCtrl: NavController, public http: Http, storage: Storage) {
        this.storage = storage;

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
                    let today = moment();
                    if (today.isoWeekday() === 7) {
                        today = today.add(1, 'day');
                    }
                    let diffToNowInDays = today.diff(startMomentMonday, 'days');

                    let weekNum = Math.floor(diffToNowInDays / 7) + 1;

                    this.selectedWeek = weekNum;
                }
            });

        this.http.get('http://wiki.nayanova.edu/api.php?action=list&listtype=mainStudentGroups')
            .map(res => res.json())
            .subscribe(data => {
                storage.ready().then(() => {
                    storage.get('groupName').then((val) => {
                        if (val !== undefined) {
                            let search = data.filter(g => g.Name === val);
                            
                            if (search.length > 0) {
                                search = search[0];
                                this.groupList = data;
                                this.selectedGroup = search;
                                this.updateSchedule(http);
                            } else {
                                storage.remove('groupName');

                                this.groupList = data;
                                if (this.groupList.length > 0) {
                                    this.selectedGroup = this.groupList[0];
                                    this.updateSchedule(http);
                                }
                            }
                        } else {
                            this.groupList = data;
                            if (this.groupList.length > 0) {
                                this.selectedGroup = this.groupList[0];
                                this.updateSchedule(http);
                            }
                        }
                    });
                });
            });
    }

    updateSchedule(http: Http) {
        if (this.selectedGroup !== undefined) {
            this.storage.ready().then(() => {
                this.storage.set('groupName', this.selectedGroup.Name);
            });
        }

        this.http.get('http://wiki.nayanova.edu/api.php?action=weekSchedule&groupId='
            + this.selectedGroup.StudentGroupId + '&week=' + this.selectedWeek)
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
                    var dateParts = element.date.split("-");
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
