const API_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api`;

interface PostSubscribeResponse {
  sessionId: string;
}

export async function postSubscribe(): Promise<PostSubscribeResponse> {
  const response = await fetch(`${API_URL}/subscribe`, {
    method: 'POST',
  });

  const json: PostSubscribeResponse = await response.json();

  return json;
}
