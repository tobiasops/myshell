import { Astal, Gtk } from "ags/gtk4";
import { Variable, bind } from "astal";
import { Tray } from "./widgets/Tray";
import { Workspaces } from "./widgets/Workspaces";
import { FocusedClient } from "./widgets/FocusedClient";
import { Apps } from "./widgets/Apps";
import { Clock } from "./widgets/Clock";
import { Status } from "./widgets/Status";
import { Media } from "./widgets/Media";

export const Bar = (mon: number) => {
    const widgetSpacing = 4;
    
    // Variabel for å styre animasjonen
    const revealBar = Variable(false);

    return <Astal.Window 
        namespace={"top-bar"} 
        layer={Astal.Layer.TOP}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        
        // NORMAL = Overlay. Best for ytelse og visuell ro (ingen re-tiling av vinduer)
        exclusivity={Astal.Exclusivity.NORMAL}
        
        monitor={mon}
        keymode={Astal.Keymode.NONE}
    >
        <Gtk.Box 
            orientation={Gtk.Orientation.VERTICAL}
            // SETUP: Dette er GTK4 "Best Practice" for avansert event-håndtering
            setup={(self) => {
                // 1. Vi lager en Motion Controller (standard i GTK4 for å spore mus)
                const controller = new Gtk.EventControllerMotion();
                
                // 2. Koble på signaler
                controller.connect("enter", () => {
                    revealBar.set(true);
                });
                
                controller.connect("leave", () => {
                    revealBar.set(false);
                });
                
                // 3. Monter kontrolleren på boksen
                self.add_controller(controller);
            }}
        >
            
            {/* 
                TRIGGER ZONE: 
                En usynlig stripe på 3px som alltid ligger i toppen.
                background-color: transparent sikrer at OLED-pikslene er AV (sorte).
            */}
            <Gtk.Box css="min-height: 3px; min-width: 100%; background-color: transparent;" />

            <Gtk.Revealer
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                revealChild={bind(revealBar)}
                transitionDuration={300}
            >
                {/* Selve innholdet i baren */}
                <Gtk.Box class={"bar-container"}>
                    <Gtk.CenterBox class={"bar-centerbox"} hexpand>
                        
                        {/* Venstre side */}
                        <Gtk.Box class={"widgets-left"} homogeneous={false}
                            halign={Gtk.Align.START} spacing={widgetSpacing} $type="start">
                            <Apps />
                            <Workspaces />
                            <FocusedClient />
                        </Gtk.Box>

                        {/* Midten */}
                        <Gtk.Box class={"widgets-center"} homogeneous={false}
                            spacing={widgetSpacing} halign={Gtk.Align.CENTER} $type="center">
                            <Clock />
                            <Media />
                        </Gtk.Box>

                        {/* Høyre side */}
                        <Gtk.Box class={"widgets-right"} homogeneous={false}
                            spacing={widgetSpacing} halign={Gtk.Align.END} $type="end">
                            <Tray />
                            <Status />
                        </Gtk.Box>

                    </Gtk.CenterBox>
                </Gtk.Box>
            </Gtk.Revealer>
        </Gtk.Box>
    </Astal.Window>
}