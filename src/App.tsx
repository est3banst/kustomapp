import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProvider } from "@/context/UserContext";
import ProtectedRoute from "@/middleware/ProtectedRoute";

import Landing             from "@/pages/Landing";
import Login               from "@/pages/Login";
import Register            from "@/pages/Register";
import ForgotPassword      from "@/pages/ForgotPassword";
import UserPage            from "@/pages/UserPage";
import DeveloperDashboard  from "@/pages/DeveloperDashboard";
import Services            from "@/pages/Services";
import Developers          from "@/pages/Developers";
import Help                from "@/pages/Help";
import FAQ                 from "@/pages/FAQ";
import FreeConsultation    from "@/pages/FreeConsultation";
import { PrivacyPolicy, TermsOfService, CookiePolicy } from "@/pages/legal/Legalpages";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <UserProvider>
          <Routes>

            <Route path="/"                  element={<Landing />}           />
            <Route path="/services"          element={<Services />}          />
            <Route path="/developers"        element={<Developers />}        />
            <Route path="/help"              element={<Help />}              />
            <Route path="/faq"               element={<FAQ />}               />
            <Route path="/free-consultation" element={<FreeConsultation />}  />
            <Route path="/privacy"           element={<PrivacyPolicy />}     />
            <Route path="/terms"             element={<TermsOfService />}    />
            <Route path="/cookies"           element={<CookiePolicy />}      />

            <Route path="/login"     element={<ProtectedRoute guestOnly><Login /></ProtectedRoute>}          />
            <Route path="/registro"  element={<ProtectedRoute guestOnly><Register /></ProtectedRoute>}       />
            <Route path="/recuperar" element={<ProtectedRoute guestOnly><ForgotPassword /></ProtectedRoute>} />

            <Route path="/user-page"      element={<ProtectedRoute><UserPage /></ProtectedRoute>}           />
            <Route path="/user/developer" element={<ProtectedRoute><DeveloperDashboard /></ProtectedRoute>} />

            <Route path="*" element={<Landing />} />
          </Routes>
        </UserProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;