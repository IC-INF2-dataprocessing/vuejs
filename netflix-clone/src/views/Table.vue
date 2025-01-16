<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  data: Array,
  columns: Array
})

const emit = defineEmits(['edit', 'delete'])

const editingRow = ref(null)
const editedData = ref({})

function startEdit(row) {
  editingRow.value = row.id
  editedData.value = { ...row }
}

function cancelEdit() {
  editingRow.value = null
  editedData.value = {}
}

function saveEdit() {
  emit('edit', editedData.value)
  editingRow.value = null
  editedData.value = {}
}

function deleteRow(row) {
  emit('delete', row)
}
</script>

<template>
  <table v-if="data.length">
    <thead>
      <tr>
        <th v-for="key in columns" :key="key">{{ key }}</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in data" :key="entry.id">
        <td v-for="key in columns" :key="key">
          <template v-if="editingRow === entry.id">
            <input v-model="editedData[key]" />
          </template>
          <template v-else>
            {{ entry[key] || "NULL" }}
          </template>
        </td>
        <td>
          <template v-if="editingRow === entry.id">
            <button @click="saveEdit">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </template>
          <template v-else>
            <button @click="startEdit(entry)">Edit</button>
            <button @click="deleteRow(entry)">Delete</button>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-else>No data available.</p>
</template>

<style>
table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.66);
}

th {
  background-color: #42b983;
  color: rgba(0, 0, 0, 0.66);
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}
</style>