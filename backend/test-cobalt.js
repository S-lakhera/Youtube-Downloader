
fetch("https://api.cobalt.tools/", {
  method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        vQuality: '1080'
    })
}).then(r => r.json()).then(data => console.log('Cobalt response:', data)).catch(console.error);
