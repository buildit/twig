import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { SplashComponent } from './splash/splash.component';
import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

const routes: Routes = [
    { path: '', component: SplashComponent },
    { path: 'twiglet/:id', component: TwigletGraphComponent}
];

export const router = RouterModule.forRoot(routes);

export const routerForTesting = RouterTestingModule.withRoutes(routes);
