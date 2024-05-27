<script>
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';

  export let data = { data: [] }; // Initialize with an empty array to avoid undefined errors

  let searchTerm = '';
  let filteredData = data.data;
  let showModal = false;
  let currentItem = null;

  // Load data from Supabase on component mount
  async function loadData() {
    const { data: loadedData, error } = await supabase
      .from('cfx_temp_insumos_inventario')
      .select('*')
      .order('descripcion', { ascending: true });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      data = { data: loadedData };
    }
  }

  onMount(loadData);

  $: filteredData = data.data.filter(item =>
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function confirmUpdate(item) {
    currentItem = item;
    showModal = true;
  }

  async function updateItem() {
    if (currentItem) {
      const { data: updatedItem, error } = await supabase
        .from('cfx_temp_insumos_inventario')
        .update({ is_checked: !currentItem.is_checked })
        .eq('codigo', currentItem.codigo)
        .select();

      if (error) {
        console.error(error);
      } else {
        // Find the index of the item to be updated in the data array
        const index = data.data.findIndex(item => item.codigo === currentItem.codigo);
        if (index !== -1) {
          // Update the specific item in the data array
          data.data[index] = updatedItem[0];
          // Sort the updated data array alphabetically by descripcion
          data.data.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        }
      }

      showModal = false;
      currentItem = null;
    }
  }
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  .checked {
    color: green;
  }
  .unchecked {
    color: red;
  }
  .search {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1000;
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>

<input
  class="search"
  type="text"
  placeholder="Buscar..."
  bind:value={searchTerm}
/>

<ul>
  {#each filteredData as item}
    <li class="list-item" on:click={() => confirmUpdate(item)}>
      <span>{item.descripcion}</span>
      <span class={item.is_checked ? 'checked' : 'unchecked'}>
        {#if item.is_checked}
          ✅
        {:else}
          ❌
        {/if}
      </span>
    </li>
  {/each}
</ul>

{#if showModal}
  <div class="modal">
    <div class="modal-content">
      <p>¿Confirmar la actualización del estado del item?</p>
      <div class="modal-buttons">
        <button on:click={updateItem}>Confirmar</button>
        <button on:click={() => showModal = false}>Cancelar</button>
      </div>
    </div>
  </div>
{/if}
