import { Astal, Gtk, App } from "astal/gtk4";
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
  const revealBar = Variable(false);

  return <Astal.Window
  namespace={"top-bar"}
  layer={Astal.Layer.TOP}
  anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}

  // EXCLUSIVE: Sørger for at Hyprland ikke legger vinduer OPPÅ trigger-sonen.
  // Dette garanterer at "onHover" alltid fungerer.
  exclusivity={Astal.Exclusivity.NORMAL}

  monitor={mon}
  // Key-layer setup
  keymode={Astal.Keymode.NONE}
  >
  <Gtk.Box
  orientation={Gtk.Orientation.VERTICAL}
  // Her skjer magien: Setter variabelen basert på hover
  onHoverEnter={() => revealBar.set(true)}
  onHoverLeave={() => revealBar.set(false)}
  >

  {/*
    TRIGGER ZONE (Alltid synlig/aktiv):
    - 3px høyde er "sweet spot" for 1440p/4K skjermer.
    - 1px kan være vanskelig å treffe presist.
    - css background transparent = OLED safe (sort).
    */}
    <Gtk.Box css="min-height: 3px; min-width: 100%; background-color: transparent;" />

    <Gtk.Revealer
    transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
    revealChild={bind(revealBar)}
    transitionDuration={300}
    >
    {/*
      Selve baren.
      Vi legger på en class "bar-window" her hvis du vil style bakgrunnen i CSS,
      f.eks. blur eller opacity.
      */}
      <Gtk.Box class={"bar-container"} css="margin-bottom: 0px;">
      <Gtk.CenterBox class={"bar-centerbox"} hexpand>

      <Gtk.Box class={"widgets-left"} homogeneous={false}
      halign={Gtk.Align.START} spacing={widgetSpacing}
      $type="start">
      <Apps />
      <Workspaces />
      <FocusedClient />
      </Gtk.Box>

      <Gtk.Box class={"widgets-center"} homogeneous={false}
      spacing={widgetSpacing} halign={Gtk.Align.CENTER}
      $type="center">
      <Clock />
      <Media />
      </Gtk.Box>

      <Gtk.Box class={"widgets-right"} homogeneous={false}
      spacing={widgetSpacing} halign={Gtk.Align.END}
      $type="end">
      <Tray />
      <Status />
      </Gtk.Box>
      </Gtk.CenterBox>
      </Gtk.Box>
      </Gtk.Revealer>
      </Gtk.Box>
      </Astal.Window>
}
