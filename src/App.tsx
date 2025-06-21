import "./App.css";

import { useEffect, useRef, useState } from "react";

import {
  Button,
  Code,
  Divider,
  Group,
  Paper,
  Stack,
  Tabs,
  Textarea,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BirdIcon, CopyIcon } from "@phosphor-icons/react";

import { convertToHTML, sortBirdList, type Bird } from "./lib/utils";
import { SAMPLE_DATA } from "./sample-data";

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
        color: "grape",
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
    <Stack align="top" gap="xl">
      <Group justify="center" align="center">
        <BirdIcon size={32} />
        <Title order={1}>Sean's Bird List Sorter</Title>
        <BirdIcon size={32} />
      </Group>

      <Group align="stretch" justify="center" gap="xl" grow>
        <Paper shadow="md" p="lg" radius="md" withBorder>
          <Paper withBorder={false} p="lg" mb="md">
            <Title order={3} td="underline">
              Input
            </Title>
          </Paper>
          <Divider mb="md" />
          <Stack gap="md">
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
            <Button variant="default" onClick={() => setText(SAMPLE_DATA)}>
              Sample Birds
            </Button>
          </Stack>
        </Paper>

        <Paper shadow="md" p="lg" radius="md" withBorder>
          <Paper withBorder={false} p="lg" mb="md">
            <Title order={3} td="underline">
              Output
            </Title>
          </Paper>

          <Divider mb="md" />

          <Button
            mt="md"
            mb="md"
            radius="md"
            onClick={copyToClipboard}
            disabled={!htmlContent}
            leftSection={<CopyIcon size={24} />}
          >
            Copy to Clipboard for MS Word
          </Button>

          <Divider mb="md" />

          <Tabs defaultValue="preview">
            <Tabs.List>
              <Tabs.Tab
                value="preview"
                leftSection="🦜"
                disabled={!birdList.length}
              >
                Preview
              </Tabs.Tab>
              <Tabs.Tab
                value="raw"
                leftSection="📋"
                disabled={!birdList.length}
              >
                Raw HTML Code
              </Tabs.Tab>
              <Tabs.Tab
                value="data"
                leftSection="📊"
                disabled={!birdList.length}
              >
                Bird Data Fun Facts
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="preview">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </Tabs.Panel>

            <Tabs.Panel value="raw">
              <Code block>{htmlContent}</Code>
            </Tabs.Panel>

            <Tabs.Panel value="data">
              Number of birds: {birdList.length}
              <br />
              Longest common name: {longestCommonName}
              <br />
              Longest scientific name: {longestScientificName}
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Group>
    </Stack>
  );
}

export default App;
