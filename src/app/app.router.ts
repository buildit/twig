import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AboutComponent } from './core/about/about.component';
import { ModelHomeComponent } from './models/model-home/model-home.component';
import { ModelViewComponent } from './models/model-view/model-view.component';
import { SplashComponent } from './core/splash/splash.component';
import { TwigletGraphComponent } from './twiglets/twiglet-graph/twiglet-graph.component';
import { TwigletHomeComponent } from './twiglets/twiglet-home/twiglet-home.component';
import { TwigletModelViewComponent } from './twiglets/twiglet-model-view/twiglet-model-view.component';

const routes: Routes = [
    { path: '', component: SplashComponent },
    { path: 'twiglet', component: TwigletHomeComponent },
    { path: 'twiglet/:name', component: TwigletHomeComponent},
    { path: 'twiglet/:name/view/:view', component: TwigletHomeComponent},
    { path: 'model', component: ModelHomeComponent },
    { path: 'model/:name', component: ModelViewComponent },
    { path: 'about', component: AboutComponent }
];

export const router = RouterModule.forRoot(routes);

export const routerForTesting = RouterTestingModule.withRoutes(routes);
