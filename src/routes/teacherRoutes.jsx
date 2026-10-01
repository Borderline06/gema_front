import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import TeacherLayout from '../layouts/TeacherLayout';
import DashboardTeacher from '../pages/DashboardTeacher';
import TeacherProfile from '../pages/teacher/Profile';
import DiaCorte from '../pages/teacher/DiaCorte';
import { ROLES } from './roles';

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
