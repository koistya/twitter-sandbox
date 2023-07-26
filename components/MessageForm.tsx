"use client";

import { Box, BoxProps, Button } from "@mui/joy";
import { FormEventHandler, useCallback } from "react";
import { Connect } from "./Connect";
import { MessageBox } from "./MessageBox";
import { useHandleSubmit } from "@/app/twitter-message";

export function MessageForm(props: MessageFormProps): JSX.Element {
  const handleSubmit = useHandleSubmit();

  return (
    <Box component="form" onSubmit={handleSubmit} {...props}>
      <MessageBox sx={{ mb: 2 }} inputProps={{ name: "message" }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="submit">Send</Button>

        <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
          <Connect />
        </Box>
      </Box>
    </Box>
  );
}

type MessageFormProps = Omit<BoxProps<"form">, "onSubmit" | "component">;
