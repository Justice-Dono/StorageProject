export default {
  async fetch(request, env) {

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    // Upload endpoint
    if (request.method === "POST") {
      try {

        const formData = await request.formData();

        const files = formData.getAll("files");
        console.log("FILES:", files);
        console.log("COUNT:", files.length);
        if (!files || files.length === 0) {
          return new Response("No files uploaded", {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          });
        }

        const uploadedFiles = [];

        for (const file of files) {

          const originalName = file.name || "upload.bin";

          const dotIndex = originalName.lastIndexOf(".");

          const namePart =
            dotIndex !== -1
              ? originalName.slice(0, dotIndex)
              : originalName;

          const ext =
            dotIndex !== -1
              ? originalName.slice(dotIndex)
              : "";

          const randomSuffix = Math.random()
            .toString(36)
            .substring(2, 8);

          const safeName =
            `${namePart}-${randomSuffix}${ext}`;

          await env.MY_BUCKET.put(
            safeName,
            file.stream()
          );

          uploadedFiles.push(safeName);
        }

        return new Response(JSON.stringify({
          success: true,
          uploaded: uploadedFiles
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