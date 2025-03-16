import { useState } from "react";
import { Alert, Card, CardTitle } from "@netlify/sdk/ui/react/components";
import { useNetlifySDK } from "@netlify/sdk/ui/react";

import { trpc } from "../trpc";
import { SpinningWheel } from "./SpinningWheel";

export const Game = () => {
  const {
    context: { deployId },
  } = useNetlifySDK();

  if (!deployId) {
    console.warn("Expected deployId in SiteDeploySurface context");
    return null;
  }

  const deployCancelMutation = trpc.deploy.cancel.useMutation({
    deployId,
  });
  const [shouldCancelBuild, setShouldCancelBuild] = useState(false);

  const handleOnSpinComplete = async (result: boolean) => {
    setShouldCancelBuild(result);
    if (result) {
      deployCancelMutation.mutate();
    }
  };

  return (
    <>
      <Card>
        <CardTitle>Build Roulette</CardTitle>

        <Alert type="info">
          Spin the wheel for a 1-in-6 chance of having your in-progress deploy
          canceled!
        </Alert>

        <SpinningWheel onSpinComplete={handleOnSpinComplete} />
      </Card>

      {shouldCancelBuild ? (
        <Card className="tw-text-center tw-text-xl">
          {deployCancelMutation.isLoading ? "😬 Cancelling deploy..." : ""}
        </Card>
      ) : null}
    </>
  );
};
