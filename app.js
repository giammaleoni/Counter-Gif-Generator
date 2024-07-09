document.getElementById('generateButton').addEventListener('click', function () {
    const numberInput = document.getElementById('numberInput').value;
    const bgColorInput = document.getElementById('bgColorInput').value;
    const numColorInput = document.getElementById('numColorInput').value;
    const durationInput = document.getElementById('durationInput').value;
    const fontInput = document.getElementById('fontInput').value;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const result = document.getElementById('result');
    const downloadInstructions = document.querySelector('.download-instructions');

    if (numberInput === '') {
        alert('Please enter a number');
        return;
    }

    const number = numberInput.toString();
    const bgColor = bgColorInput || '#ffffff';
    const numColor = numColorInput || '#000000';
    const duration = parseFloat(durationInput) || 2;
    const frameRate = 30; // frames per second
    const totalFrames = Math.floor(duration * frameRate);
    const digitWidth = 30; // Width of each digit
    const digitHeight = 50; // Height of each digit for scrolling

    // Resize canvas based on number of digits
    canvas.width = number.length * digitWidth;
    canvas.height = digitHeight;

    // Clear previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Initialize GIF
    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        repeat: -1 // Play once
    });

    // Function to draw each frame
    function drawFrame(frame) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${digitHeight}px ${fontInput}`;
        ctx.fillStyle = numColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const digits = number.split('');

        digits.forEach((digit, index) => {
            const maxDigit = parseInt(digit, 10);
            const currentFrame = Math.min(frame, totalFrames - 1);
            const progress = currentFrame / (totalFrames - 1);
            const offsetY = progress * (digitHeight * maxDigit);

            for (let i = 0; i <= maxDigit; i++) {
                const yPosition = digitHeight / 2 - offsetY + (i * digitHeight);
                if (yPosition > digitHeight || yPosition < -digitHeight) continue;
                ctx.fillText(i.toString(), (index + 0.5) * digitWidth, yPosition);
            }
        });
    }

    // Add frames to the GIF
    for (let frame = 0; frame < totalFrames; frame++) {
        drawFrame(frame);
        gif.addFrame(ctx, { copy: true, delay: 1000 / frameRate });
    }

    // Add the final frame with a longer delay
    drawFrame(totalFrames - 1);
    gif.addFrame(ctx, { copy: true, delay: 1000 }); // 1 second delay on the last frame

    // Render the GIF
    gif.on('finished', function (blob) {
        const url = URL.createObjectURL(blob);
        result.src = url;
        result.style.display = 'block';
        downloadInstructions.style.display = 'block';
    });

    gif.render();
});