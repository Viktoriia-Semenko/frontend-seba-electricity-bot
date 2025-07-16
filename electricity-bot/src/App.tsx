import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { MainLayout } from './pages/Layout/MainLayout';
import {ProtectedRoute} from "./Components/ProtectedRoute/ProtectedRoute.tsx";
import {MainPage} from "./pages/MainPage/MainPage.tsx";
import {SettingsPage} from "./pages/SettingsPage/SettingsPage.tsx";
import {HistoryPage} from "./pages/HistoryPage/HistoryPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/home"
                        element={<MainLayout page="home"><MainPage/></MainLayout>}
                    />
                    <Route
                        path="/history"
                        element={
                            <MainLayout page="history">
                                <HistoryPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/settings"
                        element={<MainLayout page="settings"><SettingsPage /></MainLayout>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
