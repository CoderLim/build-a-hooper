import { HooperGame } from '@/components/hooper-game/hooper-game';

export function Hero() {
  return (
    <section id="play" className="scroll-mt-16">
      <HooperGame embedded />
    </section>
  );
}
