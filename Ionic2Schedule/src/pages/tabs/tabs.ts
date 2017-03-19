import { Component } from '@angular/core';

import { GroupSchedulePage } from "../group-schedule/group-schedule";
import { TeacherSchedulePage } from "../teacher-schedule/teacher-schedule";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = GroupSchedulePage;
    tab2Root: any = TeacherSchedulePage;

    constructor() {

    }
}
