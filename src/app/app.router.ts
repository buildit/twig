import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ModelViewComponent } from './models/model-view/model-view.component';
import { SplashComponent } from './splash/splash.component';
import { TwigletGraphComponent } from './twiglets/twiglet-graph/twiglet-graph.component';
import { TwigletModelViewComponent } from './twiglets/twiglet-model-view/twiglet-model-view.component';

const routes: Routes = [
    { path: '', component: SplashComponent },
    { path: 'twiglet/:name', component: TwigletGraphComponent},
    { path: 'twiglet/:name/view/:view', component: TwigletGraphComponent},
    { path: 'twiglet/:name/model', component: TwigletModelViewComponent },
    { path: 'model/:name', component: ModelViewComponent },
];

export const router = RouterModule.forRoot(routes);

export const routerForTesting = RouterTestingModule.withRoutes(routes);
