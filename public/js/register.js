const initializeRegister = () => {
    document.getElementById("registerForm").addEventListener("submit", (event) => {
        fetchData(event)
    })
}

const fetchData = async (event) => {
    event.preventDefault()

    const formData = {
        email: event.target.email.value,
        password: event.target.password.value,
    }

    try {
        const response = await fetch("/api/user/register",  {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            if(response.status == 403) {
                document.getElementById("error").innerText = "Error when trying to register. Email already in use. Please try again."
            } else {   
                document.getElementById("error").innerText = "Error when trying to register. Please try again."
            }
        } else {
            alert("Registration successful!");
            window.location.href = "/login.html"
        }

    } catch (error) {
        console.log(`Error while trying to register: ${error.message}`)
    }

}

initializeRegister()