import {
  MAX_MESSAGE_LENGTH,
  useImageFile,
  useImageFileCHangeHandler,
  useImageURL,
  useMessage,
} from "@/app/twitter-message";
import { Box, IconButton, Typography } from "@mui/joy";
import { ImageIcon } from "./ImageIcon";

/**
 * These controls are shown below the message box:
 *   - An image icon button
 *   - The number of used characters, e.g. "10/160"
 */
export function MessageBoxControls(): JSX.Element {
  const message = useMessage();
  const image = useImageFile();
  const imageUrl = useImageURL();
  const color = message.length > MAX_MESSAGE_LENGTH ? "danger" : undefined;
  const handleImageChange = useImageFileCHangeHandler();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {imageUrl && (
        <Box sx={{ width: "100%", flexGrow: 1 }}>
          <Box
            component="img"
            sx={{ maxWidth: "100%", mt: 0.5 }}
            src={imageUrl}
            alt={image?.name ?? ""}
          />
        </Box>
      )}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ mt: 0.5, alignSelf: "flex-end" }}>
          <IconButton component="label">
            <ImageIcon />
            <input
              name="image"
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleImageChange}
              hidden
            />
          </IconButton>
        </Box>
        <Typography
          sx={{ flexGrow: 1, mt: 0.5, alignSelf: "flex-end" }}
          level="body3"
          color={color}
          textAlign="right"
        >
          {message.length}/{MAX_MESSAGE_LENGTH}
        </Typography>
      </Box>
    </Box>
  );
}
