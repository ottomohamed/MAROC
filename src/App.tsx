import React, { Suspense } from "react";
import { Route, Switch } from "wouter";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/layout";
import { Loader2 } from "lucide-react";

// Lazy load pages
const Home = React.lazy(() => import("@/pages/home"));
const ArticlePage = React.lazy(() => import("@/pages/article"));
const SectionPage = React.lazy(() => import("@/pages/section"));
const AuthorPage = React.lazy(() => import("@/pages/author"));
const SubmitPage = React.lazy(() => import("@/pages/submit"));
const NewsroomPage = React.lazy(() => import("@/pages/newsroom"));
const PrivacyPage = React.lazy(() => import("@/pages/privacy"));const AdvertisePage = React.lazy(() => import("@/pages/advertise"));
const AboutPage = React.lazy(() => import("@/pages/about"));
const ContactPage = React.lazy(() => import("@/pages/contact"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/article/:slug" component={ArticlePage} />
              <Route path="/section/:section" component={SectionPage} />
              <Route path="/author/:slug" component={AuthorPage} />
              <Route path="/submit" component={SubmitPage} />
              <Route path="/newsroom" component={NewsroomPage} />
              <Route path="/privacy" component={PrivacyPage} />              <Route path="/advertise" component={AdvertisePage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/contact" component={ContactPage} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Layout>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "12px",
              direction: "rtl",
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;


