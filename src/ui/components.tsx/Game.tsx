import { useState } from "react";
import { Alert, Card, CardTitle } from "@netlify/sdk/ui/react/components";
import { useNetlifySDK } from "@netlify/sdk/ui/react";

// import { trpc } from "../trpc";
import { SpinningWheel } from "./SpinningWheel";

export const Game = () => {
  const {
    context: { deployId },
  } = useNetlifySDK();

  // const deployCancelMutation = trpc.cancelDeploy.useMutation();
  const [shouldCancelBuild, setShouldCancelBuild] = useState<boolean | null>(
    null,
  );

  const handleOnSpinComplete = async (result: boolean) => {
    // console.debug("result:", result);
    setShouldCancelBuild(result);
    if (result) {
      if (!deployId) {
        // FIXME(serhalp) This isn't actually available in this surface yet, so this always triggers.
        console.warn("Expected deployId in SiteDeploySurface context");
        return;
      }
      // deployCancelMutation.mutate({ deployId });
    }
  };

  return (
    <>
      <Card>
        <CardTitle>Build Roulette</CardTitle>

        <Alert type="info">
          Spin the wheel for a 1-in-6 chance of having your in-progress deploy
          canceled! <span className="tw-font-bold">Disclaimer: </span> this is
          not a joke.
        </Alert>

        <SpinningWheel onSpinComplete={handleOnSpinComplete} />
      </Card>

      {shouldCancelBuild != null ? (
        <Card className="tw-text-center tw-text-xl">
          {shouldCancelBuild
            ? false // deployCancelMutation.isLoading
              ? "😬 Cancelling deploy..."
              : "🌝 Deploy cancelled"
            : "😅 Your deploy is safe!"}
        </Card>
      ) : null}
    </>
  );
};
