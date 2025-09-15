export async function onRequest(context) {
    // Calculate countdown
    const today = new Date();
    const usaDate = new Date(
        today.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    const currentYear = usaDate.getFullYear();
    const targetDate = new Date(`${currentYear}-09-21T00:00:00`);

    if (usaDate > targetDate) {
        targetDate.setFullYear(currentYear + 1);
    }

    const timeDiff = targetDate.getTime() - usaDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const isToday = usaDate.getMonth() === 8 && usaDate.getDate() === 21;
    const description = isToday
        ? "Today is September 21st - the day has arrived!"
        : `${daysLeft} days until September 21st - the day humanity fears the most`;

    // Get the original response
    const response = await context.next();

    // Only modify HTML responses
    if (response.headers.get("content-type")?.includes("text/html")) {
        let html = await response.text();

        // Replace both description meta tags with more flexible regex
        html = html.replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi,
            `<meta name="description" content="${description}">`
        );

        html = html.replace(
            /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi,
            `<meta property="og:description" content="${description}">`
        );

        return new Response(html, {
            headers: response.headers,
        });
    }

    return response;
}
