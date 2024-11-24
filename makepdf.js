(function() {
    // Check if jsPDF is already loaded
    if (typeof jsPDF === "undefined") {
        console.log("jsPDF not found. Loading dynamically...");
        
        // Dynamically load jsPDF from a CDN
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = function() {
            console.log("jsPDF library loaded successfully.");
            createPDF();  // Once jsPDF is loaded, run the function to generate the PDF
        };
        script.onerror = function() {
            console.error("Failed to load jsPDF library.");
        };
        document.head.appendChild(script);
    } else {
        // If jsPDF is already loaded, run the function directly
        createPDF();
    }

    function createPDF() {
        const { jsPDF } = window.jspdf;  // Access jsPDF from the global window object
        const pdf = new jsPDF('landscape', 'in', [7, 5]);  // Set page size to 7x5 inches (landscape)

        // Get all image elements from the page
        const images = Array.from(document.querySelectorAll('img'));

        // Set image dimensions for 7x5" page size (in inches)
        const pageWidth = 7;   // in inches
        const pageHeight = 5;  // in inches
        const margin = 0.1;    // margin from the edge of the page
        const maxWidth = pageWidth - 2 * margin;   // maximum width for the image
        const maxHeight = pageHeight - 2 * margin; // maximum height for the image

        // Function to scale images to fit within the page
        function scaleImage(img) {
            const imgWidth = img.naturalWidth || img.width;  // use natural width if available
            const imgHeight = img.naturalHeight || img.height;

            // Calculate scale ratio to fit image into maxWidth and maxHeight
            const scaleRatio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);

            const scaledWidth = imgWidth * scaleRatio;
            const scaledHeight = imgHeight * scaleRatio;

            return {
                width: scaledWidth,
                height: scaledHeight
            };
        }

        // Function to load the image and convert it to base64 (required by jsPDF addImage)
        function loadImage(imgSrc) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = imgSrc;
            });
        }

        // Loop through each image and add it to the PDF
        const imagePromises = images.map((img, index) => {
            return loadImage(img.src).then((loadedImg) => {
                const isOddPage = (index % 2 === 0);  // Odd pages are on the right (index 0, 2, 4, ...)
                const { width, height } = scaleImage(loadedImg);

                // Calculate X position based on whether it's an odd or even page
                const xPos = isOddPage ? pageWidth - width - margin : margin;

                // If it's not the first image, add a new page
                if (index > 0) {
                    pdf.addPage();
                }

                // Add the image to the current page (x, y position, width, height)
                pdf.addImage(loadedImg, 'JPEG', xPos, margin, width, height);
            });
        });

        // Wait for all images to be loaded and added to the PDF, then save it
        Promise.all(imagePromises)
            .then(() => {
                // Save the PDF after all images have been added
                pdf.save('ebook.pdf');
                alert('PDF has been generated successfully!');
            })
            .catch((error) => {
                console.error("Error loading images:", error);
                alert("Error loading images.");
            });
    }
})();