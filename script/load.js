export async function load(id, file, { executeScripts = true } = {}) {
  try {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`#${id} not found`);
    }

    const res = await fetch(file);

    if (!res.ok) {
      throw new Error(`${file} failed (status ${res.status})`);
    }

    element.innerHTML = await res.text();

    if (executeScripts) {
      // Scripts inserted through innerHTML do not run automatically. Recreate
      // them once after the component is mounted so component-level behavior can start.
      element.querySelectorAll("script").forEach((inertScript) => {
        try {
          // Skip redundant Tailwind CDN or standalone config snippets to avoid runtime conflicts
          if (inertScript.src && inertScript.src.includes("cdn.tailwindcss.com")) {
            return;
          }
          if (
            !inertScript.src &&
            inertScript.textContent &&
            inertScript.textContent.includes("tailwind.config")
          ) {
            return;
          }

          const activeScript = document.createElement("script");

          for (const attribute of inertScript.attributes) {
            activeScript.setAttribute(attribute.name, attribute.value);
          }

          activeScript.textContent = inertScript.textContent;
          inertScript.replaceWith(activeScript);
        } catch (scriptErr) {
          console.warn(`Error executing script from ${file}:`, scriptErr);
        }
      });
    }
  } catch (error) {
    console.error(`Failed to load #${id} from ${file}:`, error);
  }
}
