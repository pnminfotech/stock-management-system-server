// controllers/tenantController.js
const Tenant = require("../models/Tenant");
const Flats = require("../models/Flat");
const fs = require("fs");
const mongoose = require("mongoose");
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRentReceivedTenants = async (req, res) => {
  try {
    const tenantRentReceived = await Tenant.find({ rent_status: "paid" });
    res.json(tenantRentReceived);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAllRentReceivedTen = async (req, res) => {
  try {
    const tenantRentR = await Tenant.find({ rent_status: "paid" });
    res.json({tenantRentR :tenantRentR.length});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


exports.getAllRentPendingTenants = async (req, res) => {
  try {
    const tenantRentPending = await Tenant.find({ rent_status: "pending" });
    res.json( tenantRentPending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTenantByFlatId = async (req, res) => {
  try {
    const tenant_by_flat_id = await Tenant.find({
      flat_id: req.params.id,
      active: true,
    });
    if (tenant_by_flat_id) {
      res.json(tenant_by_flat_id);
      console.log(tenant_by_flat_id);
    } else {
      res.status(404).json({ message: "Flat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTenant = async (req, res) => {
  const files = req.files;
  console.log("Request Files:", files);
  console.log("Request Params:", req.params);

  try {
    const {
      name,
      ph_no,
      emailId,
      age,
      gender,
      maintaince,
      final_rent,
      deposit,
      current_meter_reading,
      rent_form_date,
      permanant_address,
      previous_address,
      nature_of_work,
      working_address,
      work_ph_no,
      family_members,
      male_members,
      female_members,
      childs,
      family_member_names,
      reference_person1,
      reference_person2,
      reference_person1_age,
      reference_person2_age,
      agent_name,
      rent_status,
      active,
      rentPaid,
    } = req.body;

    // Check for missing files
    const requiredFiles = [
      "tenant_photo",
      "adhar_front",
      "adhar_back",
      "pan_photo",
      "electricity_bill",
    ];

    const missingFiles = requiredFiles.filter(
      (fileField) => !files || !files[fileField]
    );

    if (missingFiles.length > 0) {
      return res.status(400).json({
        message: `The following file fields are missing: ${missingFiles.join(
          ", "
        )}`,
      });
    }

    // Create the tenant
    const tenant = new Tenant({
      name,
      ph_no,
      emailId,
      age,
      gender,
      maintaince,
      final_rent,
      deposit,
      current_meter_reading,
      rent_form_date,
      permanant_address,
      previous_address,
      nature_of_work,
      working_address,
      work_ph_no,
      family_members,
      male_members,
      female_members,
      childs,
      family_member_names,
      reference_person1,
      reference_person2,
      reference_person1_age,
      reference_person2_age,
      agent_name,
      rent_status,
      flat_id: req.params.id,
      active,
      rentPaid,
      tenant_photo: files.tenant_photo[0].path,
      adhar_front: files.adhar_front[0].path,
      adhar_back: files.adhar_back[0].path,
      pan_photo: files.pan_photo[0].path,
      electricity_bill: files.electricity_bill[0].path,
    });

    // Save the tenant
    const newTenant = await tenant.save();
    const updatedFlat = await Flats.findByIdAndUpdate(
      req.params.id,
      { flat_status: "allotted" },
      { new: true }
    );

    // Send a success message back to the front-end
    return res.status(201).json({
      message: "Tenant created successfully!",
      tenant: newTenant,
    });
  } catch (err) {
    // Handle error
    if (files) {
      Object.values(files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error(`Error deleting file: ${file.path}`);
          });
        });
      });
    }
    return res.status(400).json({ message: err.message });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.name = req.body.name || tenant.name;
      tenant.ph_no = req.body.ph_no || tenant.ph_no;
      tenant.emailId = req.body.emailId || tenant.emailId;
      tenant.age = req.body.age || tenant.age;
      tenant.gender = req.body.gender || tenant.gender;
      tenant.maintaince = req.body.maintaince || tenant.maintaince;
      tenant.final_rent = req.body.final_rent || tenant.final_rent;
      tenant.deposit = req.body.deposit || tenant.deposit;
      tenant.current_meter_reading =
        req.body.current_meter_reading || tenant.current_meter_reading;
      tenant.rent_form_date = req.body.rent_form_date || tenant.rent_form_date;
      tenant.permanant_address =
        req.body.permanant_address || tenant.permanant_address;
      tenant.previous_address =
        req.body.previous_address || tenant.previous_address;
      tenant.nature_of_work = req.body.nature_of_work || tenant.nature_of_work;
      tenant.working_address =
        req.body.working_address || tenant.working_address;
      tenant.work_ph_no = req.body.work_ph_no || tenant.work_ph_no;
      tenant.family_members = req.body.family_members || tenant.family_members;
      tenant.male_members = req.body.male_members || tenant.male_members;
      tenant.female_members = req.body.female_members || tenant.female_members;
      tenant.childs = req.body.childs || tenant.childs;
      tenant.family_member_names =
        req.body.family_member_names || tenant.family_member_names;
      tenant.reference_person1 =
        req.body.reference_person1 || tenant.reference_person1;
      tenant.reference_person2 =
        req.body.reference_person2 || tenant.reference_person2;
      tenant.reference_person1_age =
        req.body.reference_person1_age || tenant.reference_person1_age;
      tenant.reference_person2_age =
        req.body.reference_person2_age || tenant.reference_person2_age;
      tenant.agent_name = req.body.agent_name || tenant.agent_name;
      tenant.flat_id = req.body.flat_id || tenant.flat_id;
      tenant.rent_status = req.body.rent_status || tenant.rent_status;

      const updatedTenant = await tenant.save();
      res.json(updatedTenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      await tenant.deleteOne();
      res.json({ message: "Tenant deleted" });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Example implementation in tenantController.js
exports.getTenantsWithRentPending = async (req, res) => {
  try {
    const tenants = await Tenant.find({ rent_status: "pending" });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTenantsWithRentReceived = async (req, res) => {
  try {
    const tenants = await Tenant.find({ rent_status: "paid" });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getActiveTenants = async (req, res) => {
  console.log("Hii");
  try {
    const activeTenants = await Tenant.find({ tenant_status: "Active" });
    res.json(activeTenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Deactivate Tenant
exports.deactivateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.active = false; // Assuming `active` field is used to track tenant status
      const updatedTenant = await tenant.save();
      res.json({ message: "Tenant deactivated", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.activateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.active = true; // Assuming `active` field is used to track tenant status
      const updatedTenant = await tenant.save();
      res.json({ message: "Tenant activated", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRentAsPaid = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.rentPaid = true; // Assuming `rentPaid` field is used to track rent payment status
      const updatedTenant = await tenant.save();
      res.json({ message: "Rent marked as paid", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deactiveTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (tenant) {
      tenant.status = "Deactivated"; // or tenant.active = false;
      const updatedTenant = await tenant.save();
      res.json({ message: "Tenant deactivated", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rentStatusChange = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { rent_status, ph_no, rent_form_date } = req.body;

    // Find the tenant by ID and update their rent_status
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { rent_status ,
        ph_no, 
        rent_form_date 
      },
      { new: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.status(200).json(updatedTenant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// controllers/tenantController.js

exports.getTenantsBySocietyWingFlat = async (req, res) => {
  const { society_id, wing_id, flat_id } = req.params;

  if (!society_id || !wing_id || !flat_id) {
    return res.status(400).json({
      message: "All parameters (society_id, wing_id, flat_id) are required.",
    });
  }

  console.log("Parameters:", { society_id, wing_id, flat_id });

  try {
    const tenants = await Tenant.find({
      society_id: society_id,
      wing_id: wing_id,
      flat_id: flat_id,
    });

    console.log("Tenants Found:", tenants);

    if (tenants.length === 0) {
      return res
        .status(404)
        .json({ message: "No tenants found for the given parameters." });
    }

    res.json(tenants);
  } catch (err) {
    console.error("Error Fetching Tenants:", err);
    res.status(500).json({ message: err.message });
  }
};
