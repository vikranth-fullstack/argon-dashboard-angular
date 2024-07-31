import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { CatalogueComponent } from '../../pages/catalogue/catalogue.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { CrudCatalogueComponent } from 'src/app/pages/crud-catalogue/crud-catalogue.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'catalog', component: CatalogueComponent },
    { path: 'register',       component: RegisterComponent },
    { path: 'catalogue', component: CatalogueComponent },
    { path: 'crud-catalogue/:mobile/:id', component: CrudCatalogueComponent }

];
