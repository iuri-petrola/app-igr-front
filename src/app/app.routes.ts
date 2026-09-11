import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PossoOrarPorVoceComponent } from './pages/posso-orar-por-voce/posso-orar-por-voce.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { FotosComponent } from './pages/fotos/fotos.component';
import { BioComponent } from './pages/bio/bio.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdminMidiasComponent } from './pages/admin-midias/admin-midias.component';
import { AdminPedidosComponent } from './pages/admin-pedidos/admin-pedidos.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { adminRedirectGuard } from './guards/admin-redirect.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posso-orar-por-voce', component: PossoOrarPorVoceComponent },
  { path: 'pedido-de-oracao', component: PedidosComponent },
  { path: 'pedidos', redirectTo: 'pedido-de-oracao', pathMatch: 'full' },
  { path: 'fotos', component: FotosComponent },
  { path: 'bio', component: BioComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'admin', canActivate: [adminRedirectGuard], pathMatch: 'full', children: [] },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/midias', component: AdminMidiasComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/pedidos', component: AdminPedidosComponent, canActivate: [adminAuthGuard] },
  { path: '**', component: NotFoundComponent }
];
