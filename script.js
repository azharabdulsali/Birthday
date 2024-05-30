document.addEventListener('DOMContentLoaded', (event) => {
    const flame = document.getElementById('flame');
    const happyBirthdaySong = document.getElementById('happyBirthdaySong');
    const wishButton = document.getElementById('wishButton');
    const popup = document.getElementById('popup');
    const closeButton = document.querySelector('.close-button');

    function blowOutCandle() {
        flame.style.display = 'none';
        happyBirthdaySong.play();
    }

    async function setupMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);

            function detectSound() {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                let average = sum / bufferLength;

                // If the average volume is above a certain threshold, blow out the candle
                if (average > 20) {
                    blowOutCandle();
                }

                requestAnimationFrame(detectSound);
            }

            detectSound();
        } catch (err) {
            console.error('Error accessing microphone: ', err);
        }
    }

    wishButton.addEventListener('click', () => {
        popup.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    setupMicrophone();
});
