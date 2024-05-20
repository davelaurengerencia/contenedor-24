<script>
  import { onMount } from 'svelte';
  import rollosData from '$lib/data.json';

  let rollos = rollosData;
  let selectedColor = '';
  let selectedRollo = null;
  let filteredRollos = [];
  let selectedNW = null;
  let selectedMTS = null;

  $: filteredRollos = rollos.filter(rollo => rollo.color === selectedColor);
  $: selectedNW = null; // Reset the displayed NW when color or roll changes
  $: selectedMTS = null; // Reset the displayed MTS when color or roll changes

  function handleColorChange(event) {
    selectedColor = event.target.value;
    selectedRollo = null; // Reset the rollo selection
  }

  function handleRolloChange(event) {
    selectedRollo = event.target.value;
  }

  function buscarDatos() {
    if (selectedRollo) {
      const rollo = filteredRollos.find(rollo => rollo.roll_no === parseInt(selectedRollo));
      if (rollo) {
        selectedNW = rollo.nw;
        selectedMTS = rollo.mts;
      }
    }
  }
</script>

<div class="container">
  <select id="color" class="form-select mb-2" aria-label="Select color" on:change={handleColorChange}>
    <option selected disabled>Color</option>
    {#each [...new Set(rollos.map(rollo => rollo.color))] as color}
      <option value={color}>{color}</option>
    {/each}
  </select>

  <select id="rollo" class="form-select mb-2" aria-label="Select roll number" on:change={handleRolloChange} disabled={!selectedColor}>
    <option selected disabled>#Rollo</option>
    {#if filteredRollos.length > 0}
      {#each filteredRollos as rollo}
        <option value={rollo.roll_no}>{rollo.roll_no}</option>
      {/each}
    {/if}
  </select>

  <button class="btn btn-primary mb-2 btn-lg" on:click={buscarDatos} disabled={!selectedRollo}> 
    BUSCAR
  </button>

  {#if selectedNW !== null && selectedMTS !== null}
    <div class="text-center fs-1 bg-danger rounded text-light mb-2">
      MTS: {selectedMTS}
    </div>
    <div class="text-center fs-1 bg-warning rounded text-light">
      KG: {selectedNW}
    </div>
  {/if}
</div>

<style>
  .btn-lg {
    width: 100%;
  }
  .bg-warning {
    padding: 1rem;
  }
  .bg-danger {
    padding: 1rem;
  }
</style>

