import { AuthProvider } from "../context/AuthContext.jsx";
import { TaskProvider } from "../context/TaskContext.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";
import { FlowFeedbackProvider } from "../hooks/useFlowFeedback.jsx";
import { PointsProvider } from "../hooks/usePoints.jsx";
import { TimerProvider } from "../hooks/useTimer.jsx";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FlowFeedbackProvider>
          <PointsProvider>
            <TaskProvider>
              <TimerProvider>{children}</TimerProvider>
            </TaskProvider>
          </PointsProvider>
        </FlowFeedbackProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
