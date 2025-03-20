const CONTRACT_ADDRESS = "0xEA5C91604D7713C0344364D3c2aB0bA9B71c750D"; // Replace with your deployed contract address
const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let contract;
let userAddress;

// Update ABI with the latest from Remix (same as in doodle.js)
const ABI = [{"type":"event","name":"NewRound","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"prompt","type":"string","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"event","name":"NewDrawing","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"artist","type":"address","components":null,"internalType":null,"indexed":false},{"name":"imageURL","type":"string","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"event","name":"NewVote","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"artist","type":"address","components":null,"internalType":null,"indexed":false},{"name":"voter","type":"address","components":null,"internalType":null,"indexed":false},{"name":"score","type":"uint256","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"event","name":"RoundEnded","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"winner","type":"address","components":null,"internalType":null,"indexed":false},{"name":"reward","type":"uint256","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"function","name":"addPrompt","stateMutability":"nonpayable","inputs":[{"name":"_prompt","type":"string","components":null,"internalType":null}],"outputs":[]},{"type":"constructor","stateMutability":"nonpayable","inputs":[]},{"type":"function","name":"submitDrawing","stateMutability":"payable","inputs":[{"name":"imageURL","type":"string","components":null,"internalType":null}],"outputs":[]},{"type":"function","name":"voteOnDrawing","stateMutability":"nonpayable","inputs":[{"name":"artist","type":"address","components":null,"internalType":null},{"name":"score","type":"uint8","components":null,"internalType":null}],"outputs":[]},{"type":"function","name":"getDrawingsForRound","stateMutability":"view","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"address[]","components":null,"internalType":null}]},{"type":"function","name":"getDrawingDetails","stateMutability":"view","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null},{"name":"artist","type":"address","components":null,"internalType":null}],"outputs":[{"name":"","type":"string","components":null,"internalType":null},{"name":"","type":"string","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"getCurrentPrompt","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"string","components":null,"internalType":null}]},{"type":"function","name":"getRoundInfo","stateMutability":"view","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"string","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null},{"name":"","type":"bool","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"withdraw","stateMutability":"nonpayable","inputs":[],"outputs":[]},{"type":"function","name":"initializeRound","stateMutability":"nonpayable","inputs":[],"outputs":[]},{"type":"function","name":"owner","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"address","components":null,"internalType":null}]},{"type":"function","name":"currentRound","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"minEntryFee","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"rounds","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"tuple","components":[{"name":"prompt","type":"string","components":null,"internalType":null},{"name":"startTime","type":"uint256","components":null,"internalType":null},{"name":"endTime","type":"uint256","components":null,"internalType":null},{"name":"active","type":"bool","components":null,"internalType":null},{"name":"entryFee","type":"uint256","components":null,"internalType":null}],"internalType":null}]},{"type":"function","name":"drawings","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null},{"name":"arg1","type":"address","components":null,"internalType":null}],"outputs":[{"name":"","type":"tuple","components":[{"name":"artist","type":"address","components":null,"internalType":null},{"name":"imageURL","type":"string","components":null,"internalType":null},{"name":"prompt","type":"string","components":null,"internalType":null},{"name":"totalScore","type":"uint256","components":null,"internalType":null},{"name":"voterCount","type":"uint256","components":null,"internalType":null},{"name":"exists","type":"bool","components":null,"internalType":null},{"name":"submissionTime","type":"uint256","components":null,"internalType":null}],"internalType":null}]},{"type":"function","name":"roundParticipants","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null},{"name":"arg1","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"address","components":null,"internalType":null}]},{"type":"function","name":"hasVoted","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null},{"name":"arg1","type":"address","components":null,"internalType":null},{"name":"arg2","type":"address","components":null,"internalType":null}],"outputs":[{"name":"","type":"bool","components":null,"internalType":null}]},{"type":"function","name":"promptCount","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"prompts","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"string","components":null,"internalType":null}]}];

async function initContract() {
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    userAddress = await signer.getAddress();
    console.log("Contract initialized with user:", userAddress);
    loadPromptAndFee();
}

async function loadPromptAndFee() {
    try {
        const currentRound = await contract.currentRound();
        const roundInfo = await contract.getRoundInfo(currentRound);
        const prompt = roundInfo[0];
        const active = roundInfo[3];
        const entryFee = ethers.utils.formatEther(roundInfo[4]);
        
        if (active) {
            document.getElementById('currentPrompt').textContent = `Current Prompt: ${prompt}`;
            document.getElementById('submitDrawing').textContent = `Submit Drawing (${entryFee} ETH)`;
        } else {
            document.getElementById('currentPrompt').textContent = `No active round`;
            document.getElementById('submitDrawing').textContent = `Submit Drawing (No active round)`;
            document.getElementById('submitDrawing').disabled = true;
        }
    } catch (error) {
        console.error("Error loading prompt and fee:", error);
        document.getElementById('currentPrompt').textContent = `No active round`;
        document.getElementById('submitDrawing').textContent = `Submit Drawing (Error)`;
        document.getElementById('submitDrawing').disabled = true;
    }
}

// Canvas drawing logic
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Adjust canvas dimensions for high-DPI displays and responsive size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Set the display size to match the container (CSS pixels)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Set the actual canvas size (accounting for device pixel ratio)
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;

    // Scale the context to match the device pixel ratio
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Set canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Reapply drawing properties after resizing
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8; // Increased for thicker brush stroke
    ctx.lineCap = 'round';
}

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch support for mobile devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Adjust coordinates for the canvas's position and scaling
    const x = (e.clientX - rect.left) * (canvas.width / devicePixelRatio) / rect.width;
    const y = (e.clientY - rect.top) * (canvas.height / devicePixelRatio) / rect.height;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

