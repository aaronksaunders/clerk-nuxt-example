<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">User Management</h1>
          <p class="text-gray-600 mt-2">Manage user accounts and roles</p>
        </div>
        <NuxtLink to="/admin/users/new">
          <Button>Add New User</Button>
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
        ></div>
        <p class="mt-2">Loading users...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">Error loading users: {{ error }}</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.emailAddresses[0]?.emailAddress }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleBadgeClass(user.publicMetadata?.role)"
                >
                  {{ user.publicMetadata?.role || "No role" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    user.bannedAt
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  "
                >
                  {{ user.bannedAt ? "Banned" : "Active" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <NuxtLink :to="`/admin/users/${user.id}/edit`">
                    <Button variant="outline" size="sm">Edit</Button>
                  </NuxtLink>
                  <Button
                    variant="outline"
                    size="sm"
                    :class="user.bannedAt ? 'text-green-600' : 'text-red-600'"
                    @click="toggleBan(user)"
                  >
                    {{ user.bannedAt ? "Unban" : "Ban" }}
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';
import { ref, watch } from 'vue';

definePageMeta({
  // Middleware is handled globally, so this is empty
});

const { session, isLoaded } = useSession(); // Changed from useAuth()
const users = ref([]);
const loading = ref(true);
const error = ref(null);

// This function now requires a token to be passed to it.
const fetchUsers = async (token) => {
  console.log("fetchUsers: Starting fetch with token:", token); // New log
  try {
    loading.value = true;
    error.value = null;
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    const response = await $fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("fetchUsers: API response received:", response); // New log
    users.value = response.data || [];
  } catch (err) {
    error.value = err.message || "Failed to fetch users";
    console.error("fetchUsers: Error fetching users:", err); // Enhanced log
  } finally {
    loading.value = false;
  }
};

// This function now gets the token itself and passes it to fetchUsers.
const toggleBan = async (user) => {
  console.log("toggleBan: Toggling ban for user:", user.id); // New log
  try {
    if (!session.value) throw new Error("Session not available.");
    const token = await session.value.getToken();
    console.log("toggleBan: Token obtained:", token ? "Yes" : "No"); // New log
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    await $fetch(`/api/users/${user.id}/ban`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("toggleBan: Ban toggled successfully. Refreshing users."); // New log
    // Refresh users list by passing the token again
    await fetchUsers(token);
  } catch (err) {
    console.error("toggleBan: Error toggling ban:", err); // Enhanced log
  }
};

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: "bg-purple-100 text-purple-800",
    host: "bg-blue-100 text-blue-800",
    attendee: "bg-green-100 text-green-800",
    both: "bg-yellow-100 text-yellow-800",
  };
  return classes[role] || "bg-gray-100 text-gray-800";
};

// This watcher waits for the session to be loaded.
watch(isLoaded, async (loaded) => {
  console.log("AdminUsers Page: Session isLoaded changed:", loaded); // Enhanced log
  if (loaded) {
    try {
      if (!session.value) {
        console.log("AdminUsers Page: Session value is null after load."); // New log
        throw new Error("Session not available after load.");
      }
      const token = await session.value.getToken();
      console.log("AdminUsers Page: Token obtained:", token ? "Yes" : "No"); // New log
      if (token) {
        await fetchUsers(token);
      }
    } catch (err) {
      error.value = err.message || "An error occurred during token retrieval.";
      console.error("AdminUsers Page: Error in watcher:", err); // Enhanced log
    }
  }
}, { immediate: true });
</script>