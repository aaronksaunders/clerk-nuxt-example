import { ref, watch, readonly } from 'vue';

/**
 * Custom composable to get user role from JWT template
 * @param {string} templateName - The name of the JWT template
 * @returns {object} Object containing role, loading state, and error
 */
export function useUserRole(templateName: string) {
  const { session, isLoaded } = useSession();
  const role = ref<string | undefined>(undefined);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchRole = async () => {
    console.log("useUserRole: fetchRole starting for template:", templateName); // New log
    try {
      loading.value = true;
      error.value = null;
      if (!session.value) {
        console.log("useUserRole: Session not available."); // New log
        throw new Error("Session not available.");
      }
      const token = await session.value.getToken({ template: templateName });
      console.log("useUserRole: Token obtained:", token ? "Yes" : "No"); // New log
      if (token) {
        const decoded = decodeJWTToken(token);
        role.value = decoded?.role;
        console.log("useUserRole: Role decoded:", decoded?.role); // New log
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to get role";
      console.error("useUserRole: Error fetching role:", err); // Enhanced log
    } finally {
      loading.value = false;
    }
  };

  watch(isLoaded, (loaded) => {
    console.log("useUserRole: isLoaded changed:", loaded); // New log
    if (loaded) {
      fetchRole();
    }
  }, { immediate: true });

  return {
    role: readonly(role),
    loading: readonly(loading),
    error: readonly(error),
  };
}

/**
 * Decode JWT token to extract claims
 * @param {string} token - The JWT token
 * @returns {any} The decoded claims
 */
function decodeJWTToken(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("useUserRole: Error decoding JWT token:", error);
    return null;
  }
}
