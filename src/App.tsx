import "./App.css";

import { useEffect, useRef, useState } from "react";

import {
  Accordion,
  Button,
  Card,
  Code,
  Group,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BirdIcon, CopyIcon } from "@phosphor-icons/react";

import { convertToHTML, sortBirdList, type Bird } from "./lib/utils";

function App() {
  const [text, setText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [birdList, setBirdList] = useState<Bird[]>([]);
  const [longestCommonName, setLongestCommonName] = useState<string>("");
  const [longestScientificName, setLongestScientificName] =
    useState<string>("");
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
        position: "top-right",
        message: "HTML content could not be generated! " + String(err),
      });
      // Keep the unsorted text in the output if there's an error
      setHtmlContent("");
    }
  }, [text]);

  useEffect(() => {
    // Find the longest names of the birds
    if (birdList.length > 0) {
      const longestCommon = birdList.reduce((longest, bird) => {
        return bird.commonName.length > longest.length
          ? bird.commonName
          : longest;
      }, "");
      setLongestCommonName(longestCommon);

      // Find the longest scientific name
      const longestScientific = birdList.reduce((longest, bird) => {
        return bird.scientificName.length > longest.length
          ? bird.scientificName
          : longest;
      }, "");
      setLongestScientificName(longestScientific);
    } else {
      setLongestCommonName("");
      setLongestScientificName("");
    }
  }, [birdList]);

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
        position: "top-right",
      });
    } catch {
      void navigator.clipboard.writeText(htmlContent);
      notifications.show({
        title: "Copied, maybe?",
        color: "yellow",
        message:
          "Raw content copied to clipboard! This might not be what you want",
        position: "top-right",
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
        <Card.Section>
          <Textarea
            ref={textareaRef}
            rows={7}
            placeholder="Enter your comma-separated bird list here..."
            className="font-mono"
            value={text}
            onChange={handleTextChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </Card.Section>
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
          Copy to Clipboard for MS Word
        </Button>

        <Card.Section>
          <Accordion defaultValue={["preview"]} multiple={true}>
            <Accordion.Item key="preview" value="preview">
              <Accordion.Control icon="🦜" disabled={!birdList.length}>
                Preview
              </Accordion.Control>
              <Accordion.Panel>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item key="raw" value="raw">
              <Accordion.Control icon="📋" disabled={!birdList.length}>
                Raw HTML Code
              </Accordion.Control>
              <Accordion.Panel>
                <Code block>{htmlContent}</Code>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item key="data" value="data">
              <Accordion.Control icon="📊" disabled={!birdList.length}>
                Bird Data Fun Facts
              </Accordion.Control>
              <Accordion.Panel>
                Number of birds: {birdList.length}
                <br />
                Longest common name: {longestCommonName}
                <br />
                Longest scientific name: {longestScientificName}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Card.Section>
      </Card>
    </Stack>
  );
}

export default App;
