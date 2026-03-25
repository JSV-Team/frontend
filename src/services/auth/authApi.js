import apiConfig from "../../../config/apiConfig";
const BASE_URL = `${apiConfig.BASE_API}/auth`;

export async function loginApi(payload) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  return data;
}
