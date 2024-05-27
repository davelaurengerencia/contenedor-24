<script>
  // @ts-nocheck
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';

  export let data = { data: [] }; // Initialize with an empty array to avoid undefined errors

  let searchTerm = '';
  let filteredData = data.data;
  let showModal = false;
  let showAddModal = false;
  let currentItem = null;
  let newDescription = '';

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

  async function addItem() {
    const { data: newItem, error } = await supabase
      .from('cfx_temp_insumos_inventario')
      .insert([{ descripcion: newDescription, is_checked: false }])
      .select();

    if (error) {
      console.error('Error adding new item:', error);
    } else {
      data.data.push(newItem[0]);
      data.data.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
      newDescription = '';
      showAddModal = false;
    }
  }

  // Fetch the latest data from the server when the component mounts
  onMount(async () => {
    const { data: loadedData, error } = await supabase
      .from('cfx_temp_insumos_inventario')
      .select('*')
      .order('descripcion', { ascending: true });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      data = { data: loadedData };
    }
  });
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
  .fab {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
      <p>
        {#if currentItem && currentItem.is_checked}
          Cambiar de ✅ a ❌
        {:else}
          Cambiar de ❌ a ✅
        {/if}
      </p>
      <div class="modal-buttons">
        <button on:click={updateItem}>Confirmar</button>
        <button on:click={() => showModal = false}>Cancelar</button>
      </div>
    </div>
  </div>
{/if}

<div class="fab" on:click={() => showAddModal = true}>
  +
</div>

{#if showAddModal}
  <div class="modal">
    <div class="modal-content">
      <h3>Agregar Nuevo Item</h3>
      <input type="text" placeholder="Descripción" bind:value={newDescription} />
      <div class="modal-buttons">
        <button on:click={addItem}>Agregar</button>
        <button on:click={() => showAddModal = false}>Cancelar</button>
      </div>
    </div>
  </div>
{/if}
