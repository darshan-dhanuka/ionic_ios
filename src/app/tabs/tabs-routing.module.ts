import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'psl',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/psl/psl.module').then(m => m.PslPageModule)
          }
        ]
      }, {
        path: 'learn',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/learn/learn.module').then(m => m.LearnPageModule)
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'play',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/play/play.module').then(m => m.PlayPageModule)
          }
        ]
      },
      {
        path: 'watch',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../../app/pages/ott/ott.module').then(m => m.OttPageModule)
          }
        ]
      },
      { path: 'forum', loadChildren: () => import('../pages/forum/forum.module').then(m => m.ForumPageModule) },
      { path: 'chatbot', loadChildren: () => import('../pages/chatbot/chatbot.module').then(m => m.ChatbotPageModule) },
      { path: 'news', loadChildren: () => import('../pages/news/news.module').then(m => m.NewsPageModule) },
      {
        path: 'subcription', loadChildren: () => import('../pages/subcription/subcription.module').then(m => m.SubcriptionPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'ott',
        loadChildren: () => import('../pages/ott/ott.module').then(m => m.OttPageModule)
      },
      {
        path: 'ott-single',
        loadChildren: () => import('../pages/ott-single/ott-single.module').then(m => m.OttSinglePageModule)
      },
      {
        path: 'forum-discurssion',
        loadChildren: () => import('../pages/forum-discurssion/forum-discurssion.module').then(m => m.ForumDiscurssionPageModule)
      },
      {
        path: 'calendar',

        loadChildren: () => import('../pages/calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'how-to-apply',

        loadChildren: () => import('../pages/how-to-apply/how-to-apply.module').then(m => m.HowToApplyPageModule)
      },

      {
        path: 'know-the-league',

        loadChildren: () => import('../pages/know-the-league/know-the-league.module').then(m => m.KnowTheLeaguePageModule)
      },
      {
        path: 'teams',

        loadChildren: () => import('../pages/teams/teams.module').then(m => m.TeamsPageModule)
      },
      {
        path: 'leaderboard',

        loadChildren: () => import('../pages/leaderboard/leaderboard.module').then(m => m.LeaderboardPageModule)
      },
      {
        path: 'feedback',

        loadChildren: () => import('../pages/feedback/feedback.module').then(m => m.FeedbackPageModule)
      },
    ]
  }, {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
