export default {
  async fetch(request, env) {
    // 1. הגדרת כותרות (CORS) כדי ש-Lovable יוכל לגשת לנתונים בבטחה
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // מאפשר לכל דומיין לגשת (מעולה לשלב הפיתוח)
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. טיפול בבקשות OPTIONS (בדיקת אבטחה של הדפדפן)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 3. שאילתת SQL לשליפת המאמרים (מהחדש לישן)
      // שים לב: המילה DB כאן חייבת להיות זהה ל-Binding ב-wrangler.toml
      const { results } = await env.DB.prepare(
        "SELECT website_title, target_slug, meta_description, cover_image_url, main_category, website_content_html, created_at FROM aiaa_content_hub ORDER BY created_at DESC"
      ).all();

      // 4. החזרת התוצאות כ-JSON יפה
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};