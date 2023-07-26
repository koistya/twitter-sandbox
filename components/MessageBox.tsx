import {
  MAX_MESSAGE_LENGTH,
  useMessage,
  useMessageChangeHandler,
} from "@/app/twitter-message";
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Textarea,
  TextareaProps,
} from "@mui/joy";
import { MessageBoxControls } from "./MessageBoxControls";

export function MessageBox(props: MessageBoxProps): JSX.Element {
  const { inputProps, ...other } = props;
  const value = useMessage();
  const handleChange = useMessageChangeHandler();
  const hasError = other.error || value.length > MAX_MESSAGE_LENGTH;

  return (
    <FormControl required {...other} error={hasError}>
      <FormLabel>Your message</FormLabel>
      <Textarea
        name="message"
        placeholder="Write here..."
        minRows={4}
        autoFocus
        required
        value={value}
        onChange={handleChange}
        endDecorator={<MessageBoxControls />}
        {...inputProps}
      />
    </FormControl>
  );
}

type MessageBoxProps = FormControlProps<
  "div",
  {
    inputProps?: TextareaProps;
  }
>;
