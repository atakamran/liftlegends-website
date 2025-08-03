import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProductSchema from "@/components/ProductSchema";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/company/PrivacyPolicy";
import TermsOfUse from "./pages/company/TermsOfUse";
import WorkWithUs from "./pages/company/WorkWithUs";
import ResetPassword from "./pages/profile/ResetPassword";
import UpdatePassword from "./pages/profile/UpdatePassword";
import Blog from "./pages/blog/Blog";
import BlogPost from "./pages/blog/BlogPost";
import CoachApplication from "./pages/coach/CoachApplication";
import Download from "./pages/download/Download";
import Profile from "./pages/profile/Profile";
import Dashboard from "./pages/profile/Dashboard";
import PaymentCallback from "./pages/payment/PaymentCallback";
import Subscription from "./pages/payment/Subscription";
import Payment from "./pages/payment/Payment";
import AboutUs from "./pages/company/AboutUs";
import Login from "./pages/profile/Login";
import Programs from "./pages/programs/Programs";
import ProductPage from "./pages/programs/ProductPage";
import ProgramDetails from "./pages/programs/ProgramDetails";
import Legends from "./pages/legends/Legends";
import Search from "./pages/Search";
import Gyms from "./pages/gyms/Gyms";
import Coaches from "./pages/coaches/Coaches";
import Cart from "./pages/cart/Cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <BreadcrumbSchema />
        <ProductSchema />
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/about-us" element={<AboutUs />} />
            {/* <Route path="/work-with-us" element={<WorkWithUs />} /> */}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPost />} />
            <Route path="/coach-application" element={<CoachApplication />} />
            <Route path="/download" element={<Download />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment-callback" element={<PaymentCallback />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route
              path="/programs/:programId/details"
              element={<ProgramDetails />}
            />
            <Route path="/legends" element={<Legends />} />
            <Route path="/search" element={<Search />} />
            <Route path="/gyms" element={<Gyms />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/cart" element={<Cart />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
