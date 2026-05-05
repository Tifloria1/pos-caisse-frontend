import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { Products } from './features/products/products';
import { Orders } from './features/orders/orders';
import { Layout } from './core/layout/layout';
import { Categories } from './features/categories/categories';
import { OrdersHistory } from './features/orders/orders-history';
import { adminGuard } from './core/guards/admin.guard';
export const routes: Routes = [

    {path: 'login', component: Login},

    {path: '', component: Layout, canActivate: [authGuard],
        children: [
    

    {path: 'dashboard', component: Dashboard , canActivate: [adminGuard]},
    {path: 'products', component: Products, canActivate: [adminGuard]},
    {path: 'orders', component: Orders, canActivate: [authGuard]},
    {path: 'categories', component: Categories, canActivate: [adminGuard] },
    {path: 'orders-history', component: OrdersHistory, canActivate: [adminGuard] },
    {path: '', redirectTo: 'dashboard' , pathMatch: 'full'},
    

        ]
    },
    {path: '**', redirectTo: 'dashboard'}
];
