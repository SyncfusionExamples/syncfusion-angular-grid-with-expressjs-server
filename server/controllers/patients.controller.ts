/**
 * Patient Controller – In-memory data + Syncfusion UrlAdaptor logic
 * Fields aligned with Angular EJ2 Grid columns
 */

import { Request, Response } from 'express';

// Updated Patient Interface – matches grid columns exactly
export interface Patient {
  PatientID: number;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;       // ISO date string (e.g. "1990-05-15")
  Gender: string;
  BloodGroup: string;
  ContactNumber: string;
  Email: string;
  Address: string;
  AdmissionDate: string;     // ISO date string
  Department: string;
  AttendingPhysician: string;
  Status: string;
}

// Sample data arrays for random generation
const firstNames = ["John", "Sarah", "Michael", "Emily", "Robert", "Jessica", "David", "Jennifer", "William", "Lisa"];
const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "White"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const genders = ["Male", "Female", "Other"];
const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Oncology", "Radiology"];
const statuses = ["Admitted", "Discharged", "Under Observation", "Critical", "Stable", "Recovering"];
const physicians = ["Dr. James Johnson", "Dr. Sarah Williams", "Dr. Michael Brown", "Dr. Emily Davis", "Dr. Robert Wilson"];

// Generate 1000 realistic patient records
let patients: Patient[] = Array.from({ length: 1000 }, (_, i) => {
  const id = 1001 + i;
  const dob = new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28));
  const admission = new Date(2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28));

  return {
    PatientID: id,
    FirstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    LastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    DateOfBirth: dob.toISOString().split('T')[0],
    Gender: genders[Math.floor(Math.random() * genders.length)],
    BloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
    ContactNumber: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
    Email: `patient${id}@hospital.com`,
    Address: `${Math.floor(Math.random() * 1000)} Main Street, ${["Chennai", "Mumbai", "Delhi", "Bangalore"][Math.floor(Math.random() * 4)]}`,
    AdmissionDate: admission.toISOString().split('T')[0],
    Department: departments[Math.floor(Math.random() * departments.length)],
    AttendingPhysician: physicians[Math.floor(Math.random() * physicians.length)],
    Status: statuses[Math.floor(Math.random() * statuses.length)],
  };
});

// ────────────────────────────────────────────────
// Helper functions (filtering, searching, sorting)
// ────────────────────────────────────────────────

function applyWhere(data: Patient[], where: any[]): Patient[] {
  if (!where?.length) return data;
  return data.filter(item => {
    for (const cond of where) {
      const field = cond.field || cond.name;
      const value = cond.value;
      if (field && item[field as keyof Patient] !== value) {
        return false;
      }
    }
    return true;
  });
}

function applySearch(data: Patient[], search: any[]): Patient[] {
  if (!search?.length) return data;
  // Simplified – can be enhanced with full Syncfusion search logic if needed
  return data;
}

function applySorting(data: Patient[], sorted: any[]): Patient[] {
  if (!sorted?.length) return [...data];
  const copy = [...data];
  copy.sort((a, b) => {
    for (const s of sorted) {
      const dir = s.direction === 'descending' ? -1 : 1;
      const av = a[s.name as keyof Patient];
      const bv = b[s.name as keyof Patient];
      if (av < bv) return -dir;
      if (av > bv) return dir;
    }
    return 0;
  });
  return copy;
}

// ────────────────────────────────────────────────
// Handlers – UrlAdaptor compatible
// ────────────────────────────────────────────────

export const getPatients = (req: Request, res: Response) => {
  try {
    const dm = req.body as any;
    let result = [...patients];

    // Apply filtering (where)
    if (dm.where?.length) result = applyWhere(result, dm.where);

    // Apply searching
    if (dm.search?.length) result = applySearch(result, dm.search);

    const total = result.length;

    // Apply sorting
    if (dm.sorted?.length) result = applySorting(result, dm.sorted);

    // Apply paging
    const skip = dm.skip ?? 0;
    const take = dm.take ?? 12;
    result = result.slice(skip, skip + take);

    res.json({
      result,
      count: dm.requiresCounts ? total : result.length
    });
  } catch (err) {
    console.error('getPatients error:', err);
    res.status(500).json({ result: [], count: 0 });
  }
};

export const createPatient = (req: Request, res: Response) => {
  try {
    const value = req.body.value || req.body;

    const newId = Math.max(...patients.map(p => p.PatientID), 1000) + 1;

    const newPatient: Patient = {
      PatientID: newId,
      FirstName: value.FirstName || '',
      LastName: value.LastName || '',
      DateOfBirth: value.DateOfBirth || new Date().toISOString().split('T')[0],
      Gender: value.Gender || 'Male',
      BloodGroup: value.BloodGroup || 'O+',
      ContactNumber: value.ContactNumber || '',
      Email: value.Email || `patient${newId}@hospital.com`,
      Address: value.Address || '',
      AdmissionDate: value.AdmissionDate || new Date().toISOString().split('T')[0],
      Department: value.Department || 'General Medicine',
      AttendingPhysician: value.AttendingPhysician || 'Dr. James Johnson',
      Status: value.Status || 'Admitted',
    };

    patients.push(newPatient);
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(422).json({ message: 'Create failed' });
  }
};

export const updatePatient = (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const id = Number(key || value?.PatientID);
    if (!id) return res.status(422).json({ message: 'Missing PatientID' });

    const index = patients.findIndex(p => p.PatientID === id);
    if (index === -1) return res.status(404).json({ message: 'Patient not found' });

    patients[index] = { ...patients[index], ...value, PatientID: id };
    res.json(patients[index]);
  } catch (err) {
    res.status(422).json({ message: 'Update failed' });
  }
};

export const deletePatient = (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    const id = Number(key);
    if (!id) return res.status(422).json({ message: 'Missing PatientID' });

    const index = patients.findIndex(p => p.PatientID === id);
    if (index === -1) return res.status(404).json({ message: 'Patient not found' });

    const deleted = patients.splice(index, 1)[0];
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(422).json({ message: 'Delete failed' });
  }
};