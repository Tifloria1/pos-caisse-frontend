import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { Products } from './features/products/products';
import { Orders } from './features/orders/orders';
import { Layout } from './core/layout/layout';
import { Categories } from './features/categories/categories';
import { OrdersHistory } from './features/orders/orders-history';
export const routes: Routes = [

    {path: 'login', component: Login},

    {path: '', component: Layout, canActivate: [authGuard],
        children: [
    

    {path: 'dashboard', component: Dashboard , canActivate: [authGuard]},
    {path: 'products', component: Products, canActivate: [authGuard]},
    {path: 'orders', component: Orders, canActivate: [authGuard]},
    {path: 'categories', component: Categories, canActivate: [authGuard] },
    {path: 'orders-history', component: OrdersHistory, canActivate: [authGuard] },
    {path: '', redirectTo: 'dashboard' , pathMatch: 'full'},
    

        ]
    },
    {path: '**', redirectTo: 'dashboard'}
];
