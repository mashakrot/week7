document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault()
    const formData = new FormData(this)
    formData.append("description", document.getElementById("desc").value)

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        })
        if (!response.ok) {
            throw new Error("Upload failed")
        }
        const responseData = await response.json()
    } catch(error) {
        console.log("Error: ", error)
    } finally {
        fetchImageData()
    }
})

const fetchImageData = async() => {
    try {
        const response = await fetch("/api/images")
        if(!response.ok) {
            throw new Error("Failed to fetch images")
        }
        const imageData = await response.json()
        displayImages(imageData)

    } catch(error) {
        console.error("Error", error)
    }
}

const displayImages = (imageData) => {
    const imageGrid = document.getElementById("imageGrid")
    for(let i=0; i < imageData.length; i++) {
        const imageItem = document.createElement("div")
        imageItem.classList.add("imageItem")

        const img = document.createElement("img")
        img.src = `http://localhost:8000/${imageData[i].path}`

        const description = document.createElement("p")
        description.textContent = imageData[i].description

        imageItem.appendChild(img)
        imageItem.appendChild(description)
        imageGrid.appendChild(imageItem)
    }
}

const listOfUser = async () => {
    const token = localStorage.getItem("auth_token")

    if(!token) return

    const response = await fetch("/user/list", {
        method: "GET",
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        document.getElementById("error").textContent = "Error while fetching users."
    } else {
        const data = await response.json()
        let users = ''
        data.map(user => {
            users += `<li>Email ${user.email}, ID: ${user._id}</li>`
        })
        document.getElementById("user-list").innerHTML = users


    }

}

fetchImageData()
listOfUser()

const logout = () => {
    localStorage.removeItem("auth_token")
    window.location.href("test.html")
}

document.getElementById("logout").addEventListener("click", logout)

