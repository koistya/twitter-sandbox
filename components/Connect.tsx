import {
  useConnectTwitter,
  useDisconnectTwitter,
  useTwitterCredentials,
} from "@/app/twitter";
import { Button } from "@mui/joy";

export function Connect(): JSX.Element {
  const [connect, inFlight] = useConnectTwitter();
  const disconnect = useDisconnectTwitter();
  const credentials = useTwitterCredentials();

  return (
    <Button
      variant="soft"
      loading={inFlight}
      onClick={credentials ? disconnect : connect}
    >
      {credentials ? "Disconnect Twitter" : "Connect Twitter"}
    </Button>
  );
}
