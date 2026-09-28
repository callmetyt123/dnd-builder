import { HomePage } from "../pages/HomePage";
import { PlaystylePage } from "../pages/PlaystylePage";
import { ClassPage } from "../pages/ClassPage";
import { SpeciesPage } from "../pages/SpeciesPage";
import { BackgroundPage } from "../pages/BackgroundPage";
import { AbilitiesPage } from "../pages/AbilitiesPage";
import { ConfigurationPage } from "../pages/ConfigurationPage";
import { IdentityPage } from "../pages/IdentityPage";
import { ReviewPage } from "../pages/ReviewPage";
import { CharacterPage } from "../pages/CharacterPage";
import { BuilderProvider, useBuilder } from "../store/builder";

function CurrentPage() {
  const { state } = useBuilder();
  switch (state.step) {
    case "playstyle": return <PlaystylePage />;
    case "class": return <ClassPage />;
    case "species": return <SpeciesPage />;
    case "background": return <BackgroundPage />;
    case "abilities": return <AbilitiesPage />;
    case "configuration": return <ConfigurationPage />;
    case "identity": return <IdentityPage />;
    case "review": return <ReviewPage />;
    case "character": return <CharacterPage />;
    default: return <HomePage />;
  }
}

export function App() {
  return <BuilderProvider><CurrentPage /></BuilderProvider>;
}
