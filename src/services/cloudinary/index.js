const API_BASE_URL = "https://api.quierolapromocion.com";

export async function uploadImageFile(file, folder) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error uploading image: ${response.statusText}`);
    }
    const data = await response.json();
    // Devuelve la URL y los metadatos relevantes
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function uploadVideoFile(file, folder) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error uploading video: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}

// Obtener un archivo por nombre
export async function getFile(filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${filename}`);
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

// Eliminar un archivo por nombre
export async function deleteFile(filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${filename}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error deleting file: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
