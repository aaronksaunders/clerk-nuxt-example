<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage users and system settings</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">User Management</h3>
          <p class="text-gray-600 mb-4">
            Create, edit, and manage user accounts
          </p>
          <NuxtLink to="/admin/users">
            <Button>Manage Users</Button>
          </NuxtLink>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">System Settings</h3>
          <p class="text-gray-600 mb-4">Configure application settings</p>
          <Button variant="outline">Settings</Button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Analytics</h3>
          <p class="text-gray-600 mb-4">View usage statistics and reports</p>
          <Button variant="outline">View Analytics</Button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';
definePageMeta({
  
});
</script>
