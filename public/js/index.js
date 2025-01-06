const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login.html";
    } else {
      fetch("/private", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Unauthorized");
          }
        })
        .then((data) => {
          document.getElementById("message").innerText = data.message;
        })
        .catch(() => {
          alert("Unauthorized access. Redirecting to login.");
          localStorage.removeItem("token");
          window.location.href = "/login.html";
        });
    }

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("token");
      alert("Logged out successfully!");
      window.location.href = "/login.html";
    });