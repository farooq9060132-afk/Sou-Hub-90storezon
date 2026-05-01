import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ToolsPage from "@/pages/ToolsPage";
import AgeCalculatorPage from "@/pages/tools/AgeCalculatorPage";
import BmiCalculatorPage from "@/pages/tools/BmiCalculatorPage";
import LoanCalculatorPage from "@/pages/tools/LoanCalculatorPage";
import PercentageCalculatorPage from "@/pages/tools/PercentageCalculatorPage";
import WordCounterPage from "@/pages/tools/WordCounterPage";
import PasswordGeneratorPage from "@/pages/tools/PasswordGeneratorPage";
import QrCodeGeneratorPage from "@/pages/tools/QrCodeGeneratorPage";
import UnitConverterPage from "@/pages/tools/UnitConverterPage";
import DomainAuthorityPage from "@/pages/tools/DomainAuthorityPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Layout>
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
