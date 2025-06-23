<template>
  <v-sheet
    :max-width="400"
    class="d-flex flex-column align-center justify-center text-center h-screen mx-auto"
  >
    <v-avatar size="x-large" color="primary" class="mb-6 elevation-2">
      <v-icon size="x-large">mdi-check-bold</v-icon>
    </v-avatar>
    <v-card-title class="text-h4 text-primary mb-3 font-weight-medium"
      >Business Added Successfully!</v-card-title
    >
    <v-card-title class="text-body-1 text-on-surface-variant mb-6 text-wrap">
      Your business has been added to the platform. Thank you for joining us!
    </v-card-title>

    <v-card-actions class="d-flex flex-column align-center justify-center w-100 px-4">
      <v-btn
        color="primary"
        class="text-none rounded-xl mb-4"
        variant="elevated"
        block
        size="large"
      >
        Continue to Customise Profile
      </v-btn>
      <v-btn
        color="primary"
        class="text-none rounded-xl"
        variant="outlined"
        elevation="2"
        block
        size="large"
      >
        Go to Dashboard
      </v-btn>
    </v-card-actions>
  </v-sheet>
</template>
