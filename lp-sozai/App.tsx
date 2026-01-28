import React, { useState } from 'react';
import { ThemeType } from './types';
import ModernTheme from './components/themes/ModernTheme';
import ElegantTheme from './components/themes/ElegantTheme';
import CleanTheme from './components/themes/CleanTheme';
import PopTheme from './components/themes/PopTheme';
import LuxuryDarkTheme from './components/themes/LuxuryDarkTheme';
import NatureTheme from './components/themes/NatureTheme';
import JapanTheme from './components/themes/JapanTheme';
import CyberTheme from './components/themes/CyberTheme';
import RetroTheme from './components/themes/RetroTheme';
import LofiTheme from './components/themes/LofiTheme';
import NordicTheme from './components/themes/NordicTheme';
import BoldTheme from './components/themes/BoldTheme';
import LofiWarmTheme from './components/themes/LofiWarmTheme';
import CityPopTheme from './components/themes/CityPopTheme';
import AnalogTheme from './components/themes/AnalogTheme';
import VaporwaveTheme from './components/themes/VaporwaveTheme';
import AbstractTheme from './components/themes/AbstractTheme';
import RainyTheme from './components/themes/RainyTheme';
import ThemeSelector from './components/ThemeSelector';

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(ThemeType.MODERN);

  const renderTheme = () => {
    switch (currentTheme) {
      case ThemeType.MODERN:
        return <ModernTheme />;
      case ThemeType.ELEGANT:
        return <ElegantTheme />;
      case ThemeType.CLEAN:
        return <CleanTheme />;
      case ThemeType.POP:
        return <PopTheme />;
      case ThemeType.LUXURY:
        return <LuxuryDarkTheme />;
      case ThemeType.NATURE:
        return <NatureTheme />;
      case ThemeType.JAPAN:
        return <JapanTheme />;
      case ThemeType.CYBER:
        return <CyberTheme />;
      case ThemeType.RETRO:
        return <RetroTheme />;
      case ThemeType.LOFI:
        return <LofiTheme />;
      case ThemeType.NORDIC:
        return <NordicTheme />;
      case ThemeType.BOLD:
        return <BoldTheme />;
      case ThemeType.LOFI_WARM:
        return <LofiWarmTheme />;
      case ThemeType.CITY_POP:
        return <CityPopTheme />;
      case ThemeType.ANALOG:
        return <AnalogTheme />;
      case ThemeType.VAPORWAVE:
        return <VaporwaveTheme />;
      case ThemeType.ABSTRACT:
        return <AbstractTheme />;
      case ThemeType.RAINY:
        return <RainyTheme />;
      default:
        return <ModernTheme />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderTheme()}
      <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
    </div>
  );
};

export default App;