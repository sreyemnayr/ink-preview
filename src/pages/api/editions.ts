import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export const editions = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
       const client = await clientPromise;
       const db = client.db("order-of-ink");

       const editions = await db
           .collection("editions")
           .find({})
           .sort({ artist: 1 })
           .limit(500)
           .toArray();

       res.json(editions);
   } catch (e) {
       console.error(e);
   }
};

export default editions;