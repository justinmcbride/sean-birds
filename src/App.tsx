import "./App.css";

import { useEffect, useRef, useState } from "react";

import { Button, Card, Code, Group, Stack, Textarea, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BirdIcon, CopyIcon } from "@phosphor-icons/react";

import { convertToHTML, sortBirdList, type Bird } from "./lib/utils";

function App() {
  const [text, setText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [birdList, setBirdList] = useState<Bird[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-sort the text whenever it changes
  useEffect(() => {
    if (!text.trim()) {
      setHtmlContent("");
      return;
    }

    try {
      const sorted = sortBirdList(text);
      setBirdList(sorted);
      setHtmlContent(convertToHTML(sorted));
    } catch (err) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "HTML content could not be generated! " + String(err),
      });
      // Keep the unsorted text in the output if there's an error
      setHtmlContent("");
    }
  }, [text]);

  // Handle text changes in the editor
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
  };

  // Copy content to clipboard
  const copyToClipboard = async () => {
    try {
      // Create a Blob with the content and the correct MIME type
      const blob = new Blob([htmlContent], { type: "text/html" });

      // Create a ClipboardItem with the content
      const clipboardItem = new ClipboardItem({
        "text/html": blob,
      });

      // Write the clipboard item to the clipboard
      await navigator.clipboard.write([clipboardItem]);
      notifications.show({
        title: "Copied",
        color: "green",
        message: "HTML content copied to clipboard!",
      });
    } catch {
      void navigator.clipboard.writeText(htmlContent);
      notifications.show({
        title: "Copied, maybe?",
        color: "yellow",
        message:
          "Raw content copied to clipboard! This might not be what you want",
      });
    }
  };

  return (
    <Stack align="stretch" justify="center" gap="xl">
      <Group justify="center" align="center">
        <BirdIcon size={32} />
        <Title order={1}>Sean's Bird List Sorter</Title>
        <BirdIcon size={32} />
      </Group>

      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Title order={3}>Input</Title>
        </Card.Section>
        <Textarea
          ref={textareaRef}
          rows={7}
          placeholder="Enter your comma-separated bird list here..."
          className="font-mono"
          value={text}
          onChange={handleTextChange}
        />
      </Card>

      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Title order={3}>Output</Title>
        </Card.Section>

        <Button
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          onClick={copyToClipboard}
          disabled={!htmlContent}
        >
          <CopyIcon size={16} />
          Copy HTML to Clipboard
        </Button>

        <Card.Section>
          <Title order={4} mt="md">
            Preview
          </Title>
          <Group justify="center" gap="sm" grow>
            <iframe srcDoc={htmlContent} />
            <Code block>{htmlContent}</Code>
          </Group>
        </Card.Section>
      </Card>
    </Stack>
  );
}

export default App;
