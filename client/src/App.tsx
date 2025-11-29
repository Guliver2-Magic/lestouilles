import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Portfolio from "./pages/Portfolio";
import AdminOrders from "./pages/AdminOrders";
import Reservations from "./pages/Reservations";
import AdminReservations from "./pages/AdminReservations";
import AdminProducts from "./pages/AdminProducts";
import AdminDailySpecials from "./pages/AdminDailySpecials";
import AdminFAQ from "./pages/AdminFAQ";
import AdminMenu from "./pages/AdminMenu";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminGallery from "./pages/AdminGallery";
import AdminSettings from "./pages/AdminSettings";
import MealPlanner from "./pages/MealPlanner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Chatbot } from "./components/Chatbot";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/reservations"} component={Reservations} />
      <Route path={"/meal-planner"} component={MealPlanner} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/reservations"} component={AdminReservations} />
      <Route path={"/admin/products"} component={AdminProducts} />
      <Route path={"/admin/daily-specials"} component={AdminDailySpecials} />
      <Route path={"/admin/faq"} component={AdminFAQ} />
      <Route path={"/admin/menu"} component={AdminMenu} />
      <Route path={"/admin/testimonials"} component={AdminTestimonials} />
      <Route path={"/admin/gallery"} component={AdminGallery} />
      <Route path={"/admin/settings"} component={AdminSettings} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <Chatbot />
            </TooltipProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
