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

// Send a chat message to Gemini, optionally with an image File attachment
export async function runChat(userText, file, options = {}) {
    const { signal } = options;
    // Build payload for server
    let imageDataUrl = null;
    if (file && file.type && file.type.startsWith("image/")) {
        imageDataUrl = await fileToDataURL(file);
    }

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText || '', imageDataUrl }),
        signal,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Chat request failed');
    }
    const data = await res.json();
    return formatOutput(data?.text || '');
}