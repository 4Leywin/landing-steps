import { setDocument } from "../src/services/firebase/content";
import { CONTENT } from "../src/constants";

// Seed a single fixed document (collection: 'content', id: 'site_content')
async function seed() {
  try {
    const id = "site_content";
    await setDocument("content", id, CONTENT);
    console.log("Seeded content at content/" + id);
  } catch (error) {
    console.error("Error seeding content:", error);
  }
}

seed();
