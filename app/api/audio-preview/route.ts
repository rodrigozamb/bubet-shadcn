const ALLOWED_AUDIO_HOST = "bubet-bucket.s3.sa-east-1.amazonaws.com";

export async function GET(request: Request) {
  const audioUrl = new URL(request.url).searchParams.get("url");

  if (!audioUrl) {
    return new Response("URL do áudio não informada.", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(audioUrl);
  } catch {
    return new Response("URL do áudio inválida.", { status: 400 });
  }

  if (targetUrl.protocol !== "https:" || targetUrl.hostname !== ALLOWED_AUDIO_HOST) {
    return new Response("Origem do áudio não permitida.", { status: 403 });
  }

  try {
    const response = await fetch(targetUrl, { cache: "no-store" });

    if (!response.ok || !response.body) {
      return new Response("Não foi possível carregar o áudio.", {
        status: response.status || 502,
      });
    }

    const headers = new Headers({
      "Cache-Control": "private, no-store",
      "Content-Type": response.headers.get("content-type") ?? "audio/mpeg",
    });
    const contentLength = response.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new Response(response.body, { headers });
  } catch {
    return new Response("Não foi possível carregar o áudio.", { status: 502 });
  }
}
