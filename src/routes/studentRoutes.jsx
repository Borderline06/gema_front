import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import StudentLayout from '../layouts/StudentLayout';
import { ROLES } from './roles';

// Un chunk por vista; el <Suspense> que las cubre vive en StudentLayout.
const DashboardEstudiante = lazy(() => import('../pages/DashboardEstudiante'));
const MyRegistrations = lazy(() => import('../pages/student/MyRegistrations'));
const Payments = lazy(() => import('../pages/student/Payments'));
const Profile = lazy(() => import('../pages/student/Profile'));
const Enrollment = lazy(() => import('../pages/student/enrollment'));
const StudentInjuries = lazy(() => import('../pages/student/StudentInjuries'));
const StudentRecoveries = lazy(() => import('../pages/student/StudentRecoveries'));
const StudentNews = lazy(() => import('../pages/student/StudentNews'));

// Devuelve el árbol de <Route> del grupo Estudiante. Se llama como función
// (no como <StudentRoutes/>) porque React Router v6 solo reconoce <Route>/
// <Fragment> literales al escanear los hijos de <Routes>, no componentes propios.
export const getStudentRoutes = () => (
    <Route element={<ProtectedRoute allowedRoles={ROLES.STUDENT} />}>
        <Route element={<StudentLayout />}>
            <Route path="student" element={<DashboardEstudiante />} />
            <Route path="student/myRegistrations" element={<MyRegistrations />} />
            <Route path="student/payments" element={<Payments />} />
            <Route path="student/profile" element={<Profile />} />
            <Route path="student/enrollment" element={<Enrollment />} />
            <Route path="student/injuries" element={<StudentInjuries />} />
            <Route path="student/recoveries" element={<StudentRecoveries />} />
            <Route path="student/news" element={<StudentNews />} />
            <Route index element={<Navigate to="/dashboard/student" replace />} />
        </Route>
    </Route>
);
