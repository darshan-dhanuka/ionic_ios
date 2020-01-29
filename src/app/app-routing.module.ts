import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helper/auth.guard';
import { SplashAuthGuard } from './helper/spalshauth.guard';

const routes: Routes = [
  { path: '', canActivate: [SplashAuthGuard], loadChildren: () => import('./pages/splash/splash.module').then(m => m.SplashPageModule) },
  { path: 'login', canActivate: [AuthGuard], loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule) },
  { path: 'home', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'register', canActivate: [AuthGuard], loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'know-the-league', loadChildren: './pages/know-the-league/know-the-league.module#KnowTheLeaguePageModule' },
  { path: 'teams', loadChildren: './pages/teams/teams.module#TeamsPageModule' },
  { path: 'how-to-apply', loadChildren: './pages/how-to-apply/how-to-apply.module#HowToApplyPageModule' },
  { path: 'calendar', loadChildren: './pages/calendar/calendar.module#CalendarPageModule' },
  { path: 'leaderboard', loadChildren: './pages/leaderboard/leaderboard.module#LeaderboardPageModule' },
  { path: 'feedback', loadChildren: './pages/feedback/feedback.module#FeedbackPageModule' },
  { path: 'user-level', loadChildren: './pages/user-level/user-level.module#UserLevelPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  declarations: [],
  entryComponents: []
})
export class AppRoutingModule { }
