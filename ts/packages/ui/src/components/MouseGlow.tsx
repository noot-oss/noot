export interface MouseGlowProps {
  x: number;
  y: number;
}
export const MouseGlow = (props: MouseGlowProps) => {
  return (
    <div
      className="pointer-events-none fixed hidden h-80 w-80 translate-x-[-50%] translate-y-[-50%] transform rounded-full bg-gradient-to-br from-white/10 to-blue-50/10 blur-3xl md:block"
      style={{
        left: props.x,
        top: props.y,
      }}
    />
  );
};
