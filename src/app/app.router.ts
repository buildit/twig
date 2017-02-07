import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ModelViewComponent } from './model-view/model-view.component';
import { SplashComponent } from './splash/splash.component';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';

const routes: Routes = [
    { path: '', component: SplashComponent },
    { path: 'twiglet/:id', component: TwigletGraphComponent},
    { path: 'model/:id', component: ModelViewComponent },
];

export const router = RouterModule.forRoot(routes);

export const routerForTesting = RouterTestingModule.withRoutes(routes);
