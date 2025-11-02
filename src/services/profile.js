export async function getProfile(baseUrl, token) {
  const url = `${baseUrl.replace(/\/$/, '')}/api/profile`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Failed to load profile');
  }
  return res.json();
}

export async function saveProfile(baseUrl, token, data, hasExisting) {
  const url = `${baseUrl.replace(/\/$/, '')}/api/profile`;
  const method = hasExisting ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = 'Failed to save profile';
    try {
      const j = await res.json();
      if (j?.error) {
        msg = j.error;
      }
    } catch {
      console.log("something went wrong")
    }
    throw new Error(msg);
  }
  return res.json();
}

