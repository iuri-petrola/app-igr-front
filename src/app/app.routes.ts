import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { KoynoniaComponent } from './pages/koynonia/koynonia.component';
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
  { path: 'koynonia', component: KoynoniaComponent },
  { path: 'posso-orar-por-voce', component: PossoOrarPorVoceComponent },
  { path: 'pedido-de-oracao', component: PedidosComponent },
  { path: 'pedidos', redirectTo: 'pedido-de-oracao', pathMatch: 'full' },
  {
    path: 'posso-orar-por-voce/fotos',
    component: FotosComponent,
    data: { ministerio: 'posso-orar-por-voce', ministerioNome: 'Posso Orar por Você' }
  },
  {
    path: 'koynonia/fotos',
    component: FotosComponent,
    data: { ministerio: 'koynonia', ministerioNome: 'Koynonia' }
  },
  {
    path: 'fotos',
    component: FotosComponent,
    data: { ministerio: 'geral', ministerioNome: 'Geral' }
  },
  { path: 'bio', component: BioComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'admin', canActivate: [adminRedirectGuard], pathMatch: 'full', children: [] },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/midias', component: AdminMidiasComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/pedidos', component: AdminPedidosComponent, canActivate: [adminAuthGuard] },
  { path: '**', component: NotFoundComponent }
];
