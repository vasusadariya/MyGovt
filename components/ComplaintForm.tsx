import { useState } from "react";

interface ComplaintFormProps {
  onClose: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    complaintType: "",
    date: "",
    area: "",
    description: "",
    name: "",
    contact: "",
    status: "Pending", // Default status
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save complaints in localStorage (simulating backend storage)
    const existingComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    localStorage.setItem("complaints", JSON.stringify([...existingComplaints, formData]));

    alert("Complaint Submitted Successfully!");
    onClose(); // Close the form
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Register a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block font-medium">Type of Complaint</label>
          <select
            name="complaintType"
            value={formData.complaintType}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Type</option>
            <option value="Garbage">Garbage Issue</option>
            <option value="Water">Water Supply Issue</option>
            <option value="Road">Road Damage</option>
            <option value="Electricity">Electricity Problem</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Area</label>
          <input
            type="text"
            name="area"
            placeholder="Enter area"
            value={formData.area}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Describe the issue..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Contact Number</label>
          <input
            type="tel"
            name="contact"
            placeholder="Enter your contact number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;