import { useEffect, useMemo, useRef, useState } from "react";
import { useTimer } from "../../hooks/useTimer.jsx";
import { formatClock, labelForTimerMode, phaseProgressPercent } from "../../utils/timerFormat.js";
import { TimerPanel } from "./TimerPanel.jsx";

export function PomodoroTimer({ compact = false }) {
  const {
    timer,
    settings,
    start,
    pause,
    reset,
    skipPhase,
    isFocusActive,
    selectedTask,
    setSelectedTask,
    taskOptions,
  } = useTimer();
  const prevModeRef = useRef(timer.mode);
  const [phaseMotionKey, setPhaseMotionKey] = useState(0);

  const modeLabel = useMemo(() => labelForTimerMode(timer.mode), [timer.mode]);
  const clock = useMemo(() => formatClock(timer.secondsLeft), [timer.secondsLeft]);
  const progressPercent = useMemo(
    () => phaseProgressPercent(timer.secondsLeft, timer.phaseDurationSeconds),
    [timer.secondsLeft, timer.phaseDurationSeconds]
  );

  useEffect(() => {
    if (prevModeRef.current !== timer.mode) {
      setPhaseMotionKey((key) => key + 1);
      prevModeRef.current = timer.mode;
    }
  }, [timer.mode]);

  return (
    <TimerPanel
      mode={timer.mode}
      modeLabel={modeLabel}
      clock={clock}
      compact={compact}
      soundOn={settings.soundEnabled}
      progressPercent={progressPercent}
      isRunning={timer.isRunning}
      isFocusActive={isFocusActive}
      phaseMotionKey={phaseMotionKey}
      selectedTask={selectedTask}
      taskOptions={taskOptions}
      onTaskChange={setSelectedTask}
      onStart={start}
      onPause={pause}
      onReset={reset}
      onSkip={skipPhase}
    />
  );
}
