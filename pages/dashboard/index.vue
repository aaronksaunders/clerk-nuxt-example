<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Attendee Dashboard</h1>
        <p class="text-gray-600 mt-2">Welcome to your personal dashboard</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">My Events</h3>
          <p class="text-gray-600 mb-4">View and manage your events</p>
          <Button variant="outline">View Events</Button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Profile</h3>
          <p class="text-gray-600 mb-4">Update your profile information</p>
          <Button variant="outline">Edit Profile</Button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Settings</h3>
          <p class="text-gray-600 mb-4">Manage your account settings</p>
          <Button variant="outline">Settings</Button>
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