document.getElementById('clearCanvas').addEventListener('click', () => {
    // Clear the entire canvas using the scaled dimensions
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
});

// Submit drawing to IPFS and smart contract
document.getElementById('submitDrawing').addEventListener('click', async () => {
    try {
        // Convert canvas to a blob
        const dataUrl = canvas.toDataURL('image/png');
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        // Upload to Pinata
        const formData = new FormData();
        formData.append('file', blob, 'drawing.png');

        const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0MWYzOTQ0OC1hZDZmLTQ1ZWYtOTkwYS0zM2Y4ZjBmNzdhZWIiLCJlbWFpbCI6ImJyb2R5LmVkZHk4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyOWUxNjMwMmJkNmNhYTc0MmUzYSIsInNjb3BlZEtleVNlY3JldCI6IjY0OThlMTI5YjE3YjI3OTE2NDQ2ZjYzNTQ4ZWFmNGUxODVlZDg2MTY2ZDhiNWI0ZmI3NDMwMjI1ZDk3NDE4OGUiLCJleHAiOjE3NzM5NzU4MTd9.mqCooio8rEEGh_XSaNBq4vw8anJF6K271kMtD1iG58I`, // Replace with your Pinata JWT
                'Content-Type': 'multipart/form-data'
            }
        });

        const ipfsHash = pinataResponse.data.IpfsHash;
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        // Submit to smart contract
        const roundInfo = await contract.getRoundInfo(await contract.currentRound());
        const entryFee = roundInfo[4];
        const tx = await contract.submitDrawing(imageUrl, { value: entryFee });
        await tx.wait();

        showNotification('Success', 'Drawing submitted!');
        setTimeout(() => window.location.href = 'web3.html', 2000); // Redirect back to main page
    } catch (error) {
        console.error('Error submitting drawing:', error);
        showNotification('Error', 'Failed to submit drawing: ' + error.message);
    }
});

function showNotification(title, message) {
    const notification = document.getElementById('notification');
    document.getElementById('notificationTitle').textContent = title;
    document.getElementById('notificationMessage').textContent = message;
    notification.classList.remove('hidden');
    notification.classList.remove('translate-y-full');
    setTimeout(() => {
        notification.classList.add('translate-y-full');
        setTimeout(() => notification.classList.add('hidden'), 300);
    }, 5000);
    document.getElementById('closeNotification').onclick = () => {
        notification.classList.add('translate-y-full');
        setTimeout(() => notification.classList.add('hidden'), 300);
    };
}

// Initialize contract on page load with auto-connect
async function autoConnect() {
    if (!window.ethereum) {
        showNotification('Error', 'MetaMask is not installed!');
        setTimeout(() => window.location.href = 'web3.html', 2000);
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await initContract();
        } else {
            showNotification('Error', 'Please connect your wallet on the main page.');
            setTimeout(() => window.location.href = 'web3.html', 2000);
        }
    } catch (error) {
        showNotification('Error', 'Failed to auto-connect: ' + error.message);
        setTimeout(() => window.location.href = 'web3.html', 2000);
    }
}

// Listen for account changes in MetaMask
if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
            await initContract();
            showNotification('Success', 'Wallet account changed!');
        } else {
            showNotification('Error', 'Wallet disconnected. Please reconnect on the main page.');
            setTimeout(() => window.location.href = 'web3.html', 2000);
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload(); // Reload the page if the network changes
    });
}

// Call autoConnect on page load
autoConnect();