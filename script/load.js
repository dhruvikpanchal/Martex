export async function load(id, file, { executeScripts = false } = {}) {
  try {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`#${id} not found`);
    }

    const res = await fetch(file);

    if (!res.ok) {
      throw new Error(`${file} failed`);
    }

    element.innerHTML = await res.text();

    if (executeScripts) {
      element.querySelectorAll("script").forEach((inertScript) => {
        const activeScript = document.createElement("script");

        for (const attribute of inertScript.attributes) {
          activeScript.setAttribute(attribute.name, attribute.value);
        }

        activeScript.textContent = inertScript.textContent;
        inertScript.replaceWith(activeScript);
      });
    }

    // Scripts inserted through innerHTML do not run automatically. Recreate
    // them after the component is mounted so section-level behavior can start.
    element.querySelectorAll("script").forEach((inertScript) => {
      const activeScript = document.createElement("script");

      for (const attribute of inertScript.attributes) {
        activeScript.setAttribute(attribute.name, attribute.value);
      }

      activeScript.textContent = inertScript.textContent;
      inertScript.replaceWith(activeScript);
    });
  } catch (error) {
    console.error(error);
  }
}
