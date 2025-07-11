import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { MainLayout } from './pages/Layout/MainLayout';
// import { EmptyStatePage } from './pages/EmptyStatePage/EmptyStatePage';
import {MainPage} from "./pages/MainPage/MainPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/home"
                    element={<MainPage />}
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
