// Note: API calls are proxied via the local Express server (/api/chat) to avoid CORS

async function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        } catch (err) {
            reject(err);
        }
    });
}

function formatOutput(text) {
    if (!text) return "";
    // Normalize newlines
    let out = String(text).replace(/\r\n?/g, "\n");

    // Remove leading asterisks at the very start of the entire text
    out = out.replace(/^\*+\s*/, "");

    // Convert start-of-line bullets (• or *) to Markdown hyphen bullets
    out = out.replace(/^\s*[•*]\s+/gm, "- ");

    // Convert inline bullets like " • " into new list lines
    out = out.replace(/\s*•\s+/g, "\n- ");

    // Ensure a blank line before list items for better Markdown rendering
    out = out.replace(/([^\n])\n- /g, "$1\n\n- ");

    return out.trim();
}

// Send a chat message to Gemini, optionally with an image or PDF File attachment
export async function runChat(userText, file, options = {}) {
    const { signal, history } = options;
    // Special-case PDFs: upload the file to server for parsing and summarization
    if (file && file.type === 'application/pdf') {
        const form = new FormData();
        form.append('file', file, file.name || 'document.pdf');
        form.append('text', userText || '');
        const res = await fetch('/api/summarize-pdf', {
            method: 'POST',
            body: form,
            signal,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'PDF summarize request failed');
        }
        const data = await res.json();
        return formatOutput(data?.text || '');
    }

    // Build payload for standard chat, optionally including image
    let imageDataUrl = null;
    if (file && file.type && file.type.startsWith('image/')) {
        imageDataUrl = await fileToDataURL(file);
    }

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText || '', imageDataUrl, history }),
        signal,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Chat request failed');
    }
    const data = await res.json();
    return formatOutput(data?.text || '');
}

// Generate image via server image endpoint; returns an object URL of the image
export async function runImageGeneration(prompt, options = {}) {
    const { signal, size } = options;
    const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt || '', size: size || '1024x1024' }),
        signal,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Image generation failed');
    }
    const data = await res.json();
    const b64 = data?.imageBase64;
    if (!b64) return null;
    // Convert base64 to Blob and object URL
    const byteChars = atob(b64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    return URL.createObjectURL(blob);
}