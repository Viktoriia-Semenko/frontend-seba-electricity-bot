import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { MainLayout } from './pages/Layout/MainLayout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        <MainLayout page="home">
                            <p style={{ color: 'white' }}>Home content</p>
                        </MainLayout>
                    }
                />
                <Route
                    path="/history"
                    element={
                        <MainLayout page="history">
                            <p style={{ color: 'white' }}>History content</p>
                        </MainLayout>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <MainLayout page="settings">
                            <p style={{ color: 'white' }}>Settings content</p>
                        </MainLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
