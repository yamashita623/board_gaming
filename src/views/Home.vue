<template>
  <span>
    <home-hero></home-hero>
    <home-details></home-details>
    <home-plans></home-plans>
    <home-registor></home-registor>
    
  </span>
</template>

<script>
import HomeHero from "@/components/HomeHero";
import HomeDetails from "@/components/HomeDetails";
import HomePlans from "@/components/HomePlans";
import HomeRegistor from "@/components/HomeRegistor";

export default {
  name: "home",
  components: {
    HomeHero,
    HomeDetails,
    HomePlans,
    HomeRegistor
  }
};
</script>