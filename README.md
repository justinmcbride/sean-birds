# Sean's Bird List Sorter

A web application that helps organize bird observation lists for easy use in Microsoft Word documents.

## What it does

This tool takes a comma-separated list of birds with their scientific names and:

1. **Parses** the bird names and scientific names from your input
2. **Sorts** them alphabetically by scientific name
3. **Formats** them with proper italicization for scientific names
4. **Generates** HTML output that's compatible with Microsoft Word

## How to use

1. Enter your bird list in the input field (format: "Common Name (Scientific Name)")
2. The tool automatically sorts and formats your list
3. Preview the formatted output in the Preview tab
4. Click "Copy to Clipboard for MS Word" to copy the formatted HTML
5. Paste directly into Microsoft Word - the scientific names will be properly italicized

## Example

**Input:**
```
house finch (Carpodacus mexicanus), Anna's hummingbird (Calypte anna), red-tailed hawk (Buteo lineatus)
```

**Output:**
```
Anna's hummingbird (Calypte anna), red-tailed hawk (Buteo lineatus), house finch (Carpodacus mexicanus)
```

Perfect for bird watchers, researchers, and anyone who needs to create properly formatted bird lists for reports or documentation.
