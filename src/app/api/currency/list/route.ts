export async function GET() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response('Missing API Key', { status: 500 });
  }
  const route = `https://api.currencybeacon.com/v1/currencies`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };
  const response = await fetch(route, options);
  if (response.status !== 200) {
    return new Response('Failed fetch', { status: 500 });
  }
  const data = await response.json();
  if (!data) return new Response('Failed fetch', { status: 500 });
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
