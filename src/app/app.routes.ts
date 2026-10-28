import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { TimelineComponent } from './features/timeline/timeline.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ChangePasswrodComponent } from './features/change-passwrod/change-passwrod.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/auth/guard/auth-guard';
import { guestGuard } from './core/auth/guard/guest-guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'',component:AuthLayoutComponent, children:[
        {path:'login',component:LoginComponent},
        {path:'register',component:RegisterComponent},
        {path:'forget',component:ForgetPasswordComponent}
    ],canActivate:[guestGuard]},
    {path:'',component:MainLayoutComponent, children:[
        {path:'profile',component:ProfileComponent},
        {path:'timeline',component:TimelineComponent},
        {path:'notifications',component:NotificationsComponent},
        {path:'change',component:ChangePasswrodComponent}
    ],canActivate:[authGuard]},
    {path:'notfound',component:NotfoundComponent},
    {path:'**',redirectTo:'notfound',pathMatch:'full'}
];
