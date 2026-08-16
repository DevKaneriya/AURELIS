import Material from "@/components/chapters/Material";
import Configurator from "@/components/chapters/Configurator";
import Finale from "@/components/chapters/Finale";

// Scrollable chapters that flow after the pinned WebGL hero.
export default function Chapters() {
  return (
    <div className="relative z-20">
      <Material />
      <Configurator />
      <Finale />
    </div>
  );
}
