import { Request, Response } from "express";
import { pool } from "../db";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

export const getJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [userEmail]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = userResult.rows[0].id;

    const result = await pool.query(
      `SELECT id, company, position, application_date as "applicationDate", 
              status, application_url as "applicationUrl", contact_person as "contactPerson",
              contact_email as "contactEmail", contact_phone as "contactPhone", 
              notes, user_id as "userId", created_at as "createdAt", updated_at as "updatedAt"
       FROM job_applications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [userEmail]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = userResult.rows[0].id;

    const {
      company,
      position,
      applicationDate,
      status,
      applicationUrl,
      contactPerson,
      contactEmail,
      contactPhone,
      notes,
    } = req.body;

    if (!company || !position || !applicationDate || !status) {
      return res
        .status(400)
        .json({
          message:
            "Company, position, application date, and status are required",
        });
    }

    const result = await pool.query(
      `INSERT INTO job_applications 
       (user_id, company, position, application_date, status, application_url, 
        contact_person, contact_email, contact_phone, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, company, position, application_date as "applicationDate", 
                 status, application_url as "applicationUrl", contact_person as "contactPerson",
                 contact_email as "contactEmail", contact_phone as "contactPhone", 
                 notes, user_id as "userId", created_at as "createdAt", updated_at as "updatedAt"`,
      [
        userId,
        company,
        position,
        applicationDate,
        status,
        applicationUrl,
        contactPerson,
        contactEmail,
        contactPhone,
        notes,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const updateJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [userEmail]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = userResult.rows[0].id;

    const jobId = parseInt(req.params.id);
    const {
      company,
      position,
      applicationDate,
      status,
      applicationUrl,
      contactPerson,
      contactEmail,
      contactPhone,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE job_applications 
       SET company = COALESCE($3, company),
           position = COALESCE($4, position),
           application_date = COALESCE($5, application_date),
           status = COALESCE($6, status),
           application_url = COALESCE($7, application_url),
           contact_person = COALESCE($8, contact_person),
           contact_email = COALESCE($9, contact_email),
           contact_phone = COALESCE($10, contact_phone),
           notes = COALESCE($11, notes),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, company, position, application_date as "applicationDate", 
                 status, application_url as "applicationUrl", contact_person as "contactPerson",
                 contact_email as "contactEmail", contact_phone as "contactPhone", 
                 notes, user_id as "userId", created_at as "createdAt", updated_at as "updatedAt"`,
      [
        jobId,
        userId,
        company,
        position,
        applicationDate,
        status,
        applicationUrl,
        contactPerson,
        contactEmail,
        contactPhone,
        notes,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const deleteJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [userEmail]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = userResult.rows[0].id;

    const jobId = parseInt(req.params.id);

    const result = await pool.query(
      "DELETE FROM job_applications WHERE id = $1 AND user_id = $2",
      [jobId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};
