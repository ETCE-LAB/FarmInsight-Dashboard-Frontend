import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthenticationCallbackPage } from "../features/auth/ui/AuthenticationCallbackPage";
import { AuthenticationSignoutCallbackPage } from "../features/auth/ui/AuthenticationSignoutCallbackPage";
import { SignIn } from "../features/auth/ui/SignIn";
import {BasicAppShell} from "../ui/components/AppShell/appShell";
import LandingPage from "../ui/components/landingPage/landingPage";
import {AppRoutes} from "./appRoutes";
import {EditOrganization} from "../features/organization/ui/editOrganization";
import {EditUserProfile} from "../features/userProfile/ui/editUserProfile";
import {FpfOverview} from "../features/fpf/ui/fpfOverview";
import {EditFPF} from "../features/fpf/ui/EditFPF";
import LegalNoticePage from "../ui/components/footer/legalNoticePage";
import {StatusPage} from "../features/status/ui/status_page";

export class AuthRoutes {
    static callback = "auth/callback";
    static signout_callback = "auth/signout-callback"
    static signin = "auth/signin"
}


export const Router = () => {
    return (
        <BrowserRouter>
            <BasicAppShell>
                <Routes>
                    <Route path={AuthRoutes.callback} element={<AuthenticationCallbackPage />} />
                    <Route path={AuthRoutes.signout_callback} element={<AuthenticationSignoutCallbackPage />} />
                    <Route path={AuthRoutes.signin} element={<SignIn />} />
                    <Route path={AppRoutes.base} element={<LandingPage />} />
                    <Route path={AppRoutes.organization} element={<EditOrganization />} />
                    <Route path={AppRoutes.editUserProfile} element={<EditUserProfile />} />
                    <Route path={AppRoutes.displayFpf} element={<FpfOverview />} />
                    <Route path={AppRoutes.editFpf} element={<EditFPF />} />
                    <Route path={AppRoutes.legalNotice} element={<LegalNoticePage />} /> {/* Add this line */}

                    <Route path={AppRoutes.statusOverview} element={<StatusPage />} />
                </Routes>
            </BasicAppShell>
        </BrowserRouter>
    );
};
