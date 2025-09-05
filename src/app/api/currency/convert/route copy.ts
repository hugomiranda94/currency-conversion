export async function POST(request: Request) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response('Missing API Key', { status: 500 });
  }
  let body = await request.json();
  body = {
    to: Number(body.to),
    from: Number(body.from),
    ...body,
  };
  console.log('body', body);
  if (!body) {
    return new Response('Missing body', { status: 500 });
  }

  const route = `https://api.currencybeacon.com/v1/convert`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
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
