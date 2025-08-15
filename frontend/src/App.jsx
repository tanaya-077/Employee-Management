import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function EmployeeGrid() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: "", position: "", department: "", salary: "" });
  const [editingId, setEditingId] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [filterColumn, setFilterColumn] = useState("name");
  const [busy, setBusy] = useState(false);
  const gridRef = useRef();

  const API_URL = "http://localhost:5000/api/employees";

  // Load data
  useEffect(() => { fetchEmployees(); }, []);
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert(error?.response?.data?.error || "Error fetching employees.");
    }
  };

  // Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.department) {
      alert("Fill in Name, Position, Department");
      return;
    }
    const payload = {
      ...formData,
      salary:
        String(formData.salary ?? "").trim() === "" ? null : Number(String(formData.salary).trim())
    };

    setBusy(true);
    try {
      if (editingId) {
        const { data } = await axios.put(`${API_URL}/${editingId}`, payload);
        // update row locally to avoid full refetch
        setEmployees(prev => prev.map(r => (r.id === data.id ? data : r)));
        setEditingId(null);
      } else {
        const { data } = await axios.post(API_URL, payload);
        setEmployees(prev => [...prev, data]);
      }
      setFormData({ name: "", position: "", department: "", salary: "" });
    } catch (error) {
      console.error("Error saving employee:", error);
      alert(error?.response?.data?.error || "Error saving employee.");
    } finally {
      setBusy(false);
    }
  };

  // Prefill for edit
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name ?? "",
      position: employee.position ?? "",
      department: employee.department ?? "",
      salary: employee.salary ?? ""
    });
    setEditingId(employee.id); 
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    setBusy(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEmployees(prev => prev.filter(r => r.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ name: "", position: "", department: "", salary: "" });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(error?.response?.data?.error || "Error deleting employee.");
    } finally {
      setBusy(false);
    }
  };

  // External filter
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(
        value ? { [filterColumn]: { type: "contains", filter: value } } : null
      );
      gridRef.current.api.onFilterChanged();
    }
  };

  const columnDefs = [
    // { field: "id", headerName: "ID", width: 100 ,sortable: true, filter: true },
    {
    headerName: "ID",
    valueGetter: (params) => params.node.rowIndex + 1, // Auto-increment ID
    width: 100,
    sortable: false,
    filter: false
  },
    { field: "name", headerName: "Name", flex: 1, sortable: true, filter: true },
    { field: "position", headerName: "Position", flex: 1, sortable: true, filter: true },
    { field: "department", headerName: "Department", flex: 1, sortable: true, filter: true },
    {
      field: "salary",
      headerName: "Salary",
      flex: 1,
      sortable: true,
      valueFormatter: (p) => (p.value === null || p.value === undefined || p.value === "" ? "-" : `₹${p.value}`)
    },
     
    {
      headerName: "Actions",
      width: 170,
      cellRenderer: (p) => (
        <div className="flex gap-4">
          <button 
            className="bg-blue-500 text-white px-3  rounded hover:bg-blue-600 transition"
            onClick={() => handleEdit(p.data)}
          >
            Edit
          </button>
          <button 
            className="bg-red-500 text-white px-3  rounded hover:bg-red-600 transition"
            onClick={() => handleDelete(p.data.id)}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <form 
        onSubmit={handleSubmit} 
        className="mb-4 grid grid-cols-1 sm:grid-cols-5 gap-2"
      >
      <label className="sm:col-span-5 font-semibold text-gray-700 mb-1">
        Add New Employee
      </label>
        <input 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Position *"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        />
        <input 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Department *"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />
        <input 
          type="number"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Salary (optional)"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
        />
        <button 
          type="submit" 
          disabled={busy}
          className={`bg-${editingId ? 'yellow' : 'green'}-500 text-white px-4 py-2 rounded hover:bg-${
            editingId ? 'yellow' : 'green'
          }-600 transition ${busy ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="mb-3 flex gap-2 flex-wrap">
        <select 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterColumn} 
          onChange={(e) => setFilterColumn(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="position">Position</option>
          <option value="department">Department</option>
          <option value="salary">Salary</option>
        </select>
        <input 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Search ${filterColumn}`}
          value={filterValue}
          onChange={handleFilterChange}
        />
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          onClick={() => { setFilterValue(""); handleFilterChange({ target: { value: "" } }); }}
        >
          Clear
        </button>
      </div>

    <div className="ag-theme-alpine h-[480px]">
        <AgGridReact
          ref={gridRef}
          rowData={employees}
          columnDefs={columnDefs}
          theme="legacy"
          // pagination
          // paginationPageSize={20}
          animateRows
        />
      </div>
    </div>
  );
}