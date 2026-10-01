import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import StudentLayout from '../layouts/StudentLayout';
import DashboardEstudiante from '../pages/DashboardEstudiante';
import MyRegistrations from '../pages/student/MyRegistrations';
import Payments from '../pages/student/Payments';
import Profile from '../pages/student/Profile';
import Enrollment from '../pages/student/enrollment';
import StudentInjuries from '../pages/student/StudentInjuries';
import StudentRecoveries from '../pages/student/StudentRecoveries';
import StudentNews from '../pages/student/StudentNews';
import { ROLES } from './roles';

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
