import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
        // canActivate : [Auth]
      },
      {
        path: 'nav',
        loadChildren: () =>
          import('./sidemenu-components/sidemenu-components.module').then(
            (m) => m.SidemenuComponentsModule
          ),
        // canActivate : [Auth]
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./authentication/authentication.module').then(
            (m) => m.AuthenticatonModule
          ),
      },
      // {
      //   path : '',
      //   component: LandingComponent,
      // },
      {
        path: 'freelance',
        loadChildren: () =>
          import('./freelancer/freelancer.module').then((m) => m.FreelancerModule),
      },
        // otherwise redirect to home
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'top', anchorScrolling: 'enabled'})
  ],
})
export class AppRoutingModule {}
