<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Table from './Table.vue'

const tableData = ref([])
const columns = ref([])

const baseURL = 'http://localhost:9000/api/'
const tableNames = ['users', 'profiles', 'languages', 'subtitles', 'subscriptions', 'genres', 'preferences']
const tableKeys = {"languages": ["name"], "subtitles": ["name"], "subscriptions": ["description", "price"], "genres": ["name"], "preferences": ["name"]}
const selectedTable = ref(tableNames[0])

// Fetch data for the selected table
async function fetchTableData() {
  try {
    const table = selectedTable.value
    const fullURL = `${baseURL}${table}`
    const response = await axios.get(fullURL)
    tableData.value = response.data
    if (tableKeys[selectedTable.value]){
      columns.value = tableKeys[selectedTable.value]
    }
    else {
      columns.value = response.data.length ? Object.keys(response.data[0]) : []
    }
  } catch (error) {
    console.error('Error fetching table data:', error)
    tableData.value = []
    columns.value = []
  }
}

// Handle edit operation
async function handleEdit(updatedRow) {
  try {
    const table = selectedTable.value
    const fullURL = `${baseURL}${table}/${updatedRow.id}`
    await axios.put(fullURL, updatedRow)
    fetchTableData()
  } catch (error) {
    console.error('Error updating row:', error)
  }
}

// Handle delete operation
async function handleDelete(row) {
  try {
    const table = selectedTable.value
    const fullURL = `${baseURL}${table}/${row.id}`
    await axios.delete(fullURL)
    fetchTableData()
  } catch (error) {
    console.error('Error deleting row:', error)
  }
}

// Handle create operation
async function handleCreate(event) {
  try {
    const formData = new FormData(event.target)
    const newRow = Object.fromEntries(formData.entries()) 

    const table = selectedTable.value
    const fullURL = `${baseURL}${table}`
    await axios.post(fullURL, newRow)
    fetchTableData()
    event.target.reset()
  } catch (error) {
    console.error('Error creating row:', error)
  }
}

watch(selectedTable, () => {
  fetchTableData()
})

onMounted(() => {
  fetchTableData()
})
</script>

<template>
  <div class="dashboard-page">
    <h1>Dynamic Table Viewer</h1>
    <label for="table-selector">Select Table:</label>
    <select id="table-selector" v-model="selectedTable">
      <option v-for="table in tableNames" :key="table" :value="table">
        {{ table }}
      </option>
    </select>

    <!-- Add a form for creating new rows -->
    <div v-if="columns && columns.length > 0">
      <h3>Add New Row</h3>
      <form @submit.prevent="handleCreate($event)">
        <div v-for="key in columns" :key="key">
          <label :for="key">{{ key }}:</label>
          <input :name="key" :id="key" />
        </div>
        <button type="submit">Add Row</button>
      </form>
    </div>

    <!-- Table component with CRUD event handlers -->
    <Table
      :data="tableData"
      :columns="columns"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<style>
/* Your existing styles */
</style>