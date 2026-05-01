import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ToolsPage = lazy(() => import("@/pages/ToolsPage"));
const AgeCalculatorPage = lazy(() => import("@/pages/tools/AgeCalculatorPage"));
const BmiCalculatorPage = lazy(() => import("@/pages/tools/BmiCalculatorPage"));
const LoanCalculatorPage = lazy(() => import("@/pages/tools/LoanCalculatorPage"));
const PercentageCalculatorPage = lazy(() => import("@/pages/tools/PercentageCalculatorPage"));
const WordCounterPage = lazy(() => import("@/pages/tools/WordCounterPage"));
const PasswordGeneratorPage = lazy(() => import("@/pages/tools/PasswordGeneratorPage"));
const QrCodeGeneratorPage = lazy(() => import("@/pages/tools/QrCodeGeneratorPage"));
const UnitConverterPage = lazy(() => import("@/pages/tools/UnitConverterPage"));
const DomainAuthorityPage = lazy(() => import("@/pages/tools/DomainAuthorityPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/tools" component={ToolsPage} />
          <Route path="/tools/age-calculator" component={AgeCalculatorPage} />
          <Route path="/tools/bmi-calculator" component={BmiCalculatorPage} />
          <Route path="/tools/loan-calculator" component={LoanCalculatorPage} />
          <Route path="/tools/percentage-calculator" component={PercentageCalculatorPage} />
          <Route path="/tools/word-counter" component={WordCounterPage} />
          <Route path="/tools/password-generator" component={PasswordGeneratorPage} />
          <Route path="/tools/qr-code-generator" component={QrCodeGeneratorPage} />
          <Route path="/tools/unit-converter" component={UnitConverterPage} />
          <Route path="/tools/domain-authority-checker" component={DomainAuthorityPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={BlogPostPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/shop/:id" component={ProductPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
