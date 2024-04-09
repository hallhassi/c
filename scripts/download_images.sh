#!/bin/bash

# Read each line of the file containing image URLs
while IFS= read -r url; do
    # Use curl to download the image
    curl -O "$url"
done < urls.txt
