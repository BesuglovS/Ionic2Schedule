import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { GroupSchedulePage } from "../pages/group-schedule/group-schedule";
import { TeacherSchedulePage } from "../pages/teacher-schedule/teacher-schedule";

@NgModule({
    declarations: [
        MyApp,
        TabsPage,
        GroupSchedulePage,
        TeacherSchedulePage
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        TabsPage,
        GroupSchedulePage,
        TeacherSchedulePage
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
