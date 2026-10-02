import type { ComponentProps } from "react";
import { scenes, sceneBackground, type SceneName } from "@/lib/scenes";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"div"> & { scene: SceneName };

/** A coloured mesh for glass to blur. Every glass surface sits inside one. */
export function GradientScene({ scene, className, style, children, ...rest }: Props) {
  return (
    <div
      data-scene={scene}
      className={cn("scene-grain relative isolate overflow-hidden", className)}
      style={{ background: sceneBackground(scenes[scene]), ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
