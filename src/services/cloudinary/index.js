const API_BASE_URL = "https://api.quierolapromocion.com";

// Never let an http:// URL leak into media elements. Any URL served from this
// domain must be https, otherwise browsers block it as mixed content when the
// page is loaded over HTTPS. Falls back to a protocol-relative URL so the
// request always uses the scheme of the page.
export function toSecureUrl(url) {
  if (!url || typeof url !== "string") return url;
  return url.replace(/^http:\/\//i, "https://");
}

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
    // Devuelve solo la URL del archivo subido, siempre con https
    return toSecureUrl(data.url);
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
    return toSecureUrl(data.url);
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
