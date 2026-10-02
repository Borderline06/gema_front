import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import TeacherLayout from '../layouts/TeacherLayout';
import { ROLES } from './roles';

// Un chunk por vista; el <Suspense> que las cubre vive en TeacherLayout.
const DashboardTeacher = lazy(() => import('../pages/DashboardTeacher'));
const TeacherProfile = lazy(() => import('../pages/teacher/Profile'));
const DiaCorte = lazy(() => import('../pages/teacher/DiaCorte'));

// Devuelve el árbol de <Route> del grupo Coordinador (ver nota en studentRoutes.jsx
// sobre por qué es una función y no un componente <TeacherRoutes/>).
export const getTeacherRoutes = () => (
    <Route element={<ProtectedRoute allowedRoles={ROLES.TEACHER} />}>
        <Route element={<TeacherLayout />}>
            <Route path="teacher" element={<DashboardTeacher />} />
            <Route path="teacher/profile" element={<TeacherProfile />} />
            <Route path="teacher/DiaCorte" element={<DiaCorte />} />
        </Route>
    </Route>
);
