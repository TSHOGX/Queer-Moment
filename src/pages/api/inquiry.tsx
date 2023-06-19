import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Message } from "@prisma/client";

const prisma = new PrismaClient();

export default async function inquiry(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return await createMsg(req, res);
  } else if (req.method === "GET" && req.headers["data-range"] === "all") {
    return await getAllMsg(req, res);
  } else if (req.method === "GET") {
    return await getOneMsg(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getOneMsg(req: NextApiRequest, res: NextApiResponse) {
  try {
    const target = req.headers["data-range"];

    const oneMsg = await prisma.message.findUnique({
      where: { id: Number(target) },
    });
    return res.status(200).json({ oneMsg, success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Error getting from database", success: false });
  }
}

async function getAllMsg(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allMsg = await prisma.message.findMany({
      select: {
        id: true,
        name: true,
        date: true,
      },
    });
    return res.status(200).json({ allMsg, success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Error getting from database", success: false });
  }
}

async function createMsg(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  try {
    const newEntry: Message = await prisma.message.create({
      data: {
        name: body.name != null ? body.name : undefined,
        date: body.selectedDate,
        content: body.content != null ? body.content : undefined,
      },
    });
    return res.status(200).json({ newEntry, success: true });
  } catch (error) {
    console.error("Request error", error);
    return res
      .status(500)
      .json({ error: "Error creating question", success: false });
  }
}
