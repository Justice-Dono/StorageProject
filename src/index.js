export default {
  async fetch(request, env) {

    if (request.method === "POST") {

      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return new Response("No file uploaded", {
          status: 400
        });
      }

      await env.MY_BUCKET.put(
        file.name,
        file.stream()
      );

      return new Response("Upload successful");
    }

    return new Response("Worker running");
  }
}