import Material from "@/components/chapters/Material";
import Performance from "@/components/chapters/Performance";
import Machine from "@/components/chapters/Machine";
import Configurator from "@/components/chapters/Configurator";
import Design from "@/components/chapters/Design";
import Finale from "@/components/chapters/Finale";

// Scrollable chapters that flow after the pinned WebGL hero.
// Transparent chapters (Performance/Machine/Configurator) reveal the live 3D car.
export default function Chapters() {
  return (
    <div className="relative z-20">
      <Material />
      <Performance />
      <Machine />
      <Configurator />
      <Design />
      <Finale />
    </div>
  );
}
