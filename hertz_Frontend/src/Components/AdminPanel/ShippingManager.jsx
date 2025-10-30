import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTruck } from "react-icons/fa";

const ShippingManagement = () => {
  const [couriers, setCouriers] = useState([
    { id: 1, name: "Shiprocket", active: true },
    { id: 2, name: "Delhivery", active: false },
  ]);
  const [shipments, setShipments] = useState([
    {
      id: "SHP1001",
      orderId: "ORD1001",
      courier: "Shiprocket",
      trackingId: "TRK123",
      status: "Shipped",
      date: "2025-06-20",
    },
  ]);
  const [pincodes, setPincodes] = useState(["400001", "110001"]);
  const [newCourier, setNewCourier] = useState({ name: "", active: false });
  const [newPincode, setNewPincode] = useState("");
  const [filters, setFilters] = useState({ status: "", courier: "" });

  const handleCourierChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCourier({
      ...newCourier,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePincodeChange = (e) => {
    setNewPincode(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleAddCourier = (e) => {
    e.preventDefault();
    if (!newCourier.name) {
      alert("Courier name is required!");
      return;
    }
    setCouriers([...couriers, { ...newCourier, id: couriers.length + 1 }]);
    setNewCourier({ name: "", active: false });
    console.log("Added courier:", newCourier);
  };

  const handleAddPincode = (e) => {
    e.preventDefault();
    if (!newPincode) {
      alert("Pincode is required!");
      return;
    }
    setPincodes([...pincodes, newPincode]);
    setNewPincode("");
    console.log("Added pincode:", newPincode);
  };

  const handleDeletePincode = (pincode) => {
    setPincodes(pincodes.filter((p) => p !== pincode));
    console.log(`Deleted pincode: ${pincode}`);
  };

  const handleTrackShipment = (id, trackingId) => {
    console.log(`Track shipment ${id} with tracking ID: ${trackingId}`);
  };

  const handlePrintLabel = (id) => {
    console.log(`Print shipping label for shipment ${id}`);
  };

  const filteredShipments = shipments.filter(
    (s) =>
      (!filters.status || s.status === filters.status) &&
      (!filters.courier || s.courier === filters.courier)
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTruck className="text-blue-700 mr-2" /> Shipping Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add Courier
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Courier Name
              </label>
              <input
                type="text"
                name="name"
                value={newCourier.name}
                onChange={handleCourierChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter courier name"
              />
            </div>
            <div>
              <label className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="active"
                  checked={newCourier.active}
                  onChange={handleCourierChange}
                  className="mr-2 focus:ring-blue-500"
                />
                Set as Default
              </label>
            </div>
          </div>
          <motion.button
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={handleAddCourier}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Add Courier
          </motion.button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add Pincode
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newPincode}
              onChange={handlePincodeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter pincode"
            />
            <motion.button
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onClick={handleAddPincode}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Add
            </motion.button>
          </div>
          <div className="mt-4">
            {pincodes.map((pincode, index) => (
              <motion.div
                key={pincode}
                className="flex justify-between items-center border-b py-2 hover:bg-blue-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <span className="text-sm text-gray-700">{pincode}</span>
                <motion.button
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                  onClick={() => handleDeletePincode(pincode)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Delete
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Filter by Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Filter by Courier
            </label>
            <select
              name="courier"
              value={filters.courier}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All</option>
              {couriers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Shipments
          </h3>
          {filteredShipments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No shipments found.
            </p>
          ) : (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Shipment ID</th>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Courier</th>
                  <th className="px-4 py-2">Tracking ID</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment, index) => (
                  <motion.tr
                    key={shipment.id}
                    className="border-b hover:bg-blue-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="px-4 py-2">{shipment.id}</td>
                    <td className="px-4 py-2">{shipment.orderId}</td>
                    <td className="px-4 py-2">{shipment.courier}</td>
                    <td className="px-4 py-2">{shipment.trackingId}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        shipment.status === "Delivered"
                          ? "text-blue-700"
                          : "text-yellow-600"
                      }`}
                    >
                      {shipment.status}
                    </td>
                    <td className="px-4 py-2">{shipment.date}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <motion.button
                        className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        onClick={() =>
                          handleTrackShipment(shipment.id, shipment.trackingId)
                        }
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Track
                      </motion.button>
                      <motion.button
                        className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        onClick={() => handlePrintLabel(shipment.id)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Print Label
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingManagement;
