export default {
  async fetch(request, env) {

    // CORS preflight (important for browser uploads)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
          return new Response("No file uploaded", {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          });
        }

        // 🔥 IMPORTANT: prevent empty or duplicate names
        const safeName = `${Date.now()}-${file.name || "upload.bin"}`;

        await env.MY_BUCKET.put(
          safeName,
          file.stream()
        );

        return new Response(JSON.stringify({
          success: true,
          name: safeName,
          size: file.size
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err) {
        console.log("UPLOAD ERROR:", err);

        return new Response("Worker error", {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }

    return new Response("Worker running", {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};