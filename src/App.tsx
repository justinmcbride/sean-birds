import "./App.css";

import { useEffect, useRef, useState } from "react";

import { CopyIcon } from "@phosphor-icons/react";
import { Button, Card, Stack, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { convertToHTML, sortBirdList } from "./lib/utils";

function App() {
  const [text, setText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-sort the text whenever it changes
  useEffect(() => {
    if (!text.trim()) {
      setHtmlContent("");
      return;
    }

    try {
      const sorted = sortBirdList(text);
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
      <h2 className="text-2xl font-bold">Sean's Bird List Sorter</h2>

      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Card.Section>
          <h3 className="text-lg font-semibold">Input</h3>
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
          <h3 className="text-lg font-semibold">Output</h3>
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

        <iframe srcDoc={htmlContent} />
      </Card>
    </Stack>
  );
}

export default App;
