import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import AdminLocationsManager from '../pages/admin/AdminLocationsManager';
import AdminLevelsManager from '../pages/admin/AdminLevelsManager';
import AdminTeachersManager from '../pages/admin/AdminTeachersManager';
import AdminCatalogManager from '../pages/admin/AdminCatalogManager';
import AdminSchedulesManager from '../pages/admin/AdminScheduleManager';
import AdminStudentsManager from '../pages/admin/AdminStudentManager';
import AdminPaymentManager from '../pages/admin/AdminPaymentManager';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminInjuriesManager from '../pages/admin/AdminInjuriesManager';
import AdminBenefits from '../pages/admin/AdminBenefits';
import AdminCreateBenefits from '../pages/admin/AdminCreateBenefits';
import AdminPublications from '../pages/admin/AdminPublications';
import AdminGuestPasses from '../pages/admin/AdminGuestPasses';
import AdminReprogramaciones from '../pages/admin/AdminReprogramaciones';
import AdminDeleteMakeups from '../pages/admin/AdminDeleteMakeups';
import AdminCreateBenefitsAnuncio from '../pages/admin/AdminCreateBenefitsAnuncio';
import AdminCashFlow from '../pages/admin/monthly-transactions/AdminCashFlow';
import { ROLES } from './roles';

// Devuelve el árbol de <Route> del grupo Administrador (ver nota en studentRoutes.jsx
// sobre por qué es una función y no un componente <AdminRoutes/>).
export const getAdminRoutes = () => (
    <Route element={<ProtectedRoute allowedRoles={ROLES.ADMIN} />}>
        <Route element={<DashboardLayout />}>
            <Route path="admin" element={<Dashboard role="admin" />} />

            {/* Gestión CRUD */}
            <Route path="admin/students" element={<AdminStudentsManager />} />
            <Route path="admin/teachers" element={<AdminTeachersManager />} />
            <Route path="admin/delete-makeups" element={<AdminDeleteMakeups />} />
            <Route path="admin/benefits" element={<AdminBenefits />} />
            <Route path="admin/CreateBenefits" element={<AdminCreateBenefits />} />
            <Route path="admin/schedule" element={<AdminSchedulesManager />} />
            <Route path="admin/reprogramaciones" element={<AdminReprogramaciones />} />
            <Route path="admin/levels" element={<AdminLevelsManager />} />
            <Route path="admin/catalog" element={<AdminCatalogManager />} />
            <Route path="admin/locations" element={<AdminLocationsManager />} />
            <Route path="admin/injuries" element={<AdminInjuriesManager />} />
            <Route path="admin/publications" element={<AdminPublications />} />
            <Route path="admin/anuncios-beneficios" element={<AdminCreateBenefitsAnuncio />} />
            <Route path="admin/payment-validation" element={<AdminPaymentManager />} />
            <Route path="admin/guest-passes" element={<AdminGuestPasses />} />
            <Route path="admin/cash-flow" element={<AdminCashFlow />} />

            {/* Configuración */}
            <Route path="admin/settings" element={<AdminSettings />} />
        </Route>
    </Route>
);
