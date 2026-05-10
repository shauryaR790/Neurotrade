import AmbientBackground from "@/components/effects/AmbientBackground";
import Navbar from "@/components/layout/Navbar";
import TickerTape from "@/components/ui/TickerTape";
import Toaster from "@/components/ui/Toaster";
import Hero from "@/sections/Hero";
import AICopilot from "@/sections/AICopilot";
import MarketOverview from "@/sections/MarketOverview";
import PortfolioAnalytics from "@/sections/PortfolioAnalytics";
import StrategyBuilder from "@/sections/StrategyBuilder";
import SignalEngine from "@/sections/SignalEngine";
import NewsFeed from "@/sections/NewsFeed";
import Performance from "@/sections/Performance";
import Watchlist from "@/sections/Watchlist";
import Workspace from "@/sections/Workspace";
import CommandCenter from "@/sections/CommandCenter";
import Footer from "@/sections/Footer";
import { useLiveData } from "@/hooks/useLiveData";

export default function App() {
  useLiveData();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <TickerTape className="my-2" />
        <AICopilot />
        <MarketOverview />
        <PortfolioAnalytics />
        <StrategyBuilder />
        <SignalEngine />
        <NewsFeed />
        <Performance />
        <Watchlist />
        <Workspace />
        <CommandCenter />
        <Footer />
      </main>

      <Toaster />
    </div>
  );
}
