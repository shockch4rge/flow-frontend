import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useLazyGetCurrentUserQuery } from "./app/services/auth";
import { useAuthContext } from "./hooks/useAuthContext";
import { BoardPage } from "./layouts/board/ui/BoardPage";
import { LandingPage } from "./layouts/landing/ui/LandingPage";
import { MainView } from "./layouts/main/ui/MainView";
import { SettingsPage } from "./layouts/settings/ui/SettingsPage";
import { AppRoutes } from "./utils/routes";

const App: React.FC = () => {
    const { token } = useAuthContext();
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        if (!token) return;

        getCurrentUser().unwrap();
    }, []);

    return (
        <>
            <Routes>
                <Route index element={<LandingPage />} />
                <Route path={AppRoutes.Main} element={<MainView />}>
                    <Route path={AppRoutes.Board} element={<BoardPage />} />
                    <Route path={AppRoutes.Settings} element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<Navigate replace to={AppRoutes.Landing} />} />
            </Routes>
        </>
    );
};

export default App;
