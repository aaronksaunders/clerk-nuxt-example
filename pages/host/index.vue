<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Host Dashboard</h1>
        <p class="text-gray-600 mt-2">
          Manage your events and hosting activities
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Create Event</h3>
          <p class="text-gray-600 mb-4">Create a new event for attendees</p>
          <Button>Create Event</Button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">My Events</h3>
          <p class="text-gray-600 mb-4">Manage your existing events</p>
          <Button variant="outline">Manage Events</Button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Analytics</h3>
          <p class="text-gray-600 mb-4">View event analytics and insights</p>
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
