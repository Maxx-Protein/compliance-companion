import React from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";

const TOUR_STORAGE_KEY_PREFIX = "compliancehub_tour_";

interface PageTourProps {
  tourId: string;
  steps: Step[];
}

export const PageTour: React.FC<PageTourProps> = ({ tourId, steps }) => {
  const [run, setRun] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(TOUR_STORAGE_KEY_PREFIX + tourId);
    if (stored !== "completed") {
      setRun(true);
    }
  }, [tourId]);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      window.localStorage.setItem(TOUR_STORAGE_KEY_PREFIX + tourId, "completed");
      setRun(false);
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--background))",
          textColor: "hsl(var(--foreground))",
        },
      }}
    />
  );
};
