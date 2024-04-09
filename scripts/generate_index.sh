#!/bin/bash

DIRECTORY="./"  # Replace this with the path to your directory
OUTPUT_FILE="index.html"

# Check if the directory exists
if [ ! -d "$DIRECTORY" ]; then
    echo "Error: Directory does not exist."
    exit 1
fi

# Create the HTML file
cat <<EOF > "$OUTPUT_FILE"
<!DOCTYPE html>
<html>
<head>
<title>Index of $DIRECTORY</title>
</head>
<body>
<h1>Index of $DIRECTORY</h1>
<ul>
EOF

# Generate list of files with links
for file in $(ls -v "$DIRECTORY"); do
    filename=$(basename "$file")
    echo "<li><a href=\"$filename\"><img src=\"$filename\"></a></li>" >> "$OUTPUT_FILE"
done

# Close HTML tags
cat <<EOF >> "$OUTPUT_FILE"
</ul>
</body>
</html>
EOF

echo "Index file generated: $OUTPUT_FILE"
