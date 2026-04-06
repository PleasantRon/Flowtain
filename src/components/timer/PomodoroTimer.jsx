import { useMemo } from "react";
import { useTimer } from "../../hooks/useTimer.jsx";
import { formatClock, labelForTimerMode, phaseProgressPercent } from "../../utils/timerFormat.js";
import { TimerPanel } from "./TimerPanel.jsx";

export function PomodoroTimer({ compact = false }) {
  const { timer, settings, start, pause, reset, skipPhase } = useTimer();

  const modeLabel = useMemo(() => labelForTimerMode(timer.mode), [timer.mode]);
  const clock = useMemo(() => formatClock(timer.secondsLeft), [timer.secondsLeft]);
  const progressPercent = useMemo(
    () => phaseProgressPercent(timer.secondsLeft, timer.phaseDurationSeconds),
    [timer.secondsLeft, timer.phaseDurationSeconds]
  );

  return (
    <TimerPanel
      modeLabel={modeLabel}
      clock={clock}
      compact={compact}
      soundOn={settings.soundEnabled}
      progressPercent={progressPercent}
      isRunning={timer.isRunning}
      onStart={start}
      onPause={pause}
      onReset={reset}
      onSkip={skipPhase}
    />
  );
}
