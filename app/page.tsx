import { MessageForm } from "@/components/MessageForm";
import { Container, Link, Typography } from "@mui/joy";

export default function Home() {
  return (
    <Container
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      maxWidth="sm"
    >
      <Typography sx={{ alignSelf: "center", mb: 1 }} level="h3">
        Twitter Sandbox
      </Typography>

      <Typography sx={{ alignSelf: "center", mb: 2 }}>
        Need help with React? Reach out to me on{" "}
        <Link href="https://codementor.io/@koistya">Codementor</Link>.
      </Typography>

      <MessageForm />
    </Container>
  );
}
