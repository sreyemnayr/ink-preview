import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export const editions = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
       const client = await clientPromise;
       const db = client.db("order-of-ink");

       let find = {}
       let sort = {}

       if(req.query?.filter){
        if(typeof(req.query.filter) === 'string'){
            find = JSON.parse(req.query.filter)
        }
       }

       if(req.query?.sort && typeof(req.query.sort) === 'string'){
        sort = {[req.query.sort]: 1}
       } else {
        sort = {artist: 1}
       }

       const editions = await db
           .collection("editions")
           .find(find)
           .sort(sort)
           .limit(500)
           .toArray();

       res.json(editions);
   } catch (e) {
       console.error(e);
   }
};

export default editions;