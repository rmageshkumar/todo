export async function register(previousState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(email, password);
    const response = await fetch("http://localhost:3000/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data?.error) {
      return { ...previousState, error: data.error };
    }
    return { ...previousState, success: data };
  } catch (error) {
    return { ...previousState, error: "Something went wrong" };
  }
}

export async function login(previousState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(email, password);
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data?.error) {
      return { ...previousState, error: data.error };
    }
    return { ...previousState, success: data };
  } catch (error) {
    return { ...previousState, error: "Something went wrong" };
  }
}
