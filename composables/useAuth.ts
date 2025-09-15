import { ref, watch, readonly, computed } from 'vue';

/**
 * Custom composable to get user organization memberships and roles from JWT template
 * @returns {object} Object containing organizations, loading state, and error, along with helper functions
 */
export function useUserOrganizationsAndRoles() {
  const { session, isLoaded } = useSession();
  const organizations = ref<any[]>([]); // To store parsed organization data
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchOrganizationsAndRoles = async () => {
    console.log("useUserOrganizationsAndRoles: fetchOrganizationsAndRoles starting.");
    try {
      loading.value = true;
      error.value = null;
      if (!session.value) {
        console.log("useUserOrganizationsAndRoles: Session not available.");
        throw new Error("Session not available.");
      }

      // Get the JWT token with the 'organization_roles' template
      // This template must be configured in the Clerk Dashboard to include organization information.
      const token = await session.value.getToken({ template: 'organization_roles' });
      console.log("useUserOrganizationsAndRoles: Token obtained:", token ? "Yes" : "No");

      if (token) {
        const decoded = decodeJWTToken(token);
        // Assuming the JWT template includes an 'organizations' claim
        // Example structure: { organizations: [{ id: 'org_xxxx', name: 'Host Org', role: 'admin', type: 'host' }] }
        organizations.value = decoded?.organizations || [];
        console.log("useUserOrganizationsAndRoles: Organizations decoded:", organizations.value);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to get organizations and roles";
      console.error("useUserOrganizationsAndRoles: Error fetching organizations and roles:", err);
    } finally {
      loading.value = false;
    }
  };

  watch(isLoaded, (loaded) => {
    console.log("useUserOrganizationsAndRoles: isLoaded changed:", loaded);
    if (loaded) {
      fetchOrganizationsAndRoles();
    }
  }, { immediate: true });

  // Helper functions
  const isHostAdmin = computed(() =>
    organizations.value.some(org => org.type === 'host' && org.role === 'admin')
  );

  const isAttendeeAdmin = computed(() =>
    organizations.value.some(org => org.type === 'attendee' && org.role === 'admin')
  );

  const isHostMember = computed(() =>
    organizations.value.some(org => org.type === 'host' && org.role === 'member')
  );

  const isAttendeeMember = computed(() =>
    organizations.value.some(org => org.type === 'attendee' && org.role === 'member')
  );

  const isHost = computed(() => isHostAdmin.value || isHostMember.value);
  const isAttendee = computed(() => isAttendeeAdmin.value || isAttendeeMember.value);
  const isBothHostAndAttendee = computed(() => isHost.value && isAttendee.value);

  return {
    organizations: readonly(organizations),
    loading: readonly(loading),
    error: readonly(error),
    isHostAdmin,
    isAttendeeAdmin,
    isHostMember,
    isAttendeeMember,
    isHost,
    isAttendee,
    isBothHostAndAttendee,
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
    console.error("decodeJWTToken: Error decoding JWT token:", error);
    return null;
  }
}