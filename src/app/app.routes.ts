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
import { permissionGuard } from './core/guards/permission.guard';
import { Roles } from './features/roles/roles';
import { Users } from './features/users/users';
export const routes: Routes = [

    {path: 'login', component: Login},

    {path: '', component: Layout, canActivate: [authGuard],
        children: [
    

   {
  path: 'dashboard',
  component: Dashboard,
  canActivate: [permissionGuard],
  data: { permission: 'DASHBOARD_VIEW' }
},
{
  path: 'products',
  component: Products,
  canActivate: [permissionGuard],
  data: { permission: 'PRODUCT_VIEW' }
},
{
  path: 'categories',
  component: Categories,
  canActivate: [permissionGuard],
  data: { permission: 'CATEGORY_VIEW' }
},
{
  path: 'orders-history',
  component: OrdersHistory,
  canActivate: [permissionGuard],
  data: { permission: 'ORDER_VIEW' }
},
{
  path: 'orders',
  component: Orders,
  canActivate: [permissionGuard],
  data: { permission: 'POS_ACCESS' }
},

{
  path: 'roles',
  component: Roles,
  canActivate: [permissionGuard],
  data: { permission: 'ROLE_MANAGE' }
},

{
  path: 'users',
  component: Users,
  canActivate: [permissionGuard],
  data: { permission: 'USER_MANAGE' }
},

    {path: '', redirectTo: 'login' , pathMatch: 'full'},
    

        ]
    },
    {path: '**', redirectTo: 'login'}
];
